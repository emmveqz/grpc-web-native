
export default function (
  jsProtosFile: string,
  namespaceName: string,
  serviceName: string,
  methodWrappers: Array<string>,
  methodHandlers: {
    [methodName: string]: string,
  },
  requestStreamableMethodHandlers: {
    [methodName: string]: string,
  },
): string|Error {
  const hasMethodHandlers = Object.keys(methodHandlers).length
  const hasRequestStreamableMethodHandlers = Object.keys(requestStreamableMethodHandlers).length

  if ( !methodWrappers.length
    || (!hasMethodHandlers && !hasRequestStreamableMethodHandlers) ) {
    return new Error('misconfigured params')
  }

  return `// This is an auto-generated file.

import {
  ${namespaceName},
} from '${jsProtosFile}'

//

${hasMethodHandlers ? `
type IMethodNames =
${Object.keys(methodHandlers).map((methodName) => `  | '${methodName}'`).join(`\n`)}` : ''
}

${hasRequestStreamableMethodHandlers ? `
type IRequestStreamableMethodNames =
${Object.keys(requestStreamableMethodHandlers).map((methodName) => `  | '${methodName}'`).join(`\n`)}` : ''
}

//

const REQUEST_HEADERS = {
  "accept-encoding": 'identity',
  "content-type": 'application/grpc',
  "grpc-accept-encoding": 'identity,deflate,gzip',
  "grpc-encoding": 'identity',
  "te": 'trailers',
}

/**
 * @credits https://glitch.com/@jakearchibald
 */
const supportsRequestStreams = (() => {
  let duplexAccessed = false

  const hasContentType = new Request('', {
    body: new ReadableStream(),
    method: 'POST',
    get ['duplex' as 'method']() {
      duplexAccessed = true
      return 'half'
    },
  }).headers.has('Content-Type')

  return duplexAccessed && !hasContentType
})()

/**
 * Have in mind when calling one of these methods multiple times,
 *
 * only the \`callback\` passed the first time will be fired once the response(s) is/are sent.
 */
const requestStreamableMethodHandlers: {
  [method in IRequestStreamableMethodNames]: (
    host: string,
    requestStream: ReadableStream<Uint8Array>,
    callback: (error: Error|null, response?: Uint8Array|null) => void,
    errorHandler: (err?: Error) => void,
    signal?: AbortSignal,
  ) => void
} = {
  ${Object.values(requestStreamableMethodHandlers).join(`,\n`)}
}

const methodHandlers: {
  [method in IMethodNames]: (
    host: string,
    requestData: Uint8Array,
    callback: (error: Error|null, response?: Uint8Array|null) => void,
    errorHandler: (err?: Error) => void,
    signal?: AbortSignal,
  ) => void
} = {
  ${Object.values(methodHandlers).join(`,\n`)}
}

/**
 * Calling \`end()\` will end all the request-streamable methods in the instance.
 *
 * @param host In case your gRPC service is in a different host. You'd in that case need to set the \`Access-Control-Allow-Origin\`, since \`fetch\` won't work while using \`mode: 'no-cors'\` because of the opaque \`response\`.
 *
 * @returns An RPC service-like wrap which you must \`end()\` if you call request-streamable methods.
 */
export const Create${serviceName}Service = (host?: string) => {
  const streamableRequests: {
    [method in IRequestStreamableMethodNames]?: {
      controller?: ReadableStreamDefaultController<Uint8Array>,
      ended?: true,
      pending: boolean,
    }
  } = {
  }

  const service = ${namespaceName}.${serviceName}.create((method, requestData, callback) => {
    const { signal } = (method || {}) as unknown as { signal?: AbortSignal }

    const errorHandler = (err?: Error) => {
      callback( new Error(err?.message || \`error while calling ${serviceName}.\${method.name}\`) )
    }

    if (methodHandlers[method?.name as IMethodNames]) {
      methodHandlers[method.name as IMethodNames](host || '', requestData, callback, errorHandler, signal)
      return
    }

    let streamableRequest = streamableRequests[method?.name as IRequestStreamableMethodNames]

    if (streamableRequest?.ended || streamableRequest?.pending) {
      return
    }

    if (!requestData) {
      for (const key in streamableRequests) {
        streamableRequests[key as IRequestStreamableMethodNames]!.ended = true
        streamableRequests[key as IRequestStreamableMethodNames]!.controller?.close()
      }

      return
    }

    if (streamableRequest) {
      streamableRequest.pending = true
    }
    else {
      streamableRequest = {
        pending: true,
      }

      streamableRequests[method.name as IRequestStreamableMethodNames] = streamableRequest
    }

    new Blob([
      // Due to the "identity" encoding.
      new Uint8Array([0, 0, 0, 0, requestData.byteLength]),
      requestData,
    ])
      .arrayBuffer()
      .then((arrayBuffer) => {
        streamableRequest!.pending = false
        const requestData2 = new Uint8Array(arrayBuffer)

        if (streamableRequest!.controller) {
          streamableRequest!.controller.enqueue(requestData2)

          if (signal) {
            // Let's hope we're not overriding a custom \`onabort()\`
            signal.onabort = () => {
              streamableRequest!.controller?.close()
              streamableRequest!.ended = true
            }
          }
    
          return
        }

        const requestStream = new ReadableStream<Uint8Array>({
          start(controller) {
            controller.enqueue(requestData2)
            streamableRequest!.controller = controller
          },
        })

        requestStreamableMethodHandlers[method.name as IRequestStreamableMethodNames](
          host || '',
          requestStream,
          callback,
          errorHandler,
          signal,
        )
      })
      .catch(errorHandler)
  })

  const attachSignal = <T extends (request: Record<string, unknown>, callback?: (...args: any[]) => void) => void>(
    method: T,
    signal?: AbortSignal,
  ) => {
    if ('signal' in method) {
      method['signal' as 'prototype'] = signal
    }
    else {
      Object.defineProperty(method, 'signal', {
        configurable: true,
        enumerable: true,
        value: signal,
        writable: true,
      })
    }
  }

  return {
    emit(evt: string, ...args: any[]) {
      return service.emit(evt, ...args)
    },
    end(endedByRPC?: boolean) {
      return service.end(endedByRPC)
    },
    on(evt: string, fn: (...args: any[]) => void, ctx?: any) {
      return service.on(evt, fn, ctx)
    },
    off(evt?: string, fn?: (...args: any[]) => void) {
      return service.off(evt, fn)
    },

    ${Object.values(methodWrappers).join(`,\n`)}
  }
}
`
}
