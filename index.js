const s3      = require('./s3'),
      filter  = require('./filter'),
      cleaner = require('./cleaner');

exports.handler=(event, context, callback)=>{

  s3.listAllFiles()
    .then(filter.filter)
    .then(cleaner.clean)
    .then(s3.applyTags)
    .then((result) => {
      callback(null, result);
    })
    .catch(callback);
}
