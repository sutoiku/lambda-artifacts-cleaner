const debug = require('debug')('cleaner:filter');
const utils = require('./utils');
const BINARY_MARKER = process.env.BINARY_MARKER || '.tar.gz';

exports.filter = (files) => {
  const binaries = filterBinaries(files);
  return setHierarchy(binaries)
    .then(sortOnTimestamp)
    .then((sorted) => {
      return {
        allFiles       : files,
        sortedHierarchy: sorted
      };
    });
};

function setHierarchy(files) {
  return new Promise((resolve) => {
    debug(`filter ${files.length} files`);

    const hierarchy = files.reduce((acc, file) => {
      const fileWithTs = addTimestamp(file);
      const filePath = utils.getFilePath(fileWithTs.Key);
      acc[filePath.module] = acc[filePath.module] || [];
      acc[filePath.module].push(fileWithTs);
      return acc;
    }, {});
    resolve(hierarchy);
  })
}

function filterBinaries(files) {
  return files.filter((file) => file.Key.endsWith(BINARY_MARKER));
}

function addTimestamp(file) {
  file.timestamp=new Date(file.LastModified).getTime();
  return file;
}

function sortOnTimestamp(hierarchy) {
  return new Promise((resolve) => {
    const sortHierarchy = {};
    const modules = Object.keys(hierarchy);
    modules.map((module) => {
      sortHierarchy[module] = hierarchy[module].sort((a, b) => {
        return a.timestamp < b.timestamp; //latest first
      });
    });

    resolve(sortHierarchy);
  });

}