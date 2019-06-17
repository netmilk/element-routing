const { expect } = require('chai');
const { findTransitions, filterTransactions } = require('../../src/helpers/search');

const data = require('../fixtures/elements.json');
const transition = require('../fixtures/transitions.json');

describe('Helpers', () => {
  describe('Search', () => {
    it('#findTransitions', () => {
      const transitions = findTransitions(data, '/webhooks', 'POST');

      expect(transitions).to.be.an('array');
      expect(transitions).to.have.length(1);
      expect(transitions[0][0].element).to.be.eq('transition');
    });

    it('#findTransitions', () => {
      const transitions = findTransitions(data, '/webhooks', 'GET');
      expect(transitions).to.be.an('array');
      expect(transitions).to.have.length(1);
      expect(transitions[0][0]).to.be.eq(null);
    });

    it('#filterTransactions', () => {
      const transactions = filterTransactions(transition);

      expect(transactions).to.be.an('array');
      expect(transactions).to.have.length(1);
      expect(transactions[0].request).to.be.an('object');
      expect(transactions[0].response).to.be.an('object');
      expect(transactions[0].request.method).to.be.eq('POST');
      expect(transactions[0].response.statusCode).to.be.eq(200);
    });
  });
});
