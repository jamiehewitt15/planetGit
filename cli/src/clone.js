const shell = require('shelljs');
const readlineSync = require('readline-sync');
const argv = require('minimist')(process.argv.slice(2));

// Assign arguments
let newFolder = argv._[0];
let repoHash = argv._[1];
console.log('newFolder', newFolder);
console.log('repoHash', repoHash);
// Ask for user input
if (!newFolder){
  repoHash = readlineSync.question('Please enter the new folder name: ');
}
if (!repoHash){
  repoHash = readlineSync.question('Please enter the Hash of the repository you would like to clone: ');
}

const cloneRepo = async() => {
  console.log('Cloning into: ', 'http://127.0.0.1:8080/ipfs/' + repoHash);
  if (shell.exec(`git clone http://127.0.0.1:8080/ipfs/${repoHash} ${newFolder}`).code !== 0) {
    console.log("Waiting for IPFS daemon to start...")
    await sleep(4000);
    shell.echo('Trying again...');
    shell.exec(`git clone http://127.0.0.1:8080/ipfs/${repoHash} ${newFolder}`)
  }
  console.log("Finished");
}

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
      await sleep(2000); // wait for IPFS Daemon to start
      await cloneRepo();
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