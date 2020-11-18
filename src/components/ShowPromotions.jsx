import React, { Component } from 'react';
import { Card  } from 'react-bootstrap';
import './App.css';
import Promotions from '../abis/Promotions.json';
import Web3 from 'web3';

class ShowPromotions extends Component {
    
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

    async loadPromotions(){
      const web3 = window.web3; 
      // Get smart contract network
      const networkId = await web3.eth.net.getId();
      console.log("networkId", networkId)
      // Get netwrok address
      const networkData = Promotions.networks[networkId];
      if (networkData){
        console.log("networkData", networkData);
        const abi = Promotions.abi;
        console.log("abi: ", abi);
        const address= networkData.address;
        console.log("address: ", address);
        // Fetch Contract Data
        const contract = web3.eth.Contract(abi, address);
        this.setState({ contract });
        console.log("Contract", contract);
        try{
          const promotions = await contract.methods.getAllPromotions().call();
          console.log("getAllPromotions", promotions);
          
          if(promotions){
            this.setState({ promotions: promotions })
            console.log("All Promotions", this.state.promotions );
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

    constructor (props) {
      super(props);
      
      this.state = {
        promotions: [10].fill().map((value, index) => ({ id: index, pricePaid: '', imgHash: '', promotedRepo: { owner: '', repoHash: '', repoName: '' } })),
      };
      this.loadPromotions();
    }
    
  render() {
    console.log("this.state.promotions:", this.state.promotions)
    return (
      <div className="promotionsSection" >
        <h2 className="promotionsTitle">Promoted projects:</h2>
       
        <table className="promotionsTable">
        <tbody>
          <tr className="promotionsRow">
          {this.state.promotions.slice(0, 5).map(((promotion) => (
            
            <td key={promotion.id} className="promotionsCell">
              <Card>
                <Card.Img variant="top" src={`https://ipfs.infura.io/ipfs/${promotion.imgHash}`} className="promotionsImg" />
                <Card.Body>{promotion.promotedRepo.repoName}</Card.Body>
              </ Card></td>
          )))} 
          </tr>
          <tr className="promotionsRow">
          {this.state.promotions.slice(5, 10).map(((promotion) => (
            <td key={promotion.id} className="promotionsCell">
              <Card>
                <Card.Img variant="top" src={`https://ipfs.infura.io/ipfs/${promotion.imgHash}`} />
                <Card.Body>{promotion.promotedRepo.repoName}</Card.Body>
              </ Card></td>
          )))} 
          </tr>
        </tbody>
        </table>


      </div>
    );
  }
}

export default ShowPromotions;
