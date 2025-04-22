
/**
 * @param namespaceName
 * @param serviceName
 * @param lcMethodName Uncapitalized.
 * @param requestType
 * @param responseType
 * @param callbackName
 * @returns
 */
export default function (
  namespaceName: string,
  serviceName: string,
  lcMethodName: string,
  requestType: string,
  responseType: string,
  callbackName: string,
) {
  const requestTypeFull = requestType.includes('.')
    ? requestType
    : `${namespaceName}.I${requestType}`

  const responseTypeFull = responseType.includes('.')
    ? responseType
    : `${namespaceName}.${responseType}`

  return `
  ${lcMethodName}<T extends ${namespaceName}.${serviceName}.${callbackName}|undefined = undefined>(
    request: ${requestTypeFull},
    callback?: T,
    signal?: AbortSignal,
  ): T extends undefined ? Promise<${responseTypeFull}> : void {
    type IResult = T extends undefined ? Promise<${responseTypeFull}> : void

    attachSignal(service.${lcMethodName}, signal)

    return service.${lcMethodName}(request, callback as NonNullable<T>) as IResult
  }`
}
