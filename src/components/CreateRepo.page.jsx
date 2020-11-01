import React, { Component } from 'react';
import './App.css';
import Repository from '../abis/Repository.json';
import Web3 from 'web3';

class CreateRepo extends Component {
    
    async componentWillMount(){
      await this.loadWeb3();
      await this.loadBlockchainData();
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
        const repositoryNetworkData = Repository.networks[networkId];
        if (repositoryNetworkData){
          const repositoryAbi = Repository.abi;
          const repositoryAddress = repositoryNetworkData.address;
          console.log("Repository Address", repositoryAddress)
          // Fetch Contract Data
          const repositoryContract = web3.eth.Contract(repositoryAbi, repositoryAddress);
          this.setState({ repositoryAddress });
          this.setState({ repositoryContract });
        } else {
          window.alert("Sorry, the smart contract not deploy to the current network.")
        }
    }

 
    createRepo = async(event) => {
        event.preventDefault();
        const repoName = document.getElementById("captureRepoName").value;
        const repoSlug = document.getElementById("captureRepoSlug").value;
        const repoHash = document.getElementById("captureRepoHash").value;
        try{
            await this.state.repositoryContract.methods.createRepo(repoSlug, repoName, repoHash).send({from: this.props.account});
        } catch(error){
            console.log("error", error)
        }
    }

    constructor(props) {
      super(props);
      this.state = {
        repositoryAddress: '',
        repositoryContract: '',
        account: '',
        promotions: '',
        price: '',
        balance: '',
      };
    }
    
  render() {
    return (
      <div className="createPromotionPage">
        <h1>Create a Repo</h1>
        <p>Create you repo here</p>
        <form onSubmit={this.createRepo} className="form">
          Repo Slug: <input type="text" id="captureRepoSlug" name="usernameInput" className="form-left"/><br /><br />
          Repo Name: <input type="text" id="captureRepoName" name="fileList" className="form-left"/><br /><br />
          Repo Hash: <input type="text" id="captureRepoHash" name="fileList" className="form-left"/><br /><br />
          <input type='submit'  />
        </form>
      </div>
    );
  }
}

export default CreateRepo;
