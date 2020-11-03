import React, { Component } from 'react';
import './App.css';
import Jobs from '../abis/Jobs.json';
import Web3 from 'web3';

class JobsBoard extends Component {
    
    async componentWillMount(){
      await this.loadWeb3();
      
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

    async loadJobs(){
      const web3 = window.web3; 
      // Get smart contract network
      const networkId = await web3.eth.net.getId();
      console.log("networkId", networkId)
      // Get netwrok address
      const networkData = Jobs.networks[networkId];
      if (networkData){
        console.log("networkData", networkData);
        const abi = Jobs.abi;
        console.log("abi: ", abi);
        const address= networkData.address;
        console.log("address: ", address);
        // Fetch Contract Data
        const contract = web3.eth.Contract(abi, address);
        this.setState({ contract });
        console.log("Contract", contract);
        try{
          const jobs = await contract.methods.getAllJobs().call();
          console.log("getAllJobs", jobs);
          
          if(jobs){
            this.setState({ jobs: jobs })
            console.log("All Jobs", this.state.jobs );
          } else{
            console.log("No Jobs recieved")
          }
        } catch(e){
          console.log("Error", e)
        }
        
      } else {
        window.alert("Sorry, the smart contract not deploy to the current network.")
      }
    }
    
    constructor (props) {
      super(props);
      
      this.state = {
        jobs:  new Array().fill().map((value, index) => ({ id: index, owner: '', title: '', description: '', monthly: '', salary: '', live: false })),
      };
      this.loadJobs();
    }
    
  render() {
    return (
      <div className="repositoriesSection" >
        <h2 className="promotionsTitle">All Jobs</h2>
        {this.state.jobs.slice(0, 50).map(((job) => (
           <div key={job.id} >
             <h3 className="repoDiv">{job.title}</h3>
             <p>{job.description}</p>
             <p>Salary: {job.salary.toString()} <span className="logo">PLG</span></p>
             </div>
        )))} 
      </div>
    );
  }
}

export default JobsBoard;
