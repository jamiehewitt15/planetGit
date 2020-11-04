import React, { Component } from 'react';
import { Nav } from 'grommet';
import {  Link } from "react-router-dom";
import './App.css';

class Header extends Component {
    
  render() {
    let greeting;
    if(this.props.userName !== ''){
      console.log("this.props.userName", this.props.userName)
      greeting = <p>Welcome back {this.props.userName}!</p>
    } else{
      greeting =  <div><Link to="/signup" ><p>Create an Account</p></Link></div>
    }
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="./"
            rel="noopener noreferrer"
          >
           <span className="logo">PLANET GIT</span>
          </a>
          {greeting}
          <ul className="navbar-nav px-3">
            
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small className="text-white">Your address: {this.props.account}</small>
            </li>
            
          </ul>
        </nav>
        
      </div>
    );
  }
}

export default Header;
