const {
  findTransitions,
  filterTransactions,
  filterContentType,
  filterContentLanguage,
  filterContentEncoding,
} = require('./src/helpers/search');

/**
 * Get routing results.
 *
 * @param {Object} data API elements data
 * @param {string} url Requested URL
 * @param {('GET'|'POST')} method Requested method
 * @param {Object} options Aditional routing options
 * @param {string} options.type Prefered type, `text/plain`, ...
 * @param {string} options.charset Prefered charset
 * @param {string} options.encoding Prefered encoding
 * @param {string} options.language Prefered language
 */
module.exports.getResults = (data, url, method, options) => {
  if (!data || !url || !method) {
    throw new Error('One of required parameter is missing!');
  }

  const transitions = findTransitions(data, url, method);
  const results = transitions.map(item => filterTransactions(item)).flat();

  if (options) {
    let filteredResults = results;
    if (options.type) {
      filteredResults = filterContentType(filteredResults, options.type);
    }
    if (options.language) {
      filteredResults = filterContentLanguage(filteredResults, options.language);
    }
    if (options.encoding) {
      filteredResults = filterContentEncoding(filteredResults, options.encoding);
    }
    return filteredResults;
  }

  return results;
};
