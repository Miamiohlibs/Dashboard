const chai = require('chai');
const assert = require('chai').assert;
const expect = require('chai').expect;
const should = require('chai').should;
const chaiArrays = require('chai-arrays');
chai.use(chaiArrays);

const PercentEncodeString = require('../classes/PercentEncodeString');

const encoder = new PercentEncodeString();

describe('PercentEncodeString', () => {
  it('should return an object of class Crosswalk', () => {
    assert.isTrue(encoder instanceof PercentEncodeString);
  });
});

describe('encodeString', () => {
  it('should corrently encode "html" as "%68%74%6d%6c"', () => {
    let html = encoder.encodeString('html');
    expect(typeof html).to.equal('string');
    expect(html).to.equal('%68%74%6d%6c');
  });
});

describe('encodeEmail', () => {
  it('should skip leave non-alphanum chars unchanged', () => {
    let html = encoder.encodeEmail('html@htmlstreet.com');
    expect(typeof html).to.equal('string');
    expect(html).to.equal(
      '%68%74%6d%6c@%68%74%6d%6c%73%74%72%65%65%74.%63%6f%6d' // retains @ .
    );
  });
});
