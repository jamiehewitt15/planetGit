import React, { Component } from 'react';
import './App.css';
import Promotions from '../abis/Promotions.json';
import Web3 from 'web3';

class ShowPromotions extends Component {
    
    async componentWillMount(){
      await this.loadWeb3();
      await this.loadBlockchainData();
      await this.getPrice();
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
        const networkData = Promotions.networks[networkId];
        if (networkData){
          console.log("networkData", networkData);
          const abi = Promotions.abi;
          console.log("abi: ", abi);
          const address = networkData.address;
          console.log("address: ", address);
          // Fetch Contract Data
          const contract = web3.eth.Contract(abi, address);
          this.setState({ address });
          this.setState({ contract });
          console.log("Contract", contract);
        } else {
          window.alert("Sorry, the smart contract not deploy to the current network.")
        }
    }
      
    getPrice = async() => {
        try{
            const price = (await this.state.contract.methods.getPrice().call()).toNumber();
            this.setState({ price });
            console.log("Price:", price)
          } catch(error){
              console.log("error: ", error)
          }
    }

    createPromotion = async(event) => {
        event.preventDefault();
        const amount = document.getElementById("captureAmount").value;
        const repoSlug = document.getElementById("captureRepoSlug").value;
        try{
            await this.state.contract.methods.approve(this.state.address, amount);
            await this.state.contract.methods.createPromotion(repoSlug, amount).send({from: this.props.account});
        } catch(error){
            console.log("error", error)
        }
    }

    constructor(props) {
      super(props);
      this.state = {
          promotions: '',
          contract: '',
          address: '',
          price: '',
      };
    }
    
  render() {
    return (
      <div className="createPromotionPage">
        <h1>Promote Your Project</h1>
        <p>Create a promoton</p>
        <p>The current price for promoting your project is: {this.state.price}</p>
        <form onSubmit={this.onSubmit} className="form">
          Repo Slug: <input type="text" id="captureRepoSlug" name="usernameInput" className="form-left"/><br /><br />
          Price: <input type="number" id="captureAmount" name="fileList" className="form-left"/><br /><br />
          <input type='submit'  />
        </form>
      </div>
    );
  }
}

export default ShowPromotions;
