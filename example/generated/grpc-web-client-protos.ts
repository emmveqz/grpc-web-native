// This is an auto-generated file.

import {
  helloworld,
} from "./protos"

//

type IStatusFailure = {
  code: number,
  message: string,
}

type IMethodNames =
  | "SayHello"
  | "SayHelloStreamReply"

type IRequestStreamableMethodNames =
  | "SayHelloBidi"
  | "SayHelloStreamHello"

//

/**
 * `"0"` is `OK`. Note a normal gRPC reply does **not** carry this header at all — status travels in
 * trailers — so `null` is the ordinary success path and must not be treated as a failure.
 */
const GRPC_STATUS_OK = "0"

/** `UNAVAILABLE`. See the mapping note in `readStatusFailure`. */
const GRPC_STATUS_UNAVAILABLE = 14

/**
 * `grpc-accept-encoding` advertises only `identity` because this client does not decompress
 * responses: a server told `deflate` or `gzip` were fine could send compressed messages (flag
 * `0x01`) that would reach protobufjs still compressed.
 *
 * In the long run, `deflate,gzip` may be added back behind an opt-in generator flag, together with
 * decompression via `DecompressionStream`.
 */
const REQUEST_HEADERS = {
  "accept-encoding": "identity",
  "content-type": "application/grpc",
  "grpc-accept-encoding": "identity",
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
    get ["duplex" as "referrer"]() {
      duplexAccessed = true
      return "half"
    },
  }).headers.has("Content-Type")

  return duplexAccessed && !hasContentType
})()

/**
 * Status as far as `fetch` can see it — `null` when nothing is visibly wrong.
 *
 * Deliberately **two** checks, because they catch different things and only one of them knows what
 * gRPC is.
 */
const readStatusFailure = (resp: Response): IStatusFailure|null => {
  if (!resp.ok) {
    return {
      code: GRPC_STATUS_UNAVAILABLE,
      message: `HTTP ${resp.status}${resp.statusText ? ` ${resp.statusText}` : ""}`,
    }
  }

  const status = resp.headers.get("grpc-status")

  if (status !== null && status !== GRPC_STATUS_OK) {
    return {
      code: Number(status),
      message: readGrpcMessage(resp) || `grpc-status ${status}`,
    }
  }

  return null
}

const UNREADABLE_STATUS_HINT = "the server sent a gRPC status this client could not read"
  + " — cross-origin this needs `Access-Control-Expose-Headers: grpc-status, grpc-message`"

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
 * `GrpcStatusUnreadableError` and for the same reason — a consumer should be able to branch on the
 * status code without parsing a message string.
 */
export class GrpcCallError extends Error {
  public readonly code = "GRPC_CALL_FAILED"

  constructor(public readonly status: IStatusFailure) {
    super(`${status.code}: ${status.message}`)
    this.name = "GrpcCallError"
    Object.setPrototypeOf(this, GrpcCallError.prototype)
  }
}

/**
 * `grpc-message` is **percent-encoded** per the specification, and a malformed value makes
 * `decodeURIComponent` throw — which must not turn a server-side error into a client-side crash,
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
 * A gRPC message on the wire: one flags byte (`0`, since we send "identity", i.e. uncompressed),
 * then the payload length as a **4-byte big-endian** integer, then the payload itself.
 */
const frameMessage = (payload: Uint8Array): Uint8Array<ArrayBuffer> => {
  const framed = new Uint8Array(5 + payload.byteLength)

  // `DataView` writes big-endian by default, which is what the gRPC spec requires.
  new DataView(framed.buffer).setUint32(1, payload.byteLength)
  framed.set(payload, 5)

  return framed
}

/**
 * Response bodies arrive in chunks that do **not** line up with gRPC messages: one chunk can carry
 * several messages, and one message can span several chunks. This buffers the bytes and hands over
 * whole messages only.
 */
const createMessageReader = (onMessage: (payload: Uint8Array) => void) => {
  let pending = new Uint8Array(0)

  return (chunk: Uint8Array<ArrayBuffer>) => {
    if (pending.byteLength) {
      const merged = new Uint8Array(pending.byteLength + chunk.byteLength)

      merged.set(pending)
      merged.set(chunk, pending.byteLength)
      pending = merged
    }
    else {
      pending = chunk
    }

    while (pending.byteLength >= 5) {
      const length = new DataView(pending.buffer, pending.byteOffset + 1, 4).getUint32(0)

      if (pending.byteLength < 5 + length) {
        // The rest of this message is still on its way.
        break
      }

      onMessage(pending.subarray(5, 5 + length))
      pending = pending.subarray(5 + length)
    }
  }
}

/**
 * The single message of a unary response, read by its declared length rather than "everything after
 * the header", so nothing that may follow it ends up inside the protobuf payload.
 */
const readUnaryMessage = (buff: ArrayBuffer): Uint8Array => {
  const length = new DataView(buff).getUint32(1)

  return new Uint8Array(buff, 5, Math.min(length, buff.byteLength - 5))
}

/**
 * Reads a streamed response to its end: each whole message goes to `callback`, then a single
 * `null`, which is how protobufjs is told the stream ended (it calls `end(true)` on the service).
 *
 * The loop runs detached from the promise chain that started it, so it must catch its own failures:
 * a connection dropped mid-stream reaches `errorHandler` instead of becoming an unhandled rejection,
 * which on Node would terminate the process. An abort the caller asked for is not reported.
 */
