import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';
import UserContract from '../abis/UserContract.json';
import CreateUser from './Signup.page.jsx';
import {useParams} from "react-router-dom";

function Username() {
  // We can use the `useParams` hook here to access
  // the dynamic pieces of the URL.
  let { username } = useParams();

  return (
    <div>
      <h3>{username}</h3>
    </div>
  );
}

export default class User extends Component {
    
  async componentWillMount(){
    await this.loadWeb3();
  }
  
  async loadUserImg(){
    const web3 = window.web3;
    // Get smart contract network
    const networkId = await web3.eth.net.getId();
    console.log("networkId", networkId)
    // Get netwrok address
    const networkData = UserContract.networks[networkId];
    if (networkData){
      console.log("networkData", networkData);
      const abi = UserContract.abi;
      console.log("abi: ", abi);
      const address= networkData.address;
      console.log("address: ", address);
      // Fetch Contract Data
      const contract = web3.eth.Contract(abi, address);
      this.setState({ contract });
      console.log("Contract", contract);
      try{
        const userName = await contract.methods.getUserImg().call();
        console.log("getUser", userName)
        if(userName){
          this.setState({ userName })
          console.log("this.state.projectName", this.state.userName)
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
  
  async loadWeb3(){
    if(window.ethereum){
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } if(window.web3){
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert("Please install and use Metamask");
    }
  }
  onSubmit = async (event) => {
      console.log("*** >>> onSubmit 1")
    event.preventDefault();
    console.log("onSubmit 2")
    const userName = document.getElementById("textInput").value
    console.log(">> userName: ", userName);
    if (userName){
      try{
        this.state.contract.methods.createUser(userName).send({from: this.props.account})
        .on('error', function(error){ 
          console.log("error 1", error);
          alert("Sorry, there was an error!");
         })
        .on('confirmation', function(){ 
          this.setState({userName: userName});
         }.bind(this))
       
      } catch(e){
        console.log("Error 2: ", e)
      }
    } else{
      alert("No files submitted. Please try again.");
      console.log('ERROR 3: No data to submit');
    }
  }
  constructor(props) {
    super(props);
    this.state = {
        
    };
  }

  render() {
      let greeting;
    if(this.state.userName === ''){
        greeting =  <div><h1>No user called</h1>
                    <Username />
                    <CreateUser account={this.props.account}/>
                    </div>
    } else{
        greeting = <h3>Welcome back! <Username /></h3>
    }
    return (
        <div>
        {greeting}
        </div>
    );
  }
}
