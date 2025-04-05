import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { HelloWorldClient as _helloworld_HelloWorldClient, HelloWorldDefinition as _helloworld_HelloWorldDefinition } from './helloworld/HelloWorld';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  helloworld: {
    HelloReply: MessageTypeDefinition
    HelloRequest: MessageTypeDefinition
    HelloWorld: SubtypeConstructor<typeof grpc.Client, _helloworld_HelloWorldClient> & { service: _helloworld_HelloWorldDefinition }
  }
}

