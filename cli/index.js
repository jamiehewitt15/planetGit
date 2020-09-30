const shell = require('shelljs');

if (!shell.which('git')) {
  shell.echo('Sorry, this script requires git');
  shell.exit(1);
} else{
  shell.exec('git clone http://127.0.0.1:8080/ipfs/QmYgyahQoikJEbZEkiubwxm16xjCAZs2RUd1qfuus2Zyeq testClone')
}






  
  


