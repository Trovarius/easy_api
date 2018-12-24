const fs = require('fs');
const path = require('path');

const folderExists = (dir) => fs.existsSync(dir)

const walk = (dir) => {
  let results = [];
  if (!folderExists(dir)) return results;

  let list = fs.readdirSync(dir);
  list.forEach(function (fileName) {
    file = dir + '/' + fileName;
    let stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      /* Recurse into a subdirectory */
      results = results.concat(walk(file));
    } else {
      /* Is a file */
      const fileWithoutExtension = path.basename(fileName, '.js');

      results.push({
        [fileWithoutExtension]: require(file)
      });
    }
  });
  return results;
}

module.exports = walk;