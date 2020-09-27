import React, { Component } from 'react';
import './App.css';
import Data from '../abis/Data.json';

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' });

class DirectoryListing extends Component {
 
  async componentWillMount(){
    await this.loadBlockchainData();
  }

  constructor(props) {
    super(props);
    this.state = {
        buffer: null,
        contract: null,
        dataHash: '',
    };
  }
    
  async loadBlockchainData(){
    const web3 = window.web3;
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
          console.log("Data Hash recieved")
          this.setState({ dataHash })
          console.log("this.state.dataHash", this.state.dataHash)
        } else{
          console.log("No data Hash recieved")
          this.setState({ dataHash: 'QmNWxPVpr26ichSV9jBdPrFdjPTXBx5f1XQG4roZtVNrah' })
        }
      } catch(e){
        console.log("Error", e)
      }
      
    } else {
      window.alert("Sorry, the smart contract not deploy to the current network.")
    }
  }


    captureFile = (event) => {
    event.preventDefault();
    console.log('The file has been captured!');
    const file = event.target.files[0];
    console.log('This is the upload: ', file);
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
        console.log('load end...');
        console.log('Buffer: ', Buffer(reader.result));
        this.setState({ buffer: reader.result })
    }
  }

  onSubmit = async (event) => {
    event.preventDefault();
    console.log('The file will be Submitted!');
    let data = this.state.buffer;
    console.log('Submit this: ', data);
    if (data){
      try{
        const postResponse = await ipfs.add(data) 
        console.log("postResponse", postResponse);
        const submitHash = postResponse.path;
        console.log('submitHash: ', submitHash);
        console.log("contract", this.state.contract);
        this.state.contract.methods.set(submitHash).send({from: this.props.account})
        .on('error', function(error){ 
          console.log("error");
          window.alert("Sorry, there was an error!");
         })
        .on('confirmation', function(){ 
          this.setState({dataHash: submitHash});
         }.bind(this))
       
      } catch(e){
        console.log("Error: ", e)
      }
    } else{
      alert("No files submitted. Please try again.");
      console.log('ERROR: No data to submit');
    }
  }

  render() {
    return (
    <div className="content mr-auto ml-auto">
      <div>
        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            {/* <small>Your account: {this.props.account}</small> */}
          </li>
        </ul>
      <img src={`https://ipfs.infura.io/ipfs/${this.state.dataHash}`} className="App-logo" alt="logo" />
      <h1>Welcome to Planet Git!</h1>
      <p>Upload your git repo to IPFS & Ethereum!</p> <br /><br />
      <form onSubmit={this.onSubmit} >
          {/* <input type="file" id="filepicker" name="fileList" webkitdirectory="true" multiple /> */}
          <input type="file" id="filepicker" name="fileList" onChange={this.captureFile}/>
          <input type='submit'  />
      </form>
        <ul id="listing"></ul>
      </div>
    </div>
    );
  }
}

export default DirectoryListing;
