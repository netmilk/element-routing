const fs = require('fs');
const path = require('path');
const { expect } = require('chai');

const { getResults } = require('../../index');

const data = JSON.parse(fs.readFileSync(path.resolve('./test/fixtures/negotiation.json'), 'utf8'));

describe('Negotiation', () => {
  it('#getResults /questions GET text/html', () => {
    const results = getResults(data, '/questions', 'GET', {
      type: 'text/html',
    });

    expect(results).to.have.length(1);
    expect(results[0].request).to.be.an('object');
    expect(results[0].request.method).to.be.eq('GET');
    expect(results[0].response.statusCode).to.be.eq(200);
    expect(results[0].response.headers).to.be.an('array');
    expect(results[0].response.headers).to.have.length(1);
    expect(results[0].response.headers[0].key).to.be.eq('Content-Type');
    expect(results[0].response.headers[0].value).to.be.eq('text/html');
    expect(results[0].response.content).to.be.eq('<strong>Test!</strong>\n');
  });

  it('#getResults /questions GET application/json', () => {
    const results = getResults(data, '/questions', 'GET', {
      type: 'application/json',
    });

    expect(results).to.have.length(1);
    expect(results[0].request).to.be.an('object');
    expect(results[0].request.method).to.be.eq('GET');
    expect(results[0].response.statusCode).to.be.eq(200);
    expect(results[0].response.headers).to.be.an('array');
    expect(results[0].response.headers).to.have.length(1);
    expect(results[0].response.headers[0].key).to.be.eq('Content-Type');
    expect(results[0].response.headers[0].value).to.be.eq('application/json');
    expect(results[0].response.content).to.be.eq('{ "type": "json" }\n');
  });

  it('#getResults /questions GET text/plaiin', () => {
    const results = getResults(data, '/questions', 'GET', {
      type: 'text/plain',
    });

    expect(results).to.have.length(1);
    expect(results[0].request).to.be.an('object');
    expect(results[0].request.method).to.be.eq('GET');
    expect(results[0].response.statusCode).to.be.eq(200);
    expect(results[0].response.headers).to.be.an('array');
    expect(results[0].response.headers).to.have.length(1);
    expect(results[0].response.headers[0].key).to.be.eq('Content-Type');
    expect(results[0].response.headers[0].value).to.be.eq('text/plain');
    expect(results[0].response.content).to.be.eq('type: plain\n');
  });

  it('#getResults /questions GET text/plaiin', () => {
    const results = getResults(data, '/questions', 'GET', {
      type: 'text/something',
    });

    expect(results).to.have.length(3);
    expect(results[0].request).to.be.an('object');
    expect(results[0].request.method).to.be.eq('GET');
    expect(results[0].response.statusCode).to.be.eq(200);
  });

  it('#getResults /questions GET', () => {
    const results = getResults(data, '/questions', 'GET', { });

    expect(results).to.have.length(3);
    expect(results[0].request).to.be.an('object');
    expect(results[0].request.method).to.be.eq('GET');
    expect(results[0].response.statusCode).to.be.eq(200);
  });
});
