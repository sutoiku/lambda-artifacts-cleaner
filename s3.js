const AWS   = require('aws-sdk'),
      debug = require('debug')('cleaner:s3');
const Bucket = process.env.BUCKET,
      PREFIX = process.env.PREFIX,
      region = 'us-west-1';
const utils = require('./utils');

const s3 = new AWS.S3({region});
const MAX_KEYS = process.env.MAX_KEYS || Infinity;

exports.listAllFiles = function () {
  return listAllKeys({Bucket});
};
exports.applyTags = function (files) {
  const updates = flattenUpdates(files.updates);
  const patterns = Object.keys(updates);
  const promises = [];
  files.allFiles.map((file) => {
    const filePath = utils.getFilePath(file.Key);
    const filePrefix = `${PREFIX}${filePath.module}/${filePath.hash}`;
    if (patterns.includes(filePrefix)) {
      promises.push(setObjectTag(file.Key, updates[filePrefix]));
    }
  });
  return Promise.all(promises);
};

const allKeys = [];

function listAllKeys(params) {
    debug('Calling objects list...');
    return s3.listObjectsV2(params)
      .promise()
      .then((data) => {
        if (data && data.Contents) {
          data.Contents.forEach(function (i) {
            allKeys.push(i)
          });
        }
        const mustContinue = data.IsTruncated===true && allKeys.length < MAX_KEYS;
        debug(`Continuing : ${mustContinue}, Keys so far : ${allKeys.length}`);
        if (mustContinue) {
          const nextParams = JSON.parse(JSON.stringify(params)); // clone params
          nextParams.ContinuationToken = data.NextContinuationToken;
          return listAllKeys(nextParams);
        } else {
          debug('resolve with ', allKeys.length);
          return Promise.resolve(allKeys);
//          resolve(allKeys);
          //return allKeys;
        }
      });



}


function flattenUpdates(updates) {
  const result = [];
  for (const module of Object.keys(updates)) {
    for (const pattern of updates[module]) {
      result[pattern.prefix] = pattern.Status;
    }
  }
  return result;
}

function setObjectTag(Key, tag) {
  const params = {
    Bucket,
    Key,
    Tagging: {
      TagSet: [
        {
          Key  : 'Status',
          Value: tag
        }
      ]
    }
  };
  debug(`setting tag ${tag} to file ${Key}`);

  return s3.putObjectTagging(params).promise();
}