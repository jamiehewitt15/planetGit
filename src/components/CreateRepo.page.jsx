import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import { Form, Button  } from 'react-bootstrap';
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
            this.state.repositoryContract.methods.createRepo(repoSlug, repoName, repoHash).send({from: this.props.account})
            .on('transactionHash', () => {
              this.setState({redirect: true})
            })
            .on('error', (error) => {
                console.log("Error: ", error);
            })
        } catch(error){
            console.log("error", error)
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
        repositoryAddress: '',
        repositoryContract: '',
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
        <h1>Create a Repo</h1>
        <p>Create you repo here</p>
        <Form onSubmit={this.createRepo} className="form">
        <Form.Group controlId="createRepo">
          <Form.Label>Repo Slug:</Form.Label>
            <Form.Control type="text" id="captureRepoSlug" name="usernameInput" className="form-left"/><br /><br />
          <Form.Label>Repo Name:</Form.Label>
            <Form.Control type="text" id="captureRepoName" name="fileList" className="form-left"/><br /><br />
          <Form.Label>Repo Hash:</Form.Label>
            <Form.Control type="text" id="captureRepoHash" name="fileList" className="form-left"/><br /><br />
          <Button type='submit'>Submit</Button>
        </Form.Group>
        </Form>
      </div>
    );
  }
}

export default CreateRepo;
