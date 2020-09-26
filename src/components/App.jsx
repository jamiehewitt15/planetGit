import React, { Component } from 'react';
import './App.css';
import DirectoryListing from './directoryListing.jsx';
import Header from './Header.jsx';
import Web3 from 'web3';

class App extends Component {
    
  async componentWillMount(){
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadBlockchainData(){
    const web3 = window.web3;
    // Load the ethereum account
    const accounts = await web3.eth.getAccounts();
    console.log("Accounts: ", accounts);
    this.setState({ account: accounts[0] })
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
    };
  }

  render() {
    return (
      <div>
        <Header account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                
              <DirectoryListing account={this.state.account}/>
              </div>
              
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
