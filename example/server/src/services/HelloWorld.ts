
import * as grpc from "@grpc/grpc-js"
import type {
  sendUnaryData,
  ServerDuplexStream,
  ServerReadableStream,
  ServerUnaryCall,
  ServerWritableStream,
  UntypedHandleCall,
} from "@grpc/grpc-js"
import * as protoLoader from "@grpc/proto-loader"
import * as path from "path"
import type {
  ProtoGrpcType as HelloWorldProtoGrpcType,
} from "../types/protos/helloworld"
import type {
  HelloReply,
} from "../types/protos/helloworld/HelloReply"
import type {
  HelloRequest__Output,
} from "../types/protos/helloworld/HelloRequest"
import type {
  HelloWorldHandlers,
} from "../types/protos/helloworld/HelloWorld"

//

const helloworldPackage = protoLoader.loadSync(`${path.resolve(__dirname, "../protos")}/helloworld.proto`, {
  defaults: true,
  keepCase: true,
})

export const helloworldProto = (grpc.loadPackageDefinition(helloworldPackage)) as unknown as HelloWorldProtoGrpcType

//

export class HelloWorldService implements HelloWorldHandlers {
  [name: string]: UntypedHandleCall

  public SayHello(call: ServerUnaryCall<HelloRequest__Output, HelloReply>, callback: sendUnaryData<HelloReply>) {
    console.log("SayHello", call.request)
  
    const response: HelloReply = {
      isReplyValid: true,
      replyMessage: "foo",
      replyNo: 987654321,
    }
  
    callback(null, response, call.metadata)
  }

  public SayHelloStreamReply(call: ServerWritableStream<HelloRequest__Output, HelloReply>) {
    console.log("SayHelloStreamReply", call.request)
  
    const response: HelloReply = {
      isReplyValid: true,
      replyMessage: "foo",
      replyNo: 123454321,
    }

    call.write(response, () => {
      console.log("SayHelloStreamReply wrote response")

      setTimeout(() => {
        response.replyMessage = "foo2"
        call.write(response, () => { console.log("SayHelloStreamReply wrote response"); call.end() })
      }, 12000)
    })
  }

  public SayHelloStreamHello(call: ServerReadableStream<HelloRequest__Output, HelloReply>, callback: sendUnaryData<HelloReply>) {
    console.log("SayHelloStreamHello")
  
    const response: HelloReply = {
      isReplyValid: true,
      replyMessage: "foobar",
      replyNo: 123456789,
    }

    let cycles = 0

    call
      .on("data", (data) => {
        cycles++
        console.log("SayHelloStreamHello.on(data)", cycles, data)
      })
      .on("end", () => {
        console.log("SayHelloStreamHello.on(end)")
        callback(null, response, call.metadata)
      })
  }

  public SayHelloBidi(call: ServerDuplexStream<HelloRequest__Output, HelloReply>) {
    console.log("SayHelloBidi")
  
    const response: HelloReply = {
      isReplyValid: true,
      replyMessage: "barfoo",
      replyNo: 543212345,
    }

    let cycles = 0

    call
      .on("data", (data) => {
        cycles++
        console.log("SayHelloBidi.on(data)", cycles, data)
        response.replyMessage = `barfoo${cycles}`

        call.write(response, () => {
          console.log("SayHelloBidi wrote response")
        })
      })
      .on("end", () => {
        console.log("SayHelloBidi.on(end)")
        call.end()
      })
  } //
}
