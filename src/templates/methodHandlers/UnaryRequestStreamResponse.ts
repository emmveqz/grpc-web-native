
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

        const reader = resp.body?.getReader();

        if (!reader) {
          throw new Error("response carried no readable body")
        }

        readMessageStream(reader, callback, errorHandler, signal)
      })
      .catch(errorHandler)
  }`
}
