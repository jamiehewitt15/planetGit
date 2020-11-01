import React, { Component } from 'react';
import {  Link } from "react-router-dom";
import './App.css';
import Promotions from './ShowPromotions.jsx' 

export default function Header() {
      return (
        <div className="homePage">
        <div id="home" className="home">
            <h1>Welcome to PLANET GIT</h1>
            <h2>The fully distributed git repository</h2>
            <p>Push you code to IPFS and Ethereum</p>
            <Link to="/signup" ><button>Sign Up</button></Link><br /><br />
            <Link to="/createrepo" ><button>Create a New Repo</button></Link><br /><br />
            <Link to="/createpromotion" ><button>Create a Promotion</button></Link>
            
        </div>
        <Promotions />
        </div>
        
      );
    }
