import React, { Component } from 'react';
import './App.css';

class DirectoryListing extends Component {
  render() {
    return (
      <div>
        
        <ul id="listing"></ul>
      </div>
    );
  }
}

export default DirectoryListing;


const fileUpload = document.getElementById("filepicker")
if(fileUpload){
    fileUpload.addEventListener("change", function(event) {
        let output = document.getElementById("listing");
        let files = event.target.files;
      
        for (let i=0; i<files.length; i++) {
          let item = document.createElement("li");
          item.innerHTML = files[i].webkitRelativePath;
          output.appendChild(item);
        };
      }, false);
}
