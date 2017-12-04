const [MAX_AGE_NORMAL_STORAGE, MAX_AGE_INFREQUENT] = [10, 30];
const NUMBER_LATEST_FILES = 10;


exports.clean = function (files) {
  const modules = Object.keys(files.sortedHierarchy);
  const updates = {};
  for (const module of modules) {
    updates[module] = setUpdates(files.sortedHierarchy[module]);
  }
  return {
    allFiles: files.allFiles,
    updates
  }
};


function setUpdates(files) {
  let index = 0;
  const now = Date.now();
  const updates = [];
  while (index < files.length) {
    if (index > NUMBER_LATEST_FILES) {//Don't touch X latest files
      const file = files[index];
      const fileAgeDays = (now - file.timestamp) / 1000 / 60 / 60 / 24;
      if (fileAgeDays > MAX_AGE_NORMAL_STORAGE && fileAgeDays < MAX_AGE_INFREQUENT ) {
        updates.push({prefix: getFilePrefix(file), Status: 'old'});
      }
      if (fileAgeDays > MAX_AGE_INFREQUENT) {
        updates.push({prefix: getFilePrefix(file), Status: 'archive'});
      }

    }
    index++;
  }
  return updates;
}


function getFilePrefix(file) {
  return file.Key.split('/').slice(0, 3).join('/');
}