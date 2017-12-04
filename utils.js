exports.getFilePath = function(Key) {
  const parts = Key.split('/');

  return {
    module: parts[1],
    hash  : parts[2],
    type  : parts[3],
    trail : parts.slice(4).join('/')
  };
};