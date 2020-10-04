// import React, { Component } from 'react';
// import Web3 from 'web3';
// import './App.css';
// import Data from '../abis/Data.json';

// export default class User extends Component {
    
//   async componentWillMount(){
//     await this.loadWeb3();
//     await this.loadUserName();
//   }
  
//   async loadUserName(){
//     const web3 = window.web3;
//     // Get smart contract network
//     const networkId = await web3.eth.net.getId();
//     console.log("networkId", networkId)
//     // Get netwrok address
//     const networkData = Data.networks[networkId];
//     if (networkData){
//       console.log("networkData", networkData);
//       const abi = Data.abi;
//       console.log("abi: ", abi);
//       const address= networkData.address;
//       console.log("address: ", address);
//       // Fetch Contract Data
//       const contract = web3.eth.Contract(abi, address);
//       this.setState({ contract });
//       console.log("Contract", contract);
//       try{
//         const userName = await contract.methods.getUser().call();
//         console.log("getUser", userName)
//         if(userName){
//           this.setState({ userName })
//           console.log("this.state.projectName", this.state.userName)
//         } else{
//           console.log("No userName recieved")
//         }
//       } catch(e){
//         console.log("Error", e)
//       }
      
//     } else {
//       window.alert("Sorry, the smart contract not deploy to the current network.")
//     }
//   }
  
//   async loadWeb3(){
//     if(window.ethereum){
//       window.web3 = new Web3(window.ethereum);
//       await window.ethereum.enable();
//     } if(window.web3){
//       window.web3 = new Web3(window.web3.currentProvider);
//     } else {
//       window.alert("Please install and use Metamask");
//     }
//   }
//   onSubmit = async (event) => {
//       console.log("*** >>> onSubmit 1")
//     event.preventDefault();
//     console.log("onSubmit 2")
//     const userName = document.getElementById("textInput").value
//     console.log(">> userName: ", userName);
//     if (userName){
//       try{
//         this.state.contract.methods.createUser(userName).send({from: this.props.account})
//         .on('error', function(error){ 
//           console.log("error 1", error);
//           alert("Sorry, there was an error!");
//          })
//         .on('confirmation', function(){ 
//           this.setState({userName: userName});
//          }.bind(this))
       
//       } catch(e){
//         console.log("Error 2: ", e)
//       }
//     } else{
//       alert("No files submitted. Please try again.");
//       console.log('ERROR 3: No data to submit');
//     }
//   }
//   constructor(props) {
//     super(props);
//     this.state = {
//         userName: '',
//     };
//   }

//   render() {
//       let greeting;
//     if(this.state.userName === ''){
//         greeting =  <div><h1>Create a username:</h1>
//                     <form  onSubmit={this.onSubmit}>
//                     <input type="text" id="textInput" name="textInput" /><br />
//                     <input type='submit'  />
//                     </form>
//                     </div>
//     } else{
//         greeting = <h3>Welcome back {this.state.userName}!</h3>
        
//     }
//     return (
//         <div>
//         {greeting}
//         </div>
//     );
//   }
// }
