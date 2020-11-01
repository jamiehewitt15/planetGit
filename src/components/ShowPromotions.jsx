import React, { Component } from 'react';
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
            this.setState({ promotion1: promotions[0] })
            this.setState({ promotion2: promotions[1] })
            this.setState({ promotion3: promotions[2] })
            this.setState({ promotion4: promotions[3] })
            this.setState({ promotion5: promotions[4] })
            this.setState({ promotion6: promotions[5] })
            this.setState({ promotion7: promotions[6] })
            this.setState({ promotion8: promotions[7] })
            this.setState({ promotion9: promotions[8] })
            this.setState({ promotion10: promotions[9] })
            console.log("One Promotion", this.state.promotion1 );
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
          promotion1: { pricePaid: '', promotedRepo: { owner: '', repoHash: '', repoName: '' } },
          promotion2: { pricePaid: '', promotedRepo: { owner: '', repoHash: '', repoName: '' } },
          promotion3: { pricePaid: '', promotedRepo: { owner: '', repoHash: '', repoName: '' } },
          promotion4: { pricePaid: '', promotedRepo: { owner: '', repoHash: '', repoName: '' } },
          promotion5: { pricePaid: '', promotedRepo: { owner: '', repoHash: '', repoName: '' } },
          promotion6: { pricePaid: '', promotedRepo: { owner: '', repoHash: '', repoName: '' } },
          promotion7: { pricePaid: '', promotedRepo: { owner: '', repoHash: '', repoName: '' } },
          promotion8: { pricePaid: '', promotedRepo: { owner: '', repoHash: '', repoName: '' } },
          promotion9: { pricePaid: '', promotedRepo: { owner: '', repoHash: '', repoName: '' } },
          promotion10: { pricePaid: '', promotedRepo: { owner: '', repoHash: '', repoName: '' } },
      };
      this.loadPromotions();
    }
    
  render() {
    return (
      <div className="promotionsSection" >
        <h2 className="promotionsTitle">Promotions</h2>
        <table className="promotionsTable">
        <tr className="promotionsRow">
          <td className="promotionsCell">{this.state.promotion1.promotedRepo.repoName}</td>
          <td className="promotionsCell">{this.state.promotion2.promotedRepo.repoName}</td>
          <td className="promotionsCell">{this.state.promotion3.promotedRepo.repoName}</td>
          <td className="promotionsCell">{this.state.promotion4.promotedRepo.repoName}</td>
          <td className="promotionsCell">{this.state.promotion5.promotedRepo.repoName}</td>
        </tr>
        <tr className="promotionsRow">
          <td className="promotionsCell">{this.state.promotion6.promotedRepo.repoName}</td>
          <td className="promotionsCell">{this.state.promotion7.promotedRepo.repoName}</td>
          <td className="promotionsCell">{this.state.promotion8.promotedRepo.repoName}</td>
          <td className="promotionsCell">{this.state.promotion9.promotedRepo.repoName}</td>
          <td className="promotionsCell">{this.state.promotion10.promotedRepo.repoName}</td>
        </tr>
        </table>


      </div>
    );
  }
}

export default ShowPromotions;
