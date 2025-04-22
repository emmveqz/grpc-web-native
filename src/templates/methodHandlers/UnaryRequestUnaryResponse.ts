
export default function (
  namespaceName: string,
  serviceName: string,
  methodName: string,
) {
  return `
  ${methodName}(host, requestData, callback, errorHandler, signal) {
    new Blob([
      // Due to the "identity" encoding.
      new Uint8Array([0, 0, 0, 0, requestData.byteLength]),
      requestData,
    ])
      .arrayBuffer()
      .then( (arrayBuffer) => globalThis.fetch(\`\${host}/${namespaceName}.${serviceName}/${methodName}\`, {
        body: new Uint8Array(arrayBuffer),
        method: 'POST',
        headers: REQUEST_HEADERS,
        signal,
      }) )
      .then((resp) => resp.arrayBuffer())
      .then((buff) => {
        // Due to the "identity" encoding.
        callback( null, new Uint8Array(buff).subarray(5) )
      })
      .catch(errorHandler)
  }`
}
