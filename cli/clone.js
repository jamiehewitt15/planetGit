const shell = require('shelljs');
const readlineSync = require('readline-sync');
const ipfsClient = require('ipfs-http-client');
const swarm = require('ipfs-http-client/src/swarm');
const argv = require('minimist')(process.argv.slice(2));
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' });

// Assign arguments
let newFolder = argv._[0];
let repoHash = argv._[1];
console.log('newFolder', newFolder);
console.log('repoHash', repoHash);

const startIPFS = async() => {
  let ready = shell.exec('ipfs swarm addrs', {async:true, silent:true}).code;
  console.log("ready", ready)
  
  while (ready === 1){ // wait for daemon to start
    shell.exec(`ipfs daemon`, {async:true, silent:true});
    ready = shell.exec('ipfs swarm addrs', {async:true, silent:true}).code;
    console.log("ready", ready);
    if(ready !== 1){
      cloneRepo();
    }
  }
}
const cloneRepo = async() => {
  console.log('2. cloning into: ', 'http://127.0.0.1:8080/ipfs/' + repoHash);
  shell.exec(`git clone http://127.0.0.1:8080/ipfs/${repoHash} ${newFolder}`, {async:true});
  console.log("Finished")
}

startIPFS();

// const done = async () => {
//   // const started = await startIPFS();
//   startIPFS().then( async () => {
//     console.log("started")
//     const finished = await cloneRepo();
//     console.log("finished", finished)
//   }
//   )
// }
// done();





// // Wait for user's response.
// if (!newFolder){
//   repoHash = readlineSync.question('Please enter the new folder name: ');
// }
// if (!repoHash){
//   repoHash = readlineSync.question('Please enter the Hash of the repository you would like to clone: ');
// }

// console.log('1. cloning into: ', 'http://127.0.0.1:8080/ipfs/' + repoHash);
// console.log('Into folder:', newFolder);

// if (!shell.which('git')) { // check if user has git installed
//   shell.echo('Sorry, this script requires git');
//   shell.exit(1);
// } else{
//   if (shell.which('ipfs')) { // check if user has IPFS installed
//     startIPFS().then(cloneRepo())
//     }
//     else{ // Use public IPFS node
//     console.log("We recomend installing IPFS")
//     console.log("Attempting: requesting repo through INFURA public node")
//     shell.exec(`git clone https://${repoHash}.ipfs.infura-ipfs.io/ ${newFolder}`);
//   }
// }








// QmYgyahQoikJEbZEkiubwxm16xjCAZs2RUd1qfuus2Zyeq
  


