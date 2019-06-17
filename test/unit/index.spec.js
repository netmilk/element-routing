const { expect } = require('chai');

const { getResults } = require('../../index');

const data = require('../fixtures/elements.json');
const subPath = require('../fixtures/subpath.json');

describe('getResults', () => {
  it('#getResults: empty parameter', () => {
    expect(() => getResults()).to.throw('One of required parameter is missing!');
    expect(() => getResults({})).to.throw('One of required parameter is missing!');
    expect(() => getResults({}, '')).to.throw('One of required parameter is missing!');
    expect(() => getResults({}, '', '')).to.throw('One of required parameter is missing!');
  });

  it('#getResults /webhooks POST', () => {
    const results = getResults(data, '/webhooks', 'POST');

    expect(results).to.have.length(1);
    expect(results[0].request).to.be.an('object');
    expect(results[0].request.method).to.be.eq('POST');
    expect(results[0].response.statusCode).to.be.eq(200);
    expect(results[0].request.bodySchema).to.be.an('object');
  });

  it('#getResults /clients GET', () => {
    const results = getResults(data, '/clients/', 'GET');

    expect(results).to.have.length(1);
    expect(results[0].request).to.be.an('object');
    expect(results[0].request.method).to.be.eq('GET');
  });

  it('#getResults /clients POST', () => {
    const results = getResults(data, '/clients/', 'POST');

    expect(results).to.have.length(1);
    expect(results[0].request).to.be.an('object');
    expect(results[0].request.method).to.be.eq('POST');
  });

  it('#getResults /clients/?q=test POST', () => {
    const results = getResults(data, '/clients/?q=test', 'POST');

    expect(results).to.have.length(1);
    expect(results[0].request).to.be.an('object');
    expect(results[0].request.method).to.be.eq('POST');
  });

  it('#getResults /client/123/ GET', () => {
    const results = getResults(data, '/client/123/', 'GET');

    expect(results).to.have.length(1);
    expect(results[0].request).to.be.an('object');
    expect(results[0].request.method).to.be.eq('GET');
  });

  it('#getResults /client/123/ PUT', () => {
    const results = getResults(data, '/client/123/', 'PUT');

    expect(results).to.have.length(1);
    expect(results[0].request).to.be.an('object');
    expect(results[0].request.method).to.be.eq('PUT');
  });

  it('#getResults /clients/1 GET', () => {
    const results = getResults(subPath, '/clients/1', 'GET');

    expect(results).to.have.length(1);
    expect(results[0].request).to.be.an('object');
    expect(results[0].request.method).to.be.eq('GET');
    expect(results[0].response.content).to.contain('John Doe');
  });

  it('#getResults /clients/1/messages GET', () => {
    const results = getResults(subPath, '/clients/1/messages', 'GET');

    expect(results).to.have.length(1);
    expect(results[0].request).to.be.an('object');
    expect(results[0].request.method).to.be.eq('GET');
    expect(results[0].response.content).to.contain('Message text');
  });
});
