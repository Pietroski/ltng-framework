const { ExternalServiceCallErr } = require('./models');

const defaultHeaders = {
  Accept: 'application/json',
  'Content-type': 'application/json; charset=UTF-8',
}

async function asyncDataParser(data) {
  return !!data.body
    ? {
        StatusCode: data.status,
        Data: await data.json(),
        Err: data.status >= 400 ? ExternalServiceCallErr() : null,
      }
    : {
        StatusCode: data.status,
        Data: null,
        Err: data.status >= 400 ? ExternalServiceCallErr() : null,
      }
}

function caughtHttpLocalResponseTreatmentError(err) {
  return {
    Err: err,
    StatusCode: 422, // Unprocessable Content,
    Data: null,
  }
}

function generateInit(method, body, headers) {
  const init = {
    method: method,
    headers: {
      ...defaultHeaders,
      ...headers,
    },
  }

  if (body !== null && body !== undefined) {
    init.body = JSON.stringify(body)
  }

  return init
}

async function AnyServerRequest(method, baseURL, url, body, headers) {
  const init = generateInit(method, body, headers)

  return fetch(baseURL + url, init)
    .then(async (data) => {
      return asyncDataParser(data)
    })
    .catch((error) => {
      console.log(`caught ${method} call error: ${error}`)
      return caughtHttpLocalResponseTreatmentError(error)
    })
}

function HttpClient(config) {
  const baseURL = config.baseURL

  return {
    Get: async function (url, headers) {
      return AnyServerRequest('GET', baseURL, url, null, headers)
    },

    Post: async function (url, body, headers) {
      return AnyServerRequest('POST', baseURL, url, body, headers)
    },

    Delete: async function (url, headers) {
      return AnyServerRequest('DELETE', baseURL, url, null, headers)
    },

    Put: async function (url, body, headers) {
      return AnyServerRequest('PUT', baseURL, url, body, headers)
    },

    Patch: async function (url, body, headers) {
      return AnyServerRequest('PATCH', baseURL, url, body, headers)
    },

    Any: async function (method, url, body, headers) {
      return AnyServerRequest(method, baseURL, url, body, headers)
    },
  }
}

module.exports = {
  HttpClient,
  asyncDataParser,
  defaultHeaders,
  AnyServerRequest
}
