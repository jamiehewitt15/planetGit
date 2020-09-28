const fetch = require('node-fetch');

const getURLdata = async url => {
    try {
      const response = await fetch(url)
        .then(checkStatus);
      const json = await response.json();
      return json;
    } catch (error) {
      console.log("Sorry there was an error. Please check the URL you are requesting from, there may be no JSON data.", error);
    }
  };

function checkStatus(res) {
    if (res.ok) { // res.status >= 200 && res.status < 300
        return res;
    } else {
        throw new Error(res.statusText);
    }
}

module.exports = (urls) => { 
    let dataArray = Promise.all(urls.map(getURLdata)); 
    return dataArray;
};


  
  


