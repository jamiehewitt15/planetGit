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
        projectName: '',
        imgHash: '',
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
        const projectName = await contract.methods.getName().call();
        const imgHash = await contract.methods.getImg().call();
        console.log("projectName", projectName)
        if(projectName){
          console.log("Data Hash recieved")
          this.setState({ projectName })
          this.setState({ imgHash })
          console.log("this.state.projectName", this.state.projectName)
        } else{
          console.log("No data Hash recieved")
          this.setState({ imgHash: 'QmNWxPVpr26ichSV9jBdPrFdjPTXBx5f1XQG4roZtVNrah' })
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
    const projectName = document.getElementById("textInput").value
    console.log(">> projectName: ", projectName);
    if (data){
      try{
        const postResponse = await ipfs.add(data);
        console.log("postResponse", postResponse);
        const submitHash = postResponse.path;
        console.log("submitHash", submitHash);
        this.state.contract.methods.setAll(submitHash, projectName).send({from: this.props.account})
        .on('error', function(error){ 
          console.log("error 1", error);
          alert("Sorry, there was an error!");
         })
        .on('confirmation', function(){ 
          this.setState({imgHash: submitHash});
          this.setState({projectName: projectName});
         }.bind(this))
       
      } catch(e){
        console.log("Error 2: ", e)
      }
    } else{
      alert("No files submitted. Please try again.");
      console.log('ERROR 3: No data to submit');
    }
  }

  render() {
    return (
    <div className="content mr-auto ml-auto">
      <div>
        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            <small>Your Project: {this.state.projectName}</small>
          </li>
        </ul>
      <img src={`https://ipfs.infura.io/ipfs/${this.state.imgHash}`} className="App-logo" alt="logo" />
      <h1>Welcome to Planet Git!</h1>
      <p>Upload your git repo to IPFS & Ethereum!</p> <br /><br />
      <form onSubmit={this.onSubmit} >
          {/* <input type="file" id="filepicker" name="fileList" webkitdirectory="true" multiple /> */}
          Project Name: <input type="text" id="textInput" name="textInput" /><br />
          Project Logo: <input type="file" id="filepicker" name="fileList" onChange={this.captureFile}/><br />
          <input type='submit'  />
      </form>
        <ul id="listing"></ul>
      </div>
    </div>
    );
  }
}

export default DirectoryListing;
