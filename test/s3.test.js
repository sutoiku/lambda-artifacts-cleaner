const AWS = require('aws-sdk-mock');
const expect = require('chai').expect;

describe('S3', () => {
  before(() => {
    process.env.BUCKET = 'unit-test-bucket';
    process.env.PREFIX = 'myprefix';
    process.env.BINARY_MARKER = 'executable';
  });
  describe('listAllFiles', () => {
    let s3module;
    it('Reads paginated file lists', (done) => {
      let i = 0;
      AWS.mock('S3', 'listObjectsV2', (params, callback) => {
        let result = {Contents: [i]};
        if (i < 2) {
          i++;
          result = {...result, IsTruncated: true, NextContinuationToken: 'abc'};

        }
        return callback(null, result);

      });
      s3module = require('../s3');
      s3module.listAllFiles()
        .then((files) => {
          expect(files).to.deep.equal([0, 1, 2]);
          done();
        })
        .catch(done);
    });
    afterEach(() => {
      AWS.restore();
    });

  });

});