import React, { Component } from 'react';
import './App.css';
import Jobs from '../abis/Jobs.json';
import Web3 from 'web3';
import { Card, Form, Button, Col } from 'react-bootstrap';

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
    
    handleSearchInput = (event) => {
      this.setState({
        searchInput: event.target.value
      })
      console.log(this.state.searchInput)
    }

    


    constructor (props) {
      super(props);
      this.state = {
        jobs: [].fill().map((value, index) => ({ key: index, id: '', owner: '', title: '', description: '', monthly: '', salary: '' })),
        searchInput: '',
      };
      this.loadJobs();
    }
    
  render() {

    const filteredJobs = this.state.jobs.filter( job => {
      return job.description.toLocaleLowerCase().includes(this.state.searchInput.toLocaleLowerCase())
    })

    return (
      <div className="repositoriesSection" >
        <h2 className="promotionsTitle">All Jobs</h2>
        <Form className="searchForm">
          <Form.Control onChange={this.handleSearchInput} className="mb-2 searchBox" id="inlineFormInput" placeholder="Search" />
        </Form>
        {filteredJobs.slice(0, 50).map(((job) => {
          console.log("job.live: ", job.live);
          if(job.live === true){
            return (        
              <Card key={parseInt(job.id)}>
                <Card.Body>
                <Card.Title >{job.title}</Card.Title>
                <Card.Text>{job.description}</Card.Text>
                <Card.Text>Live: {job.live.toString()}</Card.Text>
                <Card.Text>ID: {parseInt(job.id)}</Card.Text>
                <Card.Text>Salary: {job.salary.toString()} <span className="logo">PLG</span></Card.Text>
                </Card.Body>    
              </Card>
            )
          } else return null
        }
         ))} 
      </div>
    );
  }
}

export default JobsBoard;
