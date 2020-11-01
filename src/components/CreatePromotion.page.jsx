import React, { Component } from 'react';
import './App.css';
import Promotions from '../abis/Promotions.json';
import Token from '../abis/GLDToken.json'
import Web3 from 'web3';

class ShowPromotions extends Component {
    
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
        const amount = document.getElementById("captureAmount").value;
        const repoSlug = document.getElementById("captureRepoSlug").value;
        console.log("amount: ", amount);
        console.log("repoSlug: ", repoSlug);
        try{
            const response = await this.state.tokenContract.methods.approve(this.state.promotionAddress, amount).send({from: this.state.account});
            console.log("response", response);
            const response1 = await this.state.promotionContract.methods.createPromotion(repoSlug, amount).send({from: this.state.account});
            console.log("response1", response1);
        } catch(error){
            console.log("error", error)
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
      };
    }
    
  render() {
    return (
      <div className="createPromotionPage">
        <h1>Promote Your Project</h1>
        <p>Create a promoton</p>
        <p>The current price for promoting your project is: {this.state.price}</p>
        <p>Your current balance is: {this.state.balance}</p>
        <form onSubmit={this.createPromotion} className="form">
          Repo Slug: <input type="text" id="captureRepoSlug" name="usernameInput" className="form-left"/><br /><br />
          Price: <input type="number" id="captureAmount" name="fileList" className="form-left"/><br /><br />
          <input type='submit'  />
        </form>
      </div>
    );
  }
}

export default ShowPromotions;
