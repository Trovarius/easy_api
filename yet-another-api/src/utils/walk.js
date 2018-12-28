const fs = require('fs');
const path = require('path');

const folderExists = (dir) => fs.existsSync(dir)

const walk = (dir, baseDir = null) => {
  let results = [];
  baseDir = baseDir || dir;

  if (!folderExists(dir)) return results;

  let list = fs.readdirSync(dir);
  list.forEach(function (fileName) {
    file = dir + '/' + fileName;
    let stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      /* Recurse into a subdirectory */
      results = results.concat(walk(file, baseDir));
    } else {
      /* Is a file */
      const fileParse = path.parse(file);

      const fileWithoutExtension = fileParse.dir.replace(baseDir, '') + "/" + fileParse.name;

      results.push({
        [fileWithoutExtension]: require(file)
      });
    }
  });
  return results;
}

module.exports = walk;