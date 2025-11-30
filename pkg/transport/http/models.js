function ExternalServiceCallErr() {
  return {
    cause: 'external service call',
    message: 'request response',
    name: 'external error',
  }
}

function MapHttpResponseInfo(response) {
  if (!response) {
    return {
      Err: {
        cause: 'unknown',
        message: 'invalid HttpResponseInfo<any> response ${response}',
        name: 'invalid internal response',
      },
      Data: null,
      StatusCode: 422,
    }
  }

  return {
    StatusCode: response.StatusCode || 0,
    Data: response.Data || null,
    Err: response.Err || null,
  }
}

module.exports = {
  ExternalServiceCallErr,
  MapHttpResponseInfo
}
