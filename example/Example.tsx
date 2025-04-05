
import React, {
  FC,
  useCallback,
} from "react"
import {
  CreateHelloWorldService,
} from "./generated/grpc-web-client-protos"

//

const Sleep = (milliseconds: number) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

export const Example: FC = () => {
  console.log("Example mounted")

  const testUnaryRequestResponse = useCallback(async () => {
      const service = CreateHelloWorldService()
      const abortController = new globalThis.AbortController()

      const reply = await service.sayHello(undefined, {
        isUserEnabled: true,
        username: "foo",
        userNo: 123456789,
      }, abortController.signal)

      console.log("sayHello().reply", reply)
  }, [
  ])

  const testUnaryRequestStreamResponse = useCallback(async () => {
    const service = CreateHelloWorldService()
    const abortController = new globalThis.AbortController()

    service.on("data", (resp, method) => {
      console.log("service.on(data)", resp, method)
    })

    const reply = await service.sayHelloStreamReply(undefined, {
      isUserEnabled: true,
      username: "foo",
      userNo: 123456789,
    }, abortController.signal)

    console.log("sayHelloStreamReply().reply", reply)
  }, [
  ])

  const testStreamRequestUnaryResponse = useCallback(async () => {
    const service = CreateHelloWorldService()
    const abortController = new globalThis.AbortController()

    service.sayHelloStreamHello((err, reply) => {
      // This callback will be called.
      console.log("sayHelloStreamHello().response1(err, reply)", err, reply)
    }, {
      isUserEnabled: true,
      username: "foo1",
      userNo: 123454321,
    }, abortController.signal)

    await Sleep(12000)

    service.sayHelloStreamHello((err, reply) => {
      // This callback will NOT be called.
      console.log("sayHelloStreamHello().response2(err, reply)", err, reply)
    }, {
      isUserEnabled: true,
      username: "foo2",
      userNo: 123454321,
    }, abortController.signal)

    await Sleep(12000)

    service.end()
  }, [
  ])

  const testBidiStream = useCallback(async () => {
    const service = CreateHelloWorldService()
    const abortController = new globalThis.AbortController()

    service.sayHelloBidi((err, reply) => {
      // This callback will be called.
      console.log("sayHelloBidi().response1(err, reply)", err, reply)
    }, {
      isUserEnabled: true,
      username: "foo1",
      userNo: 123454321,
    }, abortController.signal)

    await Sleep(12000)

    service.sayHelloBidi((err, reply) => {
      // This callback will NOT be called.
      console.log("sayHelloBidi().response2(err, reply)", err, reply)
    }, {
      isUserEnabled: true,
      username: "foo2",
      userNo: 123454321,
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
