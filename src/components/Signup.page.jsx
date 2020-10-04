import React, { Component } from 'react';
import './App.css';
import UserContract from '../abis/UserContract.json';

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' });

class Signup extends Component {
 
  async componentWillMount(){
    await this.loadBlockchainData();
  }

  constructor(props) {
    super(props);
    this.state = {
        imgBuffer: null,
        repoBuffer: null,
        contract: null,
        username: '',
        imgHash: '',
    };
  }
 
  async loadBlockchainData(){
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
        const UserName = await contract.methods.getUserName().call();
        // const imgHash = await contract.methods.getImg().call();
        console.log("projectName", UserName)
        if(UserName){
          console.log("Data Hash recieved")
          this.setState({ UserName })
          // this.setState({ imgHash })
        } else{
          console.log("No data Hash recieved")
          // this.setState({ imgHash: 'QmNWxPVpr26ichSV9jBdPrFdjPTXBx5f1XQG4roZtVNrah' })
        }
      } catch(e){
        console.log("Error", e)
      }
      
    } else {
      window.alert("Sorry, the smart contract not deploy to the current network.")
    }
  }
  captureImg = (event) => {
  event.preventDefault();
  console.log('The file has been captured!');
  const file = event.target.files[0];
  console.log('This is the upload: ', file);
  const reader = new window.FileReader();
  reader.readAsArrayBuffer(file);
  reader.onloadend = () => {
      console.log('load end...');
      console.log('Buffer: ', Buffer(reader.result));
      this.setState({ imgBuffer: reader.result })
    }
  }

  onSubmit = async (event) => {
      console.log("account", )
    event.preventDefault();
    console.log('The file will be Submitted!');
    let data = this.state.imgBuffer;
    console.log('Submit this: ', data);
    const username = document.getElementById("usernameInput").value
    console.log(">> projectName: ", username);
    if (data){
      try{
        const postResponse = await ipfs.add(data);
        console.log("postResponse", postResponse);
        const submitHash = postResponse.path;
        console.log("submitHash", submitHash);
        this.state.contract.methods.createUser(username, submitHash).send({from: this.props.account})
        .on('error', function(error){ 
          console.log("error 1", error);
          alert("Sorry, there was an error!");
         })
        .on('confirmation', function(){ 
          this.setState({imgHash: submitHash});
          this.setState({username: username});
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
        
      <h1>Create a User Account</h1>
      <p>User Planet git to push your git repo to IPFS & Ethereum!</p> <br />
      <form onSubmit={this.onSubmit} className="form">
          Username: <input type="text" id="usernameInput" name="usernameInput" className="form-left"/><br /><br />
          Picture: <input type="file" id="filepicker" name="fileList" onChange={this.captureImg} className="form-left"/><br /><br />
          <input type='submit'  />
      </form>
        <ul id="listing"></ul>
      </div>
    </div>
    );
  }
}

export default Signup;
