import React, { Component } from 'react';
import './App.css';
import Repository from '../abis/Repository.json';
import Web3 from 'web3';

class ShowPromotions extends Component {
    
    async componentWillMount(){
      await this.loadWeb3();
      
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

    async loadRepos(){
      const web3 = window.web3; 
      // Get smart contract network
      const networkId = await web3.eth.net.getId();
      console.log("networkId", networkId)
      // Get netwrok address
      const networkData = Repository.networks[networkId];
      if (networkData){
        console.log("networkData", networkData);
        const abi = Repository.abi;
        console.log("abi: ", abi);
        const address= networkData.address;
        console.log("address: ", address);
        // Fetch Contract Data
        const contract = web3.eth.Contract(abi, address);
        this.setState({ contract });
        console.log("Contract", contract);
        try{
          const repositories = await contract.methods.getAllRepos().call();
          console.log("getAllRepos", repositories);
          
          if(repositories){
            this.setState({ repositories: repositories })
            console.log("> STATE > All repositories", this.state.repositories );
          } else{
            console.log("No userName recieved")
          }
        } catch(e){
          console.log("Error", e)
        }
        
      } else {
        window.alert("Sorry, the smart contract not deploy to the current network.")
      }
    }

    constructor (props) {
      super(props);
      
      this.state = {
        repositories:  new Array().fill().map((value, index) => ({ id: index, repoSlug: '' })),
      };
      this.loadRepos();
    }
    
  render() {
    return (
      <div className="repositoriesSection" >
        <h2 className="promotionsTitle">All Repositories</h2>
        {this.state.repositories.slice(0, 50).map(((repository) => (
           <div key={repository.id} ><p className="repoDiv">{repository}</p></div>
        )))} 
      </div>
    );
  }
}

export default ShowPromotions;
