const shell = require('shelljs');
const readlineSync = require('readline-sync');

// Wait for user's response.
var userName = readlineSync.question('Please enter the Hash of the repository you would like to clone: ');
console.log('cloning into: ', 'http://127.0.0.1:8080/ipfs/' + userName);

if (!shell.which('git')) { // check if user has git installed
  shell.echo('Sorry, this script requires git');
  shell.exit(1);
} else{
  shell.exec(`git clone http://127.0.0.1:8080/ipfs/${userName} testClone`)
}






// QmYgyahQoikJEbZEkiubwxm16xjCAZs2RUd1qfuus2Zyeq
  


