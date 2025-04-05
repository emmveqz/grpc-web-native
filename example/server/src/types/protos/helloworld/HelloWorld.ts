// Original file: src/protos/helloworld.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { HelloReply as _helloworld_HelloReply, HelloReply__Output as _helloworld_HelloReply__Output } from '../helloworld/HelloReply';
import type { HelloRequest as _helloworld_HelloRequest, HelloRequest__Output as _helloworld_HelloRequest__Output } from '../helloworld/HelloRequest';

export interface HelloWorldClient extends grpc.Client {
  SayHello(argument: _helloworld_HelloRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_helloworld_HelloReply__Output>): grpc.ClientUnaryCall;
  SayHello(argument: _helloworld_HelloRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_helloworld_HelloReply__Output>): grpc.ClientUnaryCall;
  SayHello(argument: _helloworld_HelloRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_helloworld_HelloReply__Output>): grpc.ClientUnaryCall;
  SayHello(argument: _helloworld_HelloRequest, callback: grpc.requestCallback<_helloworld_HelloReply__Output>): grpc.ClientUnaryCall;
  sayHello(argument: _helloworld_HelloRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_helloworld_HelloReply__Output>): grpc.ClientUnaryCall;
  sayHello(argument: _helloworld_HelloRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_helloworld_HelloReply__Output>): grpc.ClientUnaryCall;
  sayHello(argument: _helloworld_HelloRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_helloworld_HelloReply__Output>): grpc.ClientUnaryCall;
  sayHello(argument: _helloworld_HelloRequest, callback: grpc.requestCallback<_helloworld_HelloReply__Output>): grpc.ClientUnaryCall;
  
  SayHelloBidi(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<_helloworld_HelloRequest, _helloworld_HelloReply__Output>;
  SayHelloBidi(options?: grpc.CallOptions): grpc.ClientDuplexStream<_helloworld_HelloRequest, _helloworld_HelloReply__Output>;
  sayHelloBidi(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<_helloworld_HelloRequest, _helloworld_HelloReply__Output>;
  sayHelloBidi(options?: grpc.CallOptions): grpc.ClientDuplexStream<_helloworld_HelloRequest, _helloworld_HelloReply__Output>;
  
  SayHelloStreamHello(metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_helloworld_HelloReply__Output>): grpc.ClientWritableStream<_helloworld_HelloRequest>;
  SayHelloStreamHello(metadata: grpc.Metadata, callback: grpc.requestCallback<_helloworld_HelloReply__Output>): grpc.ClientWritableStream<_helloworld_HelloRequest>;
  SayHelloStreamHello(options: grpc.CallOptions, callback: grpc.requestCallback<_helloworld_HelloReply__Output>): grpc.ClientWritableStream<_helloworld_HelloRequest>;
  SayHelloStreamHello(callback: grpc.requestCallback<_helloworld_HelloReply__Output>): grpc.ClientWritableStream<_helloworld_HelloRequest>;
  sayHelloStreamHello(metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_helloworld_HelloReply__Output>): grpc.ClientWritableStream<_helloworld_HelloRequest>;
  sayHelloStreamHello(metadata: grpc.Metadata, callback: grpc.requestCallback<_helloworld_HelloReply__Output>): grpc.ClientWritableStream<_helloworld_HelloRequest>;
  sayHelloStreamHello(options: grpc.CallOptions, callback: grpc.requestCallback<_helloworld_HelloReply__Output>): grpc.ClientWritableStream<_helloworld_HelloRequest>;
  sayHelloStreamHello(callback: grpc.requestCallback<_helloworld_HelloReply__Output>): grpc.ClientWritableStream<_helloworld_HelloRequest>;
  
  SayHelloStreamReply(argument: _helloworld_HelloRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_helloworld_HelloReply__Output>;
  SayHelloStreamReply(argument: _helloworld_HelloRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_helloworld_HelloReply__Output>;
  sayHelloStreamReply(argument: _helloworld_HelloRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_helloworld_HelloReply__Output>;
  sayHelloStreamReply(argument: _helloworld_HelloRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_helloworld_HelloReply__Output>;
  
}

export interface HelloWorldHandlers extends grpc.UntypedServiceImplementation {
  SayHello: grpc.handleUnaryCall<_helloworld_HelloRequest__Output, _helloworld_HelloReply>;
  
  SayHelloBidi: grpc.handleBidiStreamingCall<_helloworld_HelloRequest__Output, _helloworld_HelloReply>;
  
  SayHelloStreamHello: grpc.handleClientStreamingCall<_helloworld_HelloRequest__Output, _helloworld_HelloReply>;
  
  SayHelloStreamReply: grpc.handleServerStreamingCall<_helloworld_HelloRequest__Output, _helloworld_HelloReply>;
  
}

export interface HelloWorldDefinition extends grpc.ServiceDefinition {
  SayHello: MethodDefinition<_helloworld_HelloRequest, _helloworld_HelloReply, _helloworld_HelloRequest__Output, _helloworld_HelloReply__Output>
  SayHelloBidi: MethodDefinition<_helloworld_HelloRequest, _helloworld_HelloReply, _helloworld_HelloRequest__Output, _helloworld_HelloReply__Output>
  SayHelloStreamHello: MethodDefinition<_helloworld_HelloRequest, _helloworld_HelloReply, _helloworld_HelloRequest__Output, _helloworld_HelloReply__Output>
  SayHelloStreamReply: MethodDefinition<_helloworld_HelloRequest, _helloworld_HelloReply, _helloworld_HelloRequest__Output, _helloworld_HelloReply__Output>
}
