
import * as fs from "fs"
import * as path from "path"
import * as grpc from "@emmveqz/grpc-node-web"
import {
  helloworldProto,
  HelloWorldService,
} from "./services"

//

// You must use SSL cert from a domain of your own in order to be able to use HTTP2.
const SSL_DIR = path.resolve("../ssl-pems")
const caRoot = fs.readFileSync(`${SSL_DIR}/chain1.pem`)
const certChain = fs.readFileSync(`${SSL_DIR}/cert1.pem`)
const privateKey = fs.readFileSync(`${SSL_DIR}/privkey1.pem`)
const sslCreds = grpc.ServerCredentials.createSsl(caRoot, [{
  cert_chain: certChain,
  private_key: privateKey,
}])

const PORT = process.env.MYVAR_WEB_SERVER_PORT || 8001
const grpcServer = new grpc.Server({
  allowedOrigin: process.env.MYVAR_WEB_SERVER_ALLOWED_ORIGIN || undefined,
})

grpcServer.addService(helloworldProto.helloworld.HelloWorld.service, new HelloWorldService())

grpcServer.bindAsync(`0.0.0.0:${PORT}`, sslCreds, (err, port) => {
  if (err) {
    console.log("grpc server failed", err.message)
    return
  }

  console.log("grpc server started on port", port)
})
