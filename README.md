# gRPC Web Native

Toolchain to generate the client Javascript (Typescript) code for the browser from your `.proto` files,  
using [protobuf.js](https://github.com/protobufjs/protobuf.js) as a core code generator, and [grpc-node](https://github.com/grpc/grpc-node) (npm pkg @grpc/grpc-js) as the server implementation to follow.

## Usage

```sh
npm run transpile-generator
npm run gen-web-client-protos <file_pattern_to_protos> <output_folder>

# e.g.
npm run gen-web-client-protos ./protos/*.proto ./src/generated
```

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

While using a NodeJS gRPC server implemention ([grpc-node](https://github.com/grpc/grpc-node)),  
such as the one used at [example/server/src/index.ts](./example/server/src/index.ts) you'll need to edit your CORS config,  
which can be easily done by doing the following:

```javascript
// Find this file at your gRPC server base folder:
// node_modules/@grpc/grpc-js/build/src/server.js

// Find this method definition inside the file.
_verifyContentType(stream, headers) {

  // It's ok to place the following code at the top of the method's code.
  const method = headers[http2.constants.HTTP2_HEADER_METHOD];

  if (String(method).toLowerCase() === "options") {
    stream.respond({
      // Set your own domain, of course.
      // Or just "http://localhost:8080" for testing your front-end code,
      // since "*" is too dangerous.
      [http2.constants.HTTP2_HEADER_ACCESS_CONTROL_ALLOW_ORIGIN]: "https://my-web-server-domain.com:8080",
      [http2.constants.HTTP2_HEADER_ACCESS_CONTROL_ALLOW_METHODS]: "OPTIONS,POST",
      [http2.constants.HTTP2_HEADER_ACCESS_CONTROL_ALLOW_HEADERS]: "Accept-Encoding,Content-Type,Grpc-Accept-Encoding,Te,X-Grpc-Accept-Encoding,X-Te",
      [http2.constants.HTTP2_HEADER_STATUS]: http2.constants.HTTP_STATUS_OK,
    }, {
      endStream: true,
    })
    return false
  }

  // Rest of the original code for _verifyContentType()
  // ...
}
```

For gRPC server implementations in other languages, you will need to find the equivalent code,  
or just setup a Proxy to defeat CORS (with a configuration to support HTTP2).  
The gRPC server will still need to be started with SSL certs in order to work with HTTP2.  
(I'd think localhost is not allowed)
