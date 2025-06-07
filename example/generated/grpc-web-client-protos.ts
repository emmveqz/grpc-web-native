// This is an auto-generated file.

import {
  helloworld,
} from "./protos"

//

type IMethodNames =
  | "SayHello"
  | "SayHelloStreamReply"

type IRequestStreamableMethodNames =
  | "SayHelloBidi"
  | "SayHelloStreamHello"

//

const REQUEST_HEADERS = {
  "accept-encoding": "identity",
  "content-type": "application/grpc",
  "grpc-accept-encoding": "identity,deflate,gzip",
  "grpc-encoding": "identity",
  "te": "trailers",
}

/**
 * @credits https://glitch.com/@jakearchibald
 */
const supportsRequestStreams = (() => {
  let duplexAccessed = false

  const hasContentType = new Request("", {
    body: new ReadableStream(),
    method: "POST",
    get ["duplex" as "method"]() {
      duplexAccessed = true
      return "half"
    },
  }).headers.has("Content-Type")

  return duplexAccessed && !hasContentType
})()

/**
 * Have in mind when calling one of these methods multiple times,
 *
 * only the `callback` passed the first time will be fired once the response(s) is/are sent.
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
  /**
   * @ToDo Bidi-streaming to be implement yet.
   */
  SayHelloBidi(host, requestStream, callback, errorHandler, signal) {
    if (!supportsRequestStreams) {
      errorHandler( new Error("request-streaming is not supported") )
      return
    }

    globalThis
      .fetch(`${host}/helloworld.HelloWorld/SayHelloBidi`, {
        body: requestStream,
        /**
         * @ToDo Until we get "full" capability in browsers.
         * In the meantime, we can try to implement a workaround similar to what's explained here:
         * https://glitch.com/embed/#!/fetch-request-stream
         * Same that uses two simultaneous `fetch` (half duplex each), resulting in a full duplex.
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
  },

  SayHelloStreamHello(host, requestStream, callback, errorHandler, signal) {
    if (!supportsRequestStreams) {
      errorHandler( new Error("request-streaming is not supported") )
      return
    }

    globalThis
      .fetch(`${host}/helloworld.HelloWorld/SayHelloStreamHello`, {
        body: requestStream,
        ["duplex" as "method"]: "half",
        method: "POST",
        headers: REQUEST_HEADERS,
        signal,
      })
      .then((resp) => resp.arrayBuffer())
      .then((buff) => {
        // Due to the "identity" encoding.
        callback( null, new Uint8Array(buff).subarray(5) )
      })
      .catch(errorHandler)
  },
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
  SayHello(host, requestData, callback, errorHandler, signal) {
    new Blob([
      // Due to the "identity" encoding.
      new Uint8Array([0, 0, 0, 0, requestData.byteLength]),
      requestData,
    ])
      .arrayBuffer()
      .then( (arrayBuffer) => globalThis.fetch(`${host}/helloworld.HelloWorld/SayHello`, {
        body: new Uint8Array(arrayBuffer),
        method: "POST",
        headers: REQUEST_HEADERS,
        signal,
      }) )
      .then((resp) => resp.arrayBuffer())
      .then((buff) => {
        // Due to the "identity" encoding.
        callback( null, new Uint8Array(buff).subarray(5) )
      })
      .catch(errorHandler)
  },

  SayHelloStreamReply(host, requestData, callback, errorHandler, signal) {
    new Blob([
      // Due to the "identity" encoding.
      new Uint8Array([0, 0, 0, 0, requestData.byteLength]),
      requestData,
    ])
      .arrayBuffer()
      .then( (arrayBuffer) => globalThis.fetch(`${host}/helloworld.HelloWorld/SayHelloStreamReply`, {
        body: new Uint8Array(arrayBuffer),
        method: "POST",
        headers: REQUEST_HEADERS,
        signal,
      }) )
      .then((resp) => {
        const reader = resp.body?.getReader();

        if (!reader) {
          callback(null)
          return
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
  },
}

/**
 * Calling `end()` will end all the request-streamable methods in the instance.
 *
 * @param host In case your gRPC service is in a different host. You'd in that case need to set the `Access-Control-Allow-Origin`, since `fetch` won't work while using `mode: "no-cors"` because of the opaque `response`.
 *
 * @returns An RPC service-like wrap which you must `end()` if you call request-streamable methods.
 */
export const CreateHelloWorldService = (host?: string) => {
  const streamableRequests: {
    [method in IRequestStreamableMethodNames]?: {
      controller?: ReadableStreamDefaultController<Uint8Array>,
      ended?: boolean,
      pending: boolean,
    }
  } = {
  }

  const service = helloworld.HelloWorld.create((method, requestData, callback) => {
    const { signal } = (method || {}) as unknown as { signal?: AbortSignal }

    const errorHandler = (err?: Error) => {
      callback( new Error(err?.message || `error while calling HelloWorld.${method.name}`) )
    }

    if (methodHandlers[method?.name as IMethodNames]) {
      methodHandlers[method.name as IMethodNames](host || "", requestData, callback, errorHandler, signal)
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

        const requestStream = new ReadableStream({
          start(controller) {
            controller.enqueue(requestData2)
            streamableRequest!.controller = controller
          },
        })

        requestStreamableMethodHandlers[method.name as IRequestStreamableMethodNames](
          host || "",
          requestStream,
          callback,
          errorHandler,
          signal,
        )
      })
      .catch(errorHandler)
  })

  const attachSignal = <T extends helloworld.HelloWorld.SayHelloCallback|undefined>(
    method: (request: helloworld.IHelloRequest, callback?: T) => 
      T extends undefined ? Promise<helloworld.HelloReply> : void,
    signal?: AbortSignal,
  ) => {
    if ("signal" in method) {
      method["signal" as "prototype"] = signal
    }
    else {
      Object.defineProperty(method, "signal", {
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

    sayHello<T extends helloworld.HelloWorld.SayHelloCallback|undefined>(
      callback: T,
      request: helloworld.IHelloRequest,
      signal?: AbortSignal,
    ): T extends undefined ? Promise<helloworld.HelloReply> : void {
      type IResult = T extends undefined ? Promise<helloworld.HelloReply> : void

      attachSignal(service.sayHello, signal)

      return service.sayHello(request, callback as NonNullable<T>) as IResult
    },

    sayHelloBidi<T extends helloworld.HelloWorld.SayHelloCallback|undefined>(
      callback: T,
      request: helloworld.IHelloRequest,
      signal?: AbortSignal,
    ): T extends undefined ? Promise<helloworld.HelloReply> : void {
      type IResult = T extends undefined ? Promise<helloworld.HelloReply> : void

      attachSignal(service.sayHelloBidi, signal)

      return service.sayHelloBidi(request, callback as NonNullable<T>) as IResult
    },

    sayHelloStreamHello<T extends helloworld.HelloWorld.SayHelloCallback|undefined>(
      callback: T,
      request: helloworld.IHelloRequest,
      signal?: AbortSignal,
    ): T extends undefined ? Promise<helloworld.HelloReply> : void {
      type IResult = T extends undefined ? Promise<helloworld.HelloReply> : void

      attachSignal(service.sayHelloStreamHello, signal)

      return service.sayHelloStreamHello(request, callback as NonNullable<T>) as IResult
    },

    sayHelloStreamReply<T extends helloworld.HelloWorld.SayHelloCallback|undefined>(
      callback: T,
      request: helloworld.IHelloRequest,
      signal?: AbortSignal,
    ): T extends undefined ? Promise<helloworld.HelloReply> : void {
      type IResult = T extends undefined ? Promise<helloworld.HelloReply> : void

      attachSignal(service.sayHelloStreamReply, signal)

      return service.sayHelloStreamReply(request, callback as NonNullable<T>) as IResult
    },
  }
}