const readMessageStream = async (
  reader: ReadableStreamDefaultReader<Uint8Array>,
  callback: (error: Error|null, response?: Uint8Array|null) => void,
  errorHandler: (err?: Error) => void,
  signal?: AbortSignal,
): Promise<void> => {
  const push = createMessageReader((payload) => callback(null, payload))

  try {
    while (true) {
      const {
        done,
        value,
      } = await reader.read()

      if (value?.byteLength) {
        push(value as Uint8Array<ArrayBuffer>)
      }

      if (done) {
        break
      }
    }

    callback(null, null)
  }
  catch (err) {
    if (signal?.aborted) {
      return
    }

    errorHandler(err instanceof Error ? err : new Error(String(err)))
  }
}

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
        ["duplex" as "referrer"]: "half",
        method: "POST",
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
  },

  SayHelloStreamHello(host, requestStream, callback, errorHandler, signal) {
    if (!supportsRequestStreams) {
      errorHandler( new Error("request-streaming is not supported") )
      return
    }

    globalThis
      .fetch(`${host}/helloworld.HelloWorld/SayHelloStreamHello`, {
        body: requestStream,
        ["duplex" as "referrer"]: "half",
        method: "POST",
        headers: REQUEST_HEADERS,
        signal,
      })
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
    Promise.resolve(frameMessage(requestData))
      .then( (body) => globalThis.fetch(`${host}/helloworld.HelloWorld/SayHello`, {
        body,
        method: "POST",
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
  },

  SayHelloStreamReply(host, requestData, callback, errorHandler, signal) {
    Promise.resolve(frameMessage(requestData))
      .then( (body) => globalThis.fetch(`${host}/helloworld.HelloWorld/SayHelloStreamReply`, {
        body,
        method: "POST",
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
      ended?: true,
      pending: boolean,
    }
  } = {
  }

  const service = helloworld.HelloWorld.create((method, requestData, callback) => {
    const { signal } = (method || {}) as unknown as { signal?: AbortSignal }

    const errorHandler = (err?: Error) => {
      callback(err instanceof Error && err.message
        ? err
        : new Error(`error while calling HelloWorld.${method.name}`) )
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

    Promise.resolve(frameMessage(requestData))
      .then((requestData2) => {
        streamableRequest!.pending = false

        if (streamableRequest!.controller) {
          streamableRequest!.controller.enqueue(requestData2)
          return
        }

        const requestStream = new ReadableStream<Uint8Array>({
          start(controller) {
            controller.enqueue(requestData2)
            streamableRequest!.controller = controller
          },
        })

        // Registered once, when the request stream is created, rather than once per queued chunk.
        signal?.addEventListener("abort", () => {
          streamableRequest!.ended = true

          try {
            streamableRequest!.controller?.close()
          }
          catch {
            // An aborted fetch may already have cancelled the stream; nothing left to close.
          }
        }, {
          once: true,
          passive: true,
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

  const attachSignal = <T extends (request: Record<string, unknown>, callback?: (...args: any[]) => void) => void>(
    method: T,
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
    on<TEvt extends "data" | "end" | "error" | "status" | "metadata">(evt: TEvt, fn: TEvt extends "data"
      ? (data: Record<string, unknown>, method: "sayHelloStreamReply" | "sayHelloBidi") => void
      : (...args: any[]) => void, ctx?: any) {
      return service.on(evt, fn, ctx)
    },
    off(evt?: "data" | "end" | "error" | "status" | "metadata", fn?: (...args: any[]) => void) {
      return service.off(evt, fn)
    },

    sayHello<T extends helloworld.HelloWorld.SayHelloCallback|undefined = undefined>(
      request: helloworld.IHelloRequest,
      callback?: T,
      signal?: AbortSignal,
    ): T extends undefined ? Promise<helloworld.HelloReply|Error> : void {
      type IResult = T extends undefined ? Promise<helloworld.HelloReply|Error> : void

      attachSignal(service.sayHello, signal)

      return service.sayHello(request, callback as NonNullable<T>) as IResult
    },

    sayHelloBidi<T extends helloworld.HelloWorld.SayHelloBidiCallback|undefined = undefined>(
      request: helloworld.IHelloRequest,
      callback?: T,
      signal?: AbortSignal,
    ): T extends undefined ? Promise<helloworld.HelloReply|Error> : void {
      type IResult = T extends undefined ? Promise<helloworld.HelloReply|Error> : void

      attachSignal(service.sayHelloBidi, signal)

      return service.sayHelloBidi(request, callback as NonNullable<T>) as IResult
    },

    sayHelloStreamHello<T extends helloworld.HelloWorld.SayHelloStreamHelloCallback|undefined = undefined>(
      request: helloworld.IHelloRequest,
      callback?: T,
      signal?: AbortSignal,
    ): T extends undefined ? Promise<helloworld.HelloReply|Error> : void {
      type IResult = T extends undefined ? Promise<helloworld.HelloReply|Error> : void

      attachSignal(service.sayHelloStreamHello, signal)

      return service.sayHelloStreamHello(request, callback as NonNullable<T>) as IResult
    },

    sayHelloStreamReply<T extends helloworld.HelloWorld.SayHelloStreamReplyCallback|undefined = undefined>(
      request: helloworld.IHelloRequest,
      callback?: T,
      signal?: AbortSignal,
    ): T extends undefined ? Promise<helloworld.HelloReply|Error> : void {
      type IResult = T extends undefined ? Promise<helloworld.HelloReply|Error> : void

      attachSignal(service.sayHelloStreamReply, signal)

      return service.sayHelloStreamReply(request, callback as NonNullable<T>) as IResult
    },
  }
}
