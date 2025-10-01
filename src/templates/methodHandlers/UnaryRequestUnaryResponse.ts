
export default function (
  namespaceName: string,
  serviceName: string,
  methodName: string,
) {
  return `
  ${methodName}(host, requestData, callback, errorHandler, signal) {
    Promise.resolve(frameMessage(requestData))
      .then( (body) => globalThis.fetch(\`\${host}/${namespaceName}.${serviceName}/${methodName}\`, {
        body,
        method: 'POST',
        headers: REQUEST_HEADERS,
        signal,
      }) )
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
          throw new GrpcStatusUnreadableError()
        }

        callback( null, readUnaryMessage(buff) )
      })
      .catch(errorHandler)
  }`
}
