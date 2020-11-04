import React, { Component } from 'react';
import { Button, ButtonGroup  } from 'react-bootstrap';
import {  Link } from "react-router-dom";
import './App.css';
import Promotions from './ShowPromotions.jsx'

export default function Header() {
      return (
        <div className="homePage">
        <div id="home" className="home">
            <h1><span className="logo">PLANET GIT</span></h1>
            <h2>The fully distributed git repository</h2>
            <p>Push you code to IPFS and Ethereum</p>
            <ButtonGroup >
            <Link to="/signup" ><Button>Sign Up</Button></Link><br /><br />
            <Link to="/createrepo" ><Button>Create a New Repo</Button></Link><br /><br />
            <Link to="/createpromotion" ><Button>Create a Promotion</Button></Link>
            </ ButtonGroup >
        </div>
        <Promotions />
        </div>
        
      );
    }
