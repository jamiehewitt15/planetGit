import React, { Component } from 'react';
import './App.css';
import Greeting from './User.jsx';

class Header extends Component {
    
  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://www.dappuniversity.com/bootcamp"
            target="_blank"
            rel="noopener noreferrer"
          >
           PLANET GIT
          </a>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small className="text-white">Your address: {this.props.account}</small>
            </li>
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            <Greeting userName={this.props.userName} account={this.props.account}/>
            </li>
          </ul>
        </nav>
        
      </div>
    );
  }
}

export default Header;
