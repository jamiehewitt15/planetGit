import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Web3 from 'web3';
import './App.css';
import DirectoryListing from './directoryListing.jsx';
import Header from './Header.jsx';
import UserContract from '../abis/UserContract.json';
/**
 * Import all page components here
 */
import Home from './Home.page.jsx';
import Signup from './Signup.page.jsx';
import NewRepo from './NewRepo.page.jsx';
import Repo from './Repo.page.jsx';


class App extends Component {
    
  async componentWillMount(){
    await this.loadWeb3();
    await this.loadAccount();
    await this.loadUserName();
  }
  
  async loadAccount(){
    const web3 = window.web3;
    // Load the ethereum account
    const accounts = await web3.eth.getAccounts();
    console.log("Accounts: ", accounts);
    this.setState({ account: accounts[0] })
  }
  async loadUserName(){
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
        const userName = await contract.methods.getUserName().call();
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

  constructor(props) {
    super(props);
    this.state = {
        account: '',
        userName: '',
    };
  }

  render() {
    return (
      <div>
        <Header account={this.state.account} userName={this.state.userName} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
            <Router>
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/repo/*"  component={Repo} />
              <Route path="/signup" component={Signup} />
              <Route path="/services" component={NewRepo} />
            </Switch>
            </Router>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
