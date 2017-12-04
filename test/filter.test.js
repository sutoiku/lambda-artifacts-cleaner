const expect = require('chai').expect;

describe('filter', () => {
  let filter;
  beforeEach(() => {
    filter = require('../filter');
  });
  it('Filters binaries', (done) => {
    filter = require('../filter');
    filter.filter([
                    {Key: 'prefix/module/A/type/module.tar.gz'},
                    {Key: 'prefix/module/B/type/module.anything'}
                  ])
      .then((result) => {
        expect(result.sortedHierarchy.module.length).to.equal(1);
        expect(result.allFiles.length).to.equal(2);
        done();
      })
      .catch(done);
  });
  it('Adds a timestamp', (done) => {
    const sampleTimeStamp  = new Date(),
          roundedTimeStamp = Math.floor(sampleTimeStamp.getTime() / 1000) * 1000;
    filter.filter([{Key: 'prefix/module/hash/type/module.tar.gz', LastModified: sampleTimeStamp.toString()}])
      .then((result) => {
        expect(result.sortedHierarchy.module[0].timestamp).to.equal(roundedTimeStamp);
        done();
      })
      .catch(done);
  });
  it('Hierarchizes by module', (done) => {
    filter.filter([{Key: 'prefix/module/hash/type/module.tar.gz'}, {Key: 'prefix/module2/hash/type/module2.tar.gz'},])
      .then((result) => {
        expect(result.sortedHierarchy.module.length).to.equal(1);
        expect(result.sortedHierarchy.module2.length).to.equal(1);
        done();
      })
      .catch(done);
  });
  it('Sorts each module by timestamp', (done) => {
    const d  = new Date('Mon Dec 01 2017 15:22:33 GMT+0100 (CET)'),
          d2 = new Date('Mon Dec 03 2017 15:22:33 GMT+0100 (CET)');
    filter.filter([
                    {Key: 'prefix/module/A/type/module.tar.gz', LastModified: d.toString()},
                    {Key: 'prefix/module/B/type/module.tar.gz', LastModified: d2.toString()}
                  ])
      .then((result) => {
        expect(result.sortedHierarchy.module[0].Key).to.equal('prefix/module/B/type/module.tar.gz');
        expect(result.sortedHierarchy.module[1].Key).to.equal('prefix/module/A/type/module.tar.gz');
        done();
      })
      .catch(done);
  });
  it('returns both original list and filtered categories', (done) => {
    filter.filter([
                    {Key: 'prefix/module/A/type/module.tar.gz'},
                    {Key: 'prefix/module/B/type/module.tar.gz'}
                  ])
      .then((result) => {
        expect(result.sortedHierarchy.module.length).to.equal(2);
        expect(result.allFiles.length).to.equal(2);
        done();
      })
      .catch(done);
  });

});