
import React, {
  FC,
  useCallback,
} from "react"
import {
  CreateHelloWorldService,
  GrpcCallError,
  GrpcStatusUnreadableError,
} from "./generated/grpc-web-client-protos"
import type { helloworld } from "./generated/protos"

//

const Sleep = (milliseconds: number) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

export const Example: FC = () => {
  console.log("Example mounted")

  const testUnaryRequestResponse = useCallback(async () => {
      const service = CreateHelloWorldService()
      const abortController = new globalThis.AbortController()

      const reply = await service.sayHello({
        isUserEnabled: true,
        username: "foo",
        userNo: 123456789,
      }, undefined, abortController.signal)

      if (reply instanceof GrpcStatusUnreadableError) {
        return console.log("grpcService.sayHello() returned an empty message with a status this library cannot read")
      }
      if (reply instanceof GrpcCallError) {
        return console.log(`grpcService.sayHello() returned error ${JSON.stringify(reply.status)}`)
      }
      if (reply instanceof Error) {
        return console.log(`grpcService.sayHello() returned error: ${reply.message}`)
      }

      console.log("sayHello().reply", reply)
  }, [
  ])

  const testUnaryRequestStreamResponse = useCallback(async () => {
    const service = CreateHelloWorldService()
    const abortController = new globalThis.AbortController()

    service.on("data", (resp, method) => {
      console.log("service.on(data)", resp, method)
    })

    const reply = await service.sayHelloStreamReply({
      isUserEnabled: true,
      username: "foo",
      userNo: 123456789,
    }, undefined, abortController.signal)

    console.log("sayHelloStreamReply().reply", reply)
  }, [
  ])

  const testStreamRequestUnaryResponse = useCallback(async () => {
    const service = CreateHelloWorldService()
    const abortController = new globalThis.AbortController()

    service.sayHelloStreamHello<helloworld.HelloWorld.SayHelloStreamHelloCallback>({
      isUserEnabled: true,
      username: "foo1",
      userNo: 123454321,
    }, (err, reply) => {
      // This callback will be called.
      console.log("sayHelloStreamHello().response1(err, reply)", err, reply)
    }, abortController.signal)

    await Sleep(12000)

    service.sayHelloStreamHello<helloworld.HelloWorld.SayHelloStreamHelloCallback>({
      isUserEnabled: true,
      username: "foo2",
      userNo: 123454321,
    }, (err, reply) => {
      // This callback will NOT be called.
      console.log("sayHelloStreamHello().response2(err, reply)", err, reply)
    }, abortController.signal)

    await Sleep(12000)

    service.end()
  }, [
  ])

  const testBidiStream = useCallback(async () => {
    const service = CreateHelloWorldService()
    const abortController = new globalThis.AbortController()

    service.sayHelloBidi<helloworld.HelloWorld.SayHelloBidiCallback>({
      isUserEnabled: true,
      username: "foo1",
      userNo: 123454321,
    }, (err, reply) => {
      // This callback will be called.
      console.log("sayHelloBidi().response1(err, reply)", err, reply)
    }, abortController.signal)

    await Sleep(12000)

    service.sayHelloBidi<helloworld.HelloWorld.SayHelloBidiCallback>({
      isUserEnabled: true,
      username: "foo2",
      userNo: 123454321,
    }, (err, reply) => {
      // This callback will NOT be called.
      console.log("sayHelloBidi().response2(err, reply)", err, reply)
    }, abortController.signal)

    await Sleep(12000)

    service.end()
  }, [
  ])

  return (
    <div>
      <div><button onClick={testUnaryRequestResponse}>Test Unary Request/Response</button></div>
      <br />
      <div><button onClick={testUnaryRequestStreamResponse}>Test Unary Request, Stream Response</button></div>
      <br />
      <div><button onClick={testStreamRequestUnaryResponse}>Test Stream Request, Unary Response</button></div>
      <br />
      <div><button onClick={testBidiStream}>Test Stream Request/Response (Bidi Stream)</button></div>
    </div>
  )
}

export default Example
