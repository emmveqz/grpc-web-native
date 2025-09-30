
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
      .then((resp) => {
        const failure = readStatusFailure(resp)

        if (failure) {
          throw new GrpcCallError(failure)
        }

        const reader = resp.body?.getReader();

        if (!reader) {
          throw new Error("response carried no readable body")
        }

        (async () => {
          let {
            done,
            value,
          } = await reader.read()

          while (true) {
            callback( null, value?.subarray(5) )

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
