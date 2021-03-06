import React, { Component } from 'react';
import  { Redirect } from 'react-router-dom'
import { Form, Button  } from 'react-bootstrap';
import './App.css';
import Jobs from '../abis/Jobs.json';
import Token from '../abis/GLDToken.json'
import Web3 from 'web3';

class CreateJob extends Component {
    
    async componentWillMount(){
      await this.loadWeb3();
      await this.loadBlockchainData();
      await this.getBalance();
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

    async loadBlockchainData(){
        // Get smart contract network
        const web3 = window.web3;
        const networkId = await web3.eth.net.getId();
        console.log("networkId", networkId)
        // Get netwrok address
        const jobsNetworkData = Jobs.networks[networkId];
        const tokenNetworkData = Token.networks[networkId];
        if (jobsNetworkData && tokenNetworkData){
          const jobsAbi = Jobs.abi;
          const tokenAbi = Token.abi;
          const jobsAddress = jobsNetworkData.address;
          const tokenAddress = tokenNetworkData.address;
          console.log("Jobs Address", tokenAddress)
          // Fetch Contract Data
          const jobsContract = web3.eth.Contract(jobsAbi, jobsAddress);
          const tokenContract = web3.eth.Contract(tokenAbi, tokenAddress);
          this.setState({ tokenAddress });
          this.setState({ tokenContract });
          this.setState({ jobsAddress });
          this.setState({ jobsContract });
        } else {
          window.alert("Sorry, the smart contract not deploy to the current network.")
        }
    }
 
    getBalance = async() => {
        const web3 = window.web3;  
        const accounts = await web3.eth.getAccounts();
        this.setState({ account: accounts[0] });
        try{
            console.log("this.state.account", this.state.account);
            let balance = (await this.state.tokenContract.methods.balanceOf(this.state.account).call()).toString();
            console.log("Balance 1:", balance)
            balance = web3.utils.fromWei(balance, 'ether')
            this.setState({ balance });
            console.log("Balance:", balance)
          } catch(error){
              console.log("error: ", error)
          }
    }

    createJob = async(event) => {
        const web3 = window.web3;
        event.preventDefault();
        const title = document.getElementById("captureTitle").value;
        const description = document.getElementById("captureDescription").value;
        const monthly = document.getElementById("captureMonthly").value;
        let salary = document.getElementById("captureSalary").value;
        salary = web3.utils.toWei(salary, 'ether');
        
        console.log("title: ", title);
        console.log("description: ", description);
        console.log("monthly: ", monthly);
        console.log("salary: ", salary);
        try{
            this.state.tokenContract.methods.approve(this.state.jobsAddress, salary).send({from: this.state.account})
            .on('transactionHash', () => {
                this.state.jobsContract.methods.createJob(title, description, monthly, salary).send({from: this.state.account})
                .on('transactionHash', () => {
                    this.setState({redirect: true})
                })
                .on('error', (error) => {
                    console.log("Error: ", error)
                })
            })
            .on('error', (error) => {
                console.log("Error: ", error)
            })
        } catch(error){
            console.log("error", error)
        }
    }

    renderRedirect = () => {
        if (this.state.redirect) {
          return <Redirect to='/jobs' />
        }
      }

    constructor(props) {
      super(props);
      this.state = {
          tokenAddress: '',
          tokenContract: '',
          jobsContract: '',
          jobsAddress: '',
          account: '',
          promotions: '',
          price: '',
          balance: '',
          redirect: false,
      };
    }
    
  render() {
    return (
      <div className="createPromotionPage">
        {this.renderRedirect()}
        <h1>Advertise a Job</h1>
        <p>Create a job advert</p>
        <p>You must stake the job salary in order to advertise the job.</p>
        <p>Your current balance is: {this.state.balance}</p>
        <Form onSubmit={this.createJob} className="form jobForm">
        <Form.Group>
          <Form.Label>Title:</Form.Label>
            <Form.Control type="text" id="captureTitle" name="usernameInput" className="form-left jobInput"/>
          <Form.Label>Description:</Form.Label>
            <Form.Control as="textarea" id="captureDescription" rows={5} className="form-left jobInput" />
          <Form.Label>Salary:</Form.Label>
            <Form.Control type="number" id="captureSalary" name="fileList" className="form-left jobInput"/>
          <Form.Label>Is the salary per Month:</Form.Label>
            <Form.Check type="checkbox" id="captureMonthly" value="true" name="usernameInput" className="form-left"/>
          <Button type='submit'>Submit</Button>
        </Form.Group>
        </Form>
      </div>
    );
  }
}

export default CreateJob;
