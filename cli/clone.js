const shell = require('shelljs');
const readlineSync = require('readline-sync');
const argv = require('minimist')(process.argv.slice(2));

// Assign arguments
let newFolder = argv._[0];
let repoHash = argv._[1];
console.log('newFolder', newFolder);
console.log('repoHash', repoHash);


const cloneRepo = async() => {
  console.log('2. cloning into: ', 'http://127.0.0.1:8080/ipfs/' + repoHash);
  shell.exec(`git clone http://127.0.0.1:8080/ipfs/${repoHash} ${newFolder}`);
  console.log("Finished")
}

// Wait for user's response.
if (!newFolder){
  repoHash = readlineSync.question('Please enter the new folder name: ');
}
if (!repoHash){
  repoHash = readlineSync.question('Please enter the Hash of the repository you would like to clone: ');
}
console.log('1. cloning into: ', 'http://127.0.0.1:8080/ipfs/' + repoHash);
console.log('Into folder:', newFolder);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const startClone = async() => {
  if (!shell.which('git')) { // check if user has git installed
    shell.echo('Sorry, this script requires git');
    shell.exit(1);
  } else{
    if (shell.which('ipfs')) { // check if user has IPFS installed
      shell.exec(`ipfs daemon`, {async:true, silent:true});
      try{
        await sleep(2000);
        await cloneRepo();
      } catch(e){
        console.log("Waiting for IPFS daemon to start...")
        await sleep(4000);
        await cloneRepo();
      }
      }
      else{ // Use public IPFS node
      console.log("We recomend installing IPFS")
      console.log("Attempting: requesting repo through INFURA public node")
      shell.exec(`git clone https://${repoHash}.ipfs.infura-ipfs.io/ ${newFolder}`);
    }
  }
}

startClone();




// QmYgyahQoikJEbZEkiubwxm16xjCAZs2RUd1qfuus2Zyeq
  


