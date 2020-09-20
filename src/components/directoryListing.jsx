import React, { Component } from 'react';
import './App.css';

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
    }
  }

  onSubmit = (event) => {
  event.preventDefault();
  console.log('The file has been Submitted!');
  
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