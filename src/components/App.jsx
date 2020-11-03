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
import Users from '../abis/Users.json';
/**
 * Import all page components here
 */
import Home from './Home.page.jsx';
import Signup from './Signup.page.jsx';
import NewRepo from './NewRepo.page.jsx';
import Repo from './Repo.page.jsx';
import User from './User.jsx';
import CreatePromotion from './CreatePromotion.page.jsx';
import CreateRepo from './CreateRepo.page.jsx';
import AllRepos from './AllRepos.page.jsx';
import CreateJob from './CreateJob.page.jsx';


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
    this.setState({ account: accounts[0] })
  }
  async loadUserName(){
    const web3 = window.web3;  
    // Get smart contract network
    const networkId = await web3.eth.net.getId();
    // Get netwrok address
    const networkData = Users.networks[networkId];
    if (networkData){
      const abi = Users.abi;
      const address = networkData.address;
      // Fetch Contract Data
      const contract = web3.eth.Contract(abi, address);
      this.setState({ contract });
      try{
        const userName = await contract.methods.getUserName().call();
        console.log("userName", userName)
        const allUsers = await contract.methods.getAllUsers().call();
        console.log("allUsers", allUsers)
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
      window.alert("Please install and use Metamask to interact with this web app. Visit metamask.io");
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
        <Router>
        <Header account={this.state.account} userName={this.state.userName} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
            
            <Switch>
              <Route path="/repo/*"  component={() => <Repo account={this.state.account} />}  />
              <Route path="/user/:username"  component={() => <User account={this.state.account} />}  />
              <Route path="/signup" component={() => <Signup account={this.state.account} />} />
              <Route path="/newrepo" component={() => <NewRepo account={this.state.account} />} />
              <Route path="/createpromotion" component={() => <CreatePromotion account={this.state.account} />} />
              <Route path="/createrepo" component={() => <CreateRepo account={this.state.account} />} />
              <Route path="/allrepos" component={() => <AllRepos account={this.state.account} />} />
              <Route path="/createjob" component={() => <CreateJob account={this.state.account} />} />
              <Route path="/" component={Home} />
            </Switch>
            
            </main>
          </div>
        </div>
        </Router>
      </div>
    );
  }
}

export default App;
