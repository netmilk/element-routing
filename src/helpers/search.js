const jsonpath = require('jsonpath');
const uriTemplate = require('uri-templates');

const matchTemplates = (paths, url) => paths.filter((item) => {
  const template = uriTemplate(item);
  if (template.test(url, { strict: true })) {
    return item;
  }
  return null;
});

const filterTransitions = (transition, method) => transition.map((item) => {
  const correctMethod = jsonpath.query(item, '$..attributes.method.content').includes(method);
  if (correctMethod) {
    return item;
  }
  return null;
});

module.exports.findTransitions = (data, url, method) => {
  const paths = jsonpath.query(data, '$..attributes.href.content');
  const matchedTemplates = matchTemplates(paths, url);

  return matchedTemplates.map((found) => {
    const foundItem = jsonpath.query(data, `$..content[?(@.attributes.href.content=="${found}")]`);
    const transition = jsonpath.query(foundItem, '$..content[?(@.element=="transition")]');
    return filterTransitions(transition, method);
  });
};

module.exports.filterTransactions = (transition) => {
  const transactions = jsonpath.query(transition, '$..content[?(@.element=="httpTransaction")]');

  return transactions.map((transaction) => {
    const request = jsonpath.query(transaction, '$..content[?(@.element=="httpRequest")]');
    const requestMethod = jsonpath.query(request, '$..attributes.method.content')[0];
    const requestHeaders = jsonpath.query(request, '$..attributes.headers.content[*].content').map(item => ({
      key: item.key.content,
      value: item.value.content,
    }));
    const requestAssetAttributes = jsonpath.query(request, '$..content[?(@.element=="asset")].attributes[*].content')[0];
    const requestAssetContent = jsonpath.query(request, '$..content[?(@.element=="asset")].content')[0];
    const requestBodySchema = JSON.parse(jsonpath.query(request, '$..content[?(@.element=="asset")].content')[1] || null);

    const response = jsonpath.query(transaction, '$..content[?(@.element=="httpResponse")]');
    const responseHeaders = jsonpath.query(response, '$..attributes.headers.content[*].content').map(item => ({
      key: item.key.content,
      value: item.value.content,
    }));
    const responseAssetAttributes = jsonpath.query(response, '$..content[?(@.element=="asset")].attributes[*].content')[0];
    const responseAssetContent = jsonpath.query(response, '$..content[?(@.element=="asset")].content')[0];
    const responseBodySchema = JSON.parse(jsonpath.query(response, '$..content[?(@.element=="asset")].content')[1] || null);
    const responseStatusCode = Number(jsonpath.query(response, '$..attributes.statusCode.content')[0]);

    return {
      request: {
        method: requestMethod,
        headers: requestHeaders,
        type: requestAssetAttributes,
        content: requestAssetContent,
        bodySchema: requestBodySchema,
      },
      response: {
        headers: responseHeaders,
        type: responseAssetAttributes,
        content: responseAssetContent,
        statusCode: responseStatusCode,
        bodySchema: responseBodySchema,
      },
    };
  });
};

const filterByHeader = (data, headerName, headerValue) => {
  const filtered = data.filter((element) => {
    const header = element.response.headers
      .find(h => h.key.toLowerCase() === headerName && h.value === headerValue);

    if (header) {
      return element;
    }
    return null;
  });

  if (filtered.length > 0) {
    return filtered;
  }
  return data;
};

module.exports.filterContentType = (data, contentType) => filterByHeader(data, 'content-type', contentType);

module.exports.filterContentLanguage = (data, contentLanguage) => filterByHeader(data, 'content-language', contentLanguage);

module.exports.filterContentEncoding = (data, contentEncoding) => filterByHeader(data, 'content-encoding', contentEncoding);
