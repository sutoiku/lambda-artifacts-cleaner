const expect = require('chai').expect;
const d        = new Date(),
      dminus10 = new Date(new Date().setDate(d.getDate() - 10)),
      dminus30 = new Date(new Date().setDate(d.getDate() - 30));
const testFiles = {
  allFiles       : [
    {Key: 'prefix/module/d/Binary/module.tar.gz'},
    {Key: 'prefix/module/d/Logs/toto.txt'},
    {Key: 'prefix/module/m10/Binary/module.tar.gz'},
    {Key: 'prefix/module/m10/Logs/toto.txt'},
    {Key: 'prefix/module/m30/Binary/module.tar.gz'},
    {Key: 'prefix/module/m30/Logs/toto.txt'}

  ],
  sortedHierarchy: {
    module: [
      {Key: 'prefix/module/d0/Binary/module.tar.gz', timestamp: d.getTime()},
      {Key: 'prefix/module/d1/Binary/module.tar.gz', timestamp: d.getTime()},
      {Key: 'prefix/module/d2/Binary/module.tar.gz', timestamp: d.getTime()},
      {Key: 'prefix/module/d3/Binary/module.tar.gz', timestamp: d.getTime()},
      {Key: 'prefix/module/d4/Binary/module.tar.gz', timestamp: d.getTime()},
      {Key: 'prefix/module/d5/Binary/module.tar.gz', timestamp: d.getTime()},
      {Key: 'prefix/module/d6/Binary/module.tar.gz', timestamp: d.getTime()},
      {Key: 'prefix/module/d7/Binary/module.tar.gz', timestamp: d.getTime()},
      {Key: 'prefix/module/d8/Binary/module.tar.gz', timestamp: d.getTime()},
      {Key: 'prefix/module/d9/Binary/module.tar.gz', timestamp: d.getTime()},
      {Key: 'prefix/module/d10/Binary/module.tar.gz', timestamp: d.getTime()},
      {Key: 'prefix/module/m10/Binary/module.tar.gz', timestamp: dminus10.getTime()},
      {Key: 'prefix/module/m30/Binary/module.tar.gz', timestamp: dminus30.getTime()}
    ]
  }
};
describe('cleaner', () => {
  let cleaner;
  beforeEach(() => {
    cleaner = require('../cleaner');
  });
  it('Adds tag "old" to files to files older than 10 days', () => {
    const result = cleaner.clean(testFiles);
    const m10 = result.updates.module.find(item => item.prefix === 'prefix/module/m10');
    expect(m10.Status).to.equal('old');

  });
  it('does not touch the first 10 files', () => {
    const result = cleaner.clean(testFiles);
    expect(result.updates.module.length).to.equal(2);

  });
  it('adds tag "archive" to files older than 30 days', () => {
    const result = cleaner.clean(testFiles);
    const m30 = result.updates.module.find(item => item.prefix === 'prefix/module/m30');
    expect(m30.Status).to.equal('archive');
  });
});