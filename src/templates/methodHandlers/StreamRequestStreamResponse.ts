
export default function (
  namespaceName: string,
  serviceName: string,
  methodName: string,
) {
  return `
  /**
   * @ToDo Bidi-streaming to be implement yet.
   */
  ${methodName}(host, requestStream, callback, errorHandler, signal) {
    if (!supportsRequestStreams) {
      errorHandler( new Error('request-streaming is not supported') )
      return
    }

    globalThis
      .fetch(\`\${host}/${namespaceName}.${serviceName}/${methodName}\`, {
        body: requestStream,
        /**
         * @ToDo Until we get "full" capability in browsers.
         * In the meantime, we can try to implement a workaround similar to what's explained here:
         * https://glitch.com/embed/#!/fetch-request-stream
         * Same that uses two simultaneous \`fetch\` (half duplex each), resulting in a full duplex.
         * We would need to implement it in the gRPC server application as well (npm pkg @grpc/grpc-js).
         */
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

        const reader = resp.body?.getReader();

        if (!reader) {
          throw new Error("response carried no readable body")
        }

        readMessageStream(reader, callback, errorHandler, signal)
      })
      .catch(errorHandler)
  }`
}
