#!/usr/bin/env node

/**
 */

import fs from 'fs'
import glob from 'glob'
import path from 'path'
import {
  type Namespace,
  type NamespaceBase,
  Root,
  Service,
} from 'protobufjs'
import {
  pbjs,
  pbts,
} from 'protobufjs-cli'
import genMethodWrapper from './templates/methodWrapper'
import genServiceFile from './templates/serviceFile'
import {
  StreamRequestStreamResponse as genStreamRequestStreamResponse,
  StreamRequestUnaryResponse as genStreamRequestUnaryResponse,
  UnaryRequestStreamResponse as genUnaryRequestStreamResponse,
  UnaryRequestUnaryResponse as genUnaryRequestUnaryResponse,
} from './templates/methodHandlers'

//

const argv = process.argv.slice(2)
const protosSource = argv[0] || './protos/*.proto'
const preTarget = (argv[1] || './src/generated/').split('/').reverse()

if (!preTarget[0]) {
  preTarget.shift()
}

const targetModuleName = 'protos'
const targetFolder = preTarget.reverse().join('/')
const targetJS = `${targetFolder}/${targetModuleName}.js`

pbjs.main([
  '-t',
  'static-module',
  '-w',
  'commonjs',
  '-o',
  targetJS,
  protosSource,
])

pbts.main([
  '-o',
  `${targetFolder}/${targetModuleName}.d.ts`,
  targetJS,
])

glob(protosSource, (err, matches) => {
  if (err) {
    console.error(err)
    return
  }

  const root = new Root()
  
  root.loadSync(matches, {
    keepCase: false,
    alternateCommentMode: false,
  }).resolveAll()

  if (!root.nested) {
    return
  }

  type IMethod = {
    callbackName: string,
    generatedHandler: string,
    isRequestStreamable?: boolean,
    name: string,
    requestType: string,
    responseType: string,
  }

  type IService = {
    methods: Array<IMethod>,
    name: string,
  }

  type INamespace = {
    name: string,
    services: Array<IService|undefined>,
  }

  const namespaces = Object.keys(root.nested)
    .map<INamespace|undefined>((namespaceName) => {
      const namespace = root.nested![namespaceName] as Namespace
  
      if (!namespace.nested) {
        return
      }
  
      const services = Object.keys(namespace.nested)
        .map<INamespace['services'][0]>((typeName) => {
          const typeObj = namespace.nested![typeName] as NamespaceBase

          if ( !(typeObj instanceof Service) ) {
            return
          }

          const methods = Object.keys(typeObj.methods)
            .map<IMethod>((methodName) => {
              const {
                name,
                requestStream,
                requestType,
                responseStream,
                responseType,
              } = typeObj.methods[methodName]

              let methodWrapper: (namespaceName: string, serviceName: string, methodName: string) => string

              if (!requestStream && !responseStream) {
                methodWrapper = genUnaryRequestUnaryResponse
              }
              else if (!requestStream && responseStream) {
                methodWrapper = genUnaryRequestStreamResponse
              }
              else if (requestStream && !responseStream) {
                methodWrapper = genStreamRequestUnaryResponse
              }
              else {
                methodWrapper = genStreamRequestStreamResponse
              }

              const generatedHandler = methodWrapper(
                namespace.name,
                typeName,
                name,
              )

              return {
                callbackName: `${name}Callback`,
                generatedHandler,
                isRequestStreamable: requestStream,
                name,
                requestType,
                responseType,
              }
            })

          return {
            name: typeName,
            methods,
          }
        })

      return {
        services,
        name: namespaceName,
      }
    })

  for (const namespace of namespaces) {
    if (!namespace?.services.length) {
      continue
    }

    console.log('namespace:', namespace.name)
    fs.mkdirSync( path.resolve(targetFolder, namespace.name) )

    for (const service of namespace.services) {
      if (!service) {
        continue
      }

      // Generate a separate file per service.
      console.log('service:', service.name)
      console.table( service.methods.map(({ generatedHandler, ...method }) => method) )

      const methodWrappers = service.methods.map((method) => {
        const lcMethodName = method.name.charAt(0).toLowerCase() + method.name.slice(1)

        return genMethodWrapper(
          namespace.name,
          service.name,
          lcMethodName,
          method.requestType,
          method.responseType,
          method.callbackName,
        )
      })

      const methodHandlers = service.methods
        .filter((method) => !method.isRequestStreamable)
        .reduce((result, method) => ({
          ...result,
          [method.name]: method.generatedHandler!,
        }), {} as Record<string, string>)

      const requestStreamableMethodHandlers = service.methods
        .filter((method) => method.isRequestStreamable)
        .reduce((result, method) => ({
          ...result,
          [method.name]: method.generatedHandler!,
        }), {} as Record<string, string>)

      const serviceFile = genServiceFile(
        `../${targetModuleName}`,
        namespace.name,
        service.name,
        methodWrappers,
        methodHandlers,
        requestStreamableMethodHandlers,
      )

      if (serviceFile instanceof Error) {
        console.error(serviceFile)
        continue
      }

      fs.writeFileSync(`${path.resolve(targetFolder, namespace.name)}/${service.name}.ts`, serviceFile)
    }
  }
})
