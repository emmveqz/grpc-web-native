
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
      errorHandler( new Error("request-streaming is not supported") )
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
        ["duplex" as "method"]: "half",
        method: "POST",
        headers: REQUEST_HEADERS,
        signal,
      })
      .then((resp) => {
        const reader = resp.body?.getReader();

        if (!reader) {
          callback(null)
          return
        }

        (async () => {
          let startIdx: number
          let subArray: Uint8Array|undefined
          let msgLength: number

          let {
            done,
            value,
          } = await reader.read()

          while (true) {
            startIdx = 5
            msgLength = value?.[4] || 0

            while (true) {
              subArray = value?.subarray(startIdx, startIdx + msgLength)
              callback(null, subArray?.length ? subArray : null)

              if (!subArray?.length) {
                break
              }

              startIdx = startIdx + msgLength + 5
              msgLength = value?.[startIdx - 1] || 0
            }

            if (done) {
              break
            }

            ({
              done,
              value,
            } = await reader.read())
          }
        })()
      })
      .catch(errorHandler)
  }`
}
