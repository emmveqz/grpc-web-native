# gRPC Web Native

Toolchain to generate the client Javascript (Typescript) code for the browser from your `.proto` files,  
using [protobufjs](https://www.npmjs.com/package/protobufjs) as a core code generator, and [grpc-node-web](https://www.npmjs.com/package/@emmveqz/grpc-node-web) as the server implementation to follow.

## Installation

```sh
npm install @emmveqz/grpc-web-native
```

## Usage

```sh
npx gen-web-client-protos <protos_source> <output_folder>

# e.g. for patterns: (mind the quote)
npx gen-web-client-protos './protos/*.proto' ./src/generated

# e.g. for single file:
npx gen-web-client-protos ./protos/helloworld.proto ./src/generated
```

See the [Example.tsx](./example/Example.tsx) for an example on how to use the generated code.

## Proxy

None, hence the `native` suffix in the project's name.

## Binary Support

Yes. Again, no proxy needed. Just using the original `Content-Type: application/grpc+proto`.  
And taking advantage of browser native `ReadableStream` and `Uint8Array` to actually use bytes instead of text.  
(Yes, even on streaming methods)

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
No need to wait for `WebTransport` to be implemented and standardized in safari.  
Which also needs to be implemented to npm pkg @grpc/grpc-js (server).

## Abort Support

Yes. Use the browser native `AbortController` to control/abort the http call.

## Other Features

 - `Promise` style response
 - Typescript support
 - No need to install plugins (such as `protoc`)

## CORS

While using a NodeJS gRPC server implemention ([grpc-node-web](https://www.npmjs.com/package/@emmveqz/grpc-node-web)),  
such as the one used at [example/server/src/index.ts](./example/server/src/index.ts) you'll set your web browser origin, like so:

```typescript
import * as grpc from '@emmveqz/grpc-node-web'

const grpcServer = new grpc.Server({
  allowedOrigin: 'https://my-web-browser-app.com',
})
```

For gRPC server implementations in other languages, you will need to find the equivalent code,  
or just setup a Proxy to defeat CORS (with a configuration to support HTTP2).  
The gRPC server will still need to be started with SSL certs in order to work with HTTP2.  
(I'd think localhost is not allowed)
