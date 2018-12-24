const fs = require('fs');

const walk = (dir) => {
  let results = [];
  let list = fs.readdirSync(dir);
  list.forEach(function (fileName) {
    file = dir + '/' + fileName;
    let stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      /* Recurse into a subdirectory */
      results = results.concat(walk(file));
    } else {
      /* Is a file */
      results.push({
        [fileName]: require(file)
      });
    }
  });
  return results;
}

module.exports = walk;