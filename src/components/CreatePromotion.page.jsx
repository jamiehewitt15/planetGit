import React, { Component } from 'react';
import  { Redirect } from 'react-router-dom'
import { Form, Button  } from 'react-bootstrap';
import './App.css';
import Promotions from '../abis/Promotions.json';
import Token from '../abis/GLDToken.json'
import Web3 from 'web3';

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' });

class CreatePromotions extends Component {
    
    async componentWillMount(){
      await this.loadWeb3();
      await this.loadBlockchainData();
      await this.getPrice();
      await this.getBalance();
    }
  
    async loadWeb3(){
      if(window.ethereum){
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
      } if(window.web3){
        window.web3 = new Web3(window.web3.currentProvider);
      } else {
        window.alert("Please install and use Metamask to interact with this web app. Visit metamask.io");
      }
    }

    async loadBlockchainData(){
        // Get smart contract network
        const web3 = window.web3;
        const networkId = await web3.eth.net.getId();
        console.log("networkId", networkId)
        // Get netwrok address
        const promotionsNetworkData = Promotions.networks[networkId];
        const tokenNetworkData = Token.networks[networkId];
        if (promotionsNetworkData && tokenNetworkData){
          const promotionsAbi = Promotions.abi;
          const tokenAbi = Token.abi;
          const promotionAddress = promotionsNetworkData.address;
          const tokenAddress = tokenNetworkData.address;
          console.log("Promotions Address", tokenAddress)
          // Fetch Contract Data
          const promotionContract = web3.eth.Contract(promotionsAbi, promotionAddress);
          const tokenContract = web3.eth.Contract(tokenAbi, tokenAddress);
          this.setState({ tokenAddress });
          this.setState({ tokenContract });
          this.setState({ promotionAddress });
          this.setState({ promotionContract });
        } else {
          window.alert("Sorry, the smart contract not deploy to the current network.")
        }
    }
      
    getPrice = async() => {
        try{
            const price = (await this.state.promotionContract.methods.getPrice().call()).toNumber();
            this.setState({ price });
            console.log("Price:", price)
          } catch(error){
              console.log("error: ", error)
          }
    }
 
    getBalance = async() => {
        const web3 = window.web3;  
        const accounts = await web3.eth.getAccounts();
        this.setState({ account: accounts[0] });
        try{
            console.log("this.state.account", this.state.account);
            let balance = (await this.state.tokenContract.methods.balanceOf(this.state.account).call()).toString();
            console.log("Balance 1:", balance)
            balance = web3.utils.fromWei(balance, 'ether')
            this.setState({ balance });
            console.log("Balance:", balance)
          } catch(error){
              console.log("error: ", error)
          }
    }

    createPromotion = async(event) => {
      event.preventDefault();
      const img = this.state.imgBuffer;
      const postResponse = await ipfs.add(img);
      const imgHash = postResponse.path;
      
      const amount = document.getElementById("captureAmount").value;
      const repoSlug = document.getElementById("captureRepoSlug").value;
      console.log("amount: ", amount);
      console.log("repoSlug: ", repoSlug);
      try{
          this.state.tokenContract.methods.approve(this.state.promotionAddress, amount).send({from: this.state.account})
          .on('transactionHash', () => {
              this.state.promotionContract.methods.createPromotion(repoSlug, imgHash, amount).send({from: this.state.account})
              .on('transactionHash', () => {
                  this.setState({redirect: true})
              })
              .on('error', (error) => {
                  console.log("Error: ", error)
              })
          })
          .on('error', (error) => {
              console.log("Error: ", error)
          })
      } catch(error){
          console.log("error", error)
      }
    }

    captureImg = (event) => {
    event.preventDefault();
    console.log('The file has been captured!');
    const file = event.target.files[0];
    console.log('This is the upload: ', file);
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
        console.log('load end...');
        console.log('Buffer: ', Buffer(reader.result));
        this.setState({ imgBuffer: reader.result })
      }
    }

    renderRedirect = () => {
        if (this.state.redirect) {
          return <Redirect to='/target' />
        }
      }

    constructor(props) {
      super(props);
      this.state = {
          tokenAddress: '',
          tokenContract: '',
          promotionContract: '',
          promotionAddress: '',
          account: '',
          promotions: '',
          price: '',
          balance: '',
          redirect: false,
          imgBuffer: '',
      };
    }
    
  render() {
    return (
      <div className="createPromotionPage">
        {this.renderRedirect()}
        <h1>Promote Your Project</h1>
        <p>Create a promoton</p>
        <p>The current price for promoting your project is: {this.state.price}</p>
        <p>Your current balance is: {this.state.balance}</p>
        <Form onSubmit={this.createPromotion} className="form">
        <Form.Group>
          <Form.Label>Repo Slug:</Form.Label>
            <Form.Control type="text" id="captureRepoSlug" name="usernameInput" className="form-left"/><br /><br />
          <Form.Label>Price:</Form.Label>
            <Form.Control type="number" id="captureAmount" name="fileList" className="form-left"/><br /><br />
            <Form.File type="file" id="filepicker" name="fileList" onChange={this.captureImg} className="form-left"/>
            <Button type='submit'>Submit</Button>
        </Form.Group>
        </Form>
      </div>
    );
  }
}

export default CreatePromotions;
