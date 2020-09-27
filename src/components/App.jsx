import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';
import Data from '../abis/Data.json';
import DirectoryListing from './directoryListing.jsx';
import Header from './Header.jsx';

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
    // Get smart contract network
    const networkId = await web3.eth.net.getId();
    console.log("networkId", networkId)
    // Get netwrok address
    const networkData = Data.networks[networkId];
    if (networkData){
      console.log("networkData", networkData);
      const abi = Data.abi;
      console.log("abi: ", abi);
      const address= networkData.address;
      console.log("address: ", address);
      // Fetch Contract Data
      const contract = web3.eth.Contract(abi, address);
      this.setState({ contract });
      console.log("Contract", contract);
      try{
        const dataHash = await contract.methods.get().call();
        console.log("dataHash", dataHash)
        if(dataHash){
          this.setState({ dataHash })
          console.log("this.state.dataHash", this.state.dataHash)
        } else{
          console.log("No data Hash recieved")
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
        contract: null,
        dataHash: 'QmNWxPVpr26ichSV9jBdPrFdjPTXBx5f1XQG4roZtVNrah',
    };
  }

  render() {
    return (
      <div>
        <Header account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              
                
              <DirectoryListing account={this.state.account} dataHash={this.state.dataHash} contract={this.state.contract}/>
              
              
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
