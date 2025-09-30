
export default function (
  namespaceName: string,
  serviceName: string,
  methodName: string,
) {
  return `
  ${methodName}(host, requestStream, callback, errorHandler, signal) {
    if (!supportsRequestStreams) {
      errorHandler( new Error('request-streaming is not supported') )
      return
    }

    globalThis
      .fetch(\`\${host}/${namespaceName}.${serviceName}/${methodName}\`, {
        body: requestStream,
        ["duplex" as "referrer"]: 'half',
        method: 'POST',
        headers: REQUEST_HEADERS,
        signal,
      })
      .then((resp) => {
        const failure = readStatusFailure(resp)

        if (failure) {
          throw new GrpcCallError(failure)
        }

        return resp.arrayBuffer()
      })
      .then((buff) => {
        // A real message is never shorter than its 5-byte frame header, so nothing
        // at all means the reply was trailers-only and its status was hidden from us.
        if (!buff.byteLength) {
          errorHandler(new GrpcStatusUnreadableError())
          return
        }

        // Due to the "identity" encoding.
        callback( null, new Uint8Array(buff).subarray(5) )
      })
      .catch(errorHandler)
  }`
}
