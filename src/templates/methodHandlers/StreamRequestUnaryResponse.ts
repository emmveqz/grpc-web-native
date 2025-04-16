
export default function (
  namespaceName: string,
  serviceName: string,
  methodName: string,
) {
  return `
  ${methodName}(host, requestStream, callback, errorHandler, signal) {
    if (!supportsRequestStreams) {
      errorHandler( new Error("request-streaming is not supported") )
      return
    }

    globalThis
      .fetch(\`\${host}/${namespaceName}.${serviceName}/${methodName}\`, {
        body: requestStream,
        ["duplex" as "method"]: "half",
        method: "POST",
        headers: REQUEST_HEADERS,
        signal,
      })
      .then((resp) => resp.arrayBuffer())
      .then((buff) => {
        // Due to the "identity" encoding.
        callback( null, new Uint8Array(buff).subarray(5) )
      })
      .catch(errorHandler)
  }`
}
