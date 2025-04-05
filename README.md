# gRPC Web Native

Toolchain to generate the client Javascript (Typescript) code for the browser from your `.proto` files, using [protobuf.js](https://github.com/protobufjs/protobuf.js) as a core code generator, and [@grpc/grpc-js](https://github.com/grpc/grpc-js) as the server implementation to follow.

## Proxy

None, hence the `native` suffix in the project's name.

## Binary Support

Yes. Again, no proxy needed. Just using the original `Content-Type: application/grpc+proto`. And taking advantage of browser native `ReadableStream` and `Uint8Array` to actually use bytes instead of text. (Yes, even on streaming methods)

## Streaming Support

Yes.

 - Request (Up) Streaming
 - Response (Down) Streaming
 - Bidi (Only half duplex, request streaming. Full duplex to be implemented yet)

## HTTP2 Support

Yes. Using the browser native `fetch` instead of `xhr` or `websockets`.

No need to wait for `WebTransport` to be implemented and standardized in safari. Which also needs to be implemented to @grpc/grpc-js (server).

## Abort Support

Yes. Use the browser native `AbortController` to control/abort the http call.

## Other Features

 - `Promise` style response
 - Typescript support
 - No need to install plugins (such as `protoc`)
