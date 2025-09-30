
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

type IStatusFailure = {
  code: number,
  message: string,
}

type IMethodNames =
${hasMethodHandlers ? `
${Object.keys(methodHandlers).map((methodName) => `  | '${methodName}'`).join(`\n`)}` : '  | string'
}

type IRequestStreamableMethodNames =
${hasRequestStreamableMethodHandlers ? `
${Object.keys(requestStreamableMethodHandlers).map((methodName) => `  | '${methodName}'`).join(`\n`)}` : '  | string'
}

//

/**
 * \`"0"\` is \`OK\`. Note a normal gRPC reply does **not** carry this header at all — status travels in
 * trailers — so \`null\` is the ordinary success path and must not be treated as a failure.
 */
const GRPC_STATUS_OK = "0"

/** \`UNAVAILABLE\`. See the mapping note in \`readStatusFailure\`. */
const GRPC_STATUS_UNAVAILABLE = 14

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
    get ['duplex' as 'referrer']() {
      duplexAccessed = true
      return 'half'
    },
  }).headers.has('Content-Type')

  return duplexAccessed && !hasContentType
})()

/**
 * Status as far as \`fetch\` can see it — \`null\` when nothing is visibly wrong.
 *
 * Deliberately **two** checks, because they catch different things and only one of them knows what
 * gRPC is.
 */
const readStatusFailure = (resp: Response): IStatusFailure|null => {
  if (!resp.ok) {
    return {
      code: GRPC_STATUS_UNAVAILABLE,
      message: \`HTTP \${resp.status}\${resp.statusText ? \` \${resp.statusText}\` : ""}\`,
    }
  }

  const status = resp.headers.get("grpc-status")

  if (status !== null && status !== GRPC_STATUS_OK) {
    return {
      code: Number(status),
      message: readGrpcMessage(resp) || \`grpc-status \${status}\`,
    }
  }

  return null
}

const UNREADABLE_STATUS_HINT = "the server sent a gRPC status this client could not read"
  + " — cross-origin this needs \`Access-Control-Expose-Headers: grpc-status, grpc-message\`"

export class GrpcStatusUnreadableError extends Error {
  public readonly code = "GRPC_STATUS_UNREADABLE"

  constructor(message = UNREADABLE_STATUS_HINT) {
    super(message)
    this.name = "GrpcStatusUnreadableError"
    Object.setPrototypeOf(this, GrpcStatusUnreadableError.prototype)
  }
}

/**
 * **A gRPC-level failure the client could actually see.** Same two-channel recognition as
 * \`GrpcStatusUnreadableError\` and for the same reason — a consumer should be able to branch on the
 * status code without parsing a message string.
 */
export class GrpcCallError extends Error {
  public readonly code = "GRPC_CALL_FAILED"

  constructor(public readonly status: IStatusFailure) {
    super(\`\${status.code}: \${status.message}\`)
    this.name = "GrpcCallError"
    Object.setPrototypeOf(this, GrpcCallError.prototype)
  }
}

/**
 * \`grpc-message\` is **percent-encoded** per the specification, and a malformed value makes
 * \`decodeURIComponent\` throw — which must not turn a server-side error into a client-side crash,
 * since this runs on the failure path. Raw is a worse message than decoded and a far better outcome
 * than an exception.
 */
const readGrpcMessage = (resp: Response): string => {
  const raw = resp.headers.get("grpc-message") || ""

  try {
    return decodeURIComponent(raw)
  }
  catch {
    return raw
  }
}

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
      callback(err instanceof Error && err.message
        ? err
        : new Error(\`error while calling ${serviceName}.\${method.name}\`) )
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

          signal?.addEventListener("abort", (ev) => {
            streamableRequest!.controller?.close()
            streamableRequest!.ended = true
          }, {
            once: true,
            passive: true,
          })
    
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
