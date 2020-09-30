const shell = require('shelljs');
const ipfsClient = require('ipfs-http-client');
const { globSource } = ipfsClient;
const { CID } = require('ipfs-http-client');
let ipfs;

const pushRepo = async() => {
  let pwd = shell.pwd().stdout;
  console.log("pwd: ", pwd)
  shell.exec(`cd ../..`);
  pwd = shell.pwd().stdout;
  shell.exec(`git clone --bare ${pwd} ../tempPlanetGit`);
  shell.cd('../tempPlanetGit');
  pwd = shell.pwd().stdout;
  console.log("pwd: ", pwd)
  shell.exec(`git update-server-info`);
  // const ipfsHash = await shell.exec(`ipfs add -r .`, {async:true, silent:true});
  const file = await ipfs.add(globSource('./', { recursive: true }));
  const cid = new CID(file.cid)
  console.log("Repo Hash:", cid.toString());
  shell.cd('../');
  shell.pwd();
  shell.rm('-rf', './tempPlanetGit');
  console.log("Finished")
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const startPush = async() => {
  if (!shell.which('git')) { // check if user has git installed
    shell.echo('Sorry, this script requires git');
    shell.exit(1);
  } else{
    if (shell.which('ipfs')) { // check if user has IPFS installed
      shell.exec(`ipfs daemon`, {async:true, silent:true});
      ipfs = ipfsClient({ host: 'localhost', port: '5001', protocol: 'http' })
      await sleep(2000); // wait for IPFS Daemon to start
      await pushRepo();
      }
      else{ // Use public IPFS node
      console.warn("We recomend installing IPFS");
      console.warn("Attempting to access IPFS through INFURA public node");
      ipfs = ipfsClient({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' });
      await pushRepo();
    }
  }
}

startPush();

// QmTYXb9WEVU57MzLeWbNtfjDuHGCbs1UP765VbEaEw5GGN