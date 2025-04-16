
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
  return `
  ${lcMethodName}<T extends ${namespaceName}.${serviceName}.${callbackName}|undefined>(
    callback: T,
    request: ${namespaceName}.I${requestType},
    signal?: AbortSignal,
  ): T extends undefined ? Promise<${namespaceName}.${responseType}> : void {
    type IResult = T extends undefined ? Promise<${namespaceName}.${responseType}> : void

    attachSignal(service.${lcMethodName}, signal)

    return service.${lcMethodName}(request, callback as NonNullable<T>) as IResult
  }`
}
