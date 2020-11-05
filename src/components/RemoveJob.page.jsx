import React, { Component } from 'react';
import  { Redirect } from 'react-router-dom'
import { Form, Button  } from 'react-bootstrap';
import './App.css';
import Jobs from '../abis/Jobs.json';
import Token from '../abis/GLDToken.json'
import Web3 from 'web3';

class RemoveJob extends Component {
    
    async componentWillMount(){
      await this.loadWeb3();
      await this.loadBlockchainData();
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
        const jobsNetworkData = Jobs.networks[networkId];
        const tokenNetworkData = Token.networks[networkId];
        if (jobsNetworkData && tokenNetworkData){
          const jobsAbi = Jobs.abi;
          const tokenAbi = Token.abi;
          const jobsAddress = jobsNetworkData.address;
          const tokenAddress = tokenNetworkData.address;
          console.log("Jobs Address", tokenAddress)
          // Fetch Contract Data
          const jobsContract = web3.eth.Contract(jobsAbi, jobsAddress);
          const tokenContract = web3.eth.Contract(tokenAbi, tokenAddress);
          this.setState({ tokenAddress });
          this.setState({ tokenContract });
          this.setState({ jobsAddress });
          this.setState({ jobsContract });
        } else {
          window.alert("Sorry, the smart contract not deploy to the current network.")
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

    removeJob = async(event) => {
        event.preventDefault();
        const ID = document.getElementById("captureID").value;
        console.log("ID: ", ID);
        try{
            this.state.jobsContract.methods.removeJob(ID).send({from: this.state.account})
            .on('transactionHash', (response) => {
                console.log("response", response)
                this.setState({redirect: true})
            })
            .on('error', (error) => {
                console.log("Error: ", error)
            })
            
        } catch(error){
            console.log("error", error)
        }
    }

    renderRedirect = () => {
        if (this.state.redirect) {
          return <Redirect to='/' />
        }
      }

    constructor(props) {
      super(props);
      this.state = {
          tokenAddress: '',
          tokenContract: '',
          jobsContract: '',
          jobsAddress: '',
          account: '',
          promotions: '',
          price: '',
          balance: '',
          redirect: false,
      };
    }
    
  render() {
    return (
      <div className="createPromotionPage">
        {this.renderRedirect()}
        <h1>Remove a Job</h1>
        <p>Enter the ID to remove a job advert and refund your stake.</p>
        <p>Your current balance is: {this.state.balance}</p>
        <Form onSubmit={this.removeJob} className="form jobForm">
        <Form.Label>Job ID:</Form.Label>
          <Form.Control type="number" id="captureID" name="usernameInput" className="form-left jobInput"/><br /><br />
          <Button type='submit'>Submit</Button>
        </Form>
      </div>
    );
  }
}

export default RemoveJob;
