var fs = require('fs');

fs.appendFile('message.txt', 'data to append','utf8', (err) => {
  if (err) throw err;
  console.log('The "data to append" was appended to file!');
});