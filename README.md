# gRPC Web Native

Toolchain to generate the client Javascript (Typescript) code for the browser from your `.proto` files, using [protobuf.js](https://github.com/protobufjs/protobuf.js) as a core code generator, and [grpc-node](https://github.com/grpc/grpc-node) (npm pkg @grpc/grpc-js) as the server implementation to follow.

## Proxy

None, hence the `native` suffix in the project's name.

## Binary Support

Yes. Again, no proxy needed. Just using the original `Content-Type: application/grpc+proto`. And taking advantage of browser native `ReadableStream` and `Uint8Array` to actually use bytes instead of text. (Yes, even on streaming methods)

## Streaming Support

Yes.

 - Request (Up) Streaming
 - Response (Down) Streaming
 - Bidi (Only half duplex, request streaming. Full duplex to be implemented yet)  
   - As of now, since both request/response streaming are supported separately,  
   if you need a full duplex method, you could split it in two methods, eg.:  
   `service.upstreamVideo()` `service.downstreamVideo()`  
   both request messages would need a common `UUID` parameter  
   to identify the current process at both the server and client.

## HTTP2 Support

Yes. Using the browser native `fetch` instead of `xhr` or `websockets`.

No need to wait for `WebTransport` to be implemented and standardized in safari. Which also needs to be implemented to npm pkg @grpc/grpc-js (server).

## Abort Support

Yes. Use the browser native `AbortController` to control/abort the http call.

## Other Features

 - `Promise` style response
 - Typescript support
 - No need to install plugins (such as `protoc`)
