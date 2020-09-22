import React, { Component } from 'react';
import './App.css';
const ipfsClient = require('ipfs-http-client')
// connect to ipfs daemon API server
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' })

class DirectoryListing extends Component {
    constructor(props) {
      super(props);
      this.state = {
          buffer: null
      };
    }

    captureFile = (event) => {
    event.preventDefault();
    console.log('The file has been captured!');
    const file = event.target.files[0];
    console.log('This is the upload: ', file);
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
        console.log('load end...');
        console.log('Buffer: ', Buffer(reader.result));
        this.setState({ buffer: reader.result })
    }
  }

  onSubmit = (event) => {
  event.preventDefault();
  console.log('The file has been Submitted!');
  let data = this.state.buffer;
  console.log('Submit this: ', this);
  console.log('Submit this: ', this.state);
  console.log('Submit this: ', data);
  if (data){
    ipfs.add(data, (error, result) => {
      console.log('IPFS Result: ', result);
      if(error){
          console.error(error);
      }
    })
  } else{
      console.log('ERROR: No data to submit');
  }
  }

  render() {
    return (
      <div>
      <form onSubmit={this.onSubmit} >
          {/* <input type="file" id="filepicker" name="fileList" webkitdirectory="true" multiple /> */}
          <input type="file" id="filepicker" name="fileList" onChange={this.captureFile}/>
          <input type='submit'  />
      </form>
        <ul id="listing"></ul>
      </div>
    );
  }
}

export default DirectoryListing;

// function showList(event){
//     console.log('fileUpload 1');
//     console.log('fileUpload 2');
//     let output = document.getElementById("listing");
//     console.log('fileUpload 3');
//     let files = event.target.files;
//     console.log('fileUpload 4');
    
//     for (let i=0; i<files.length; i++) {
//         console.log('fileUpload 5');
//         let item = document.createElement("li");
//         item.innerHTML = files[i].webkitRelativePath;
//         output.appendChild(item);
//     };
      
//   }