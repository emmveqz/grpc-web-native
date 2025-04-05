import * as $protobuf from "protobufjs";
import Long = require("long");
/** Namespace helloworld. */
export namespace helloworld {

    /** Properties of a HelloRequest. */
    interface IHelloRequest {

        /** HelloRequest username */
        username?: (string|null);

        /** HelloRequest userNo */
        userNo?: (number|null);

        /** HelloRequest isUserEnabled */
        isUserEnabled?: (boolean|null);
    }

    /** Represents a HelloRequest. */
    class HelloRequest implements IHelloRequest {

        /**
         * Constructs a new HelloRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: helloworld.IHelloRequest);

        /** HelloRequest username. */
        public username: string;

        /** HelloRequest userNo. */
        public userNo: number;

        /** HelloRequest isUserEnabled. */
        public isUserEnabled: boolean;

        /**
         * Creates a new HelloRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns HelloRequest instance
         */
        public static create(properties?: helloworld.IHelloRequest): helloworld.HelloRequest;

        /**
         * Encodes the specified HelloRequest message. Does not implicitly {@link helloworld.HelloRequest.verify|verify} messages.
         * @param message HelloRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: helloworld.IHelloRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified HelloRequest message, length delimited. Does not implicitly {@link helloworld.HelloRequest.verify|verify} messages.
         * @param message HelloRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: helloworld.IHelloRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a HelloRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns HelloRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): helloworld.HelloRequest;

        /**
         * Decodes a HelloRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns HelloRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): helloworld.HelloRequest;

        /**
         * Verifies a HelloRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a HelloRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns HelloRequest
         */
        public static fromObject(object: { [k: string]: any }): helloworld.HelloRequest;

        /**
         * Creates a plain object from a HelloRequest message. Also converts values to other types if specified.
         * @param message HelloRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: helloworld.HelloRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this HelloRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for HelloRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a HelloReply. */
    interface IHelloReply {

        /** HelloReply replyMessage */
        replyMessage?: (string|null);

        /** HelloReply replyNo */
        replyNo?: (number|null);

        /** HelloReply isReplyValid */
        isReplyValid?: (boolean|null);
    }

    /** Represents a HelloReply. */
    class HelloReply implements IHelloReply {

        /**
         * Constructs a new HelloReply.
         * @param [properties] Properties to set
         */
        constructor(properties?: helloworld.IHelloReply);

        /** HelloReply replyMessage. */
        public replyMessage: string;

        /** HelloReply replyNo. */
        public replyNo: number;

        /** HelloReply isReplyValid. */
        public isReplyValid: boolean;

        /**
         * Creates a new HelloReply instance using the specified properties.
         * @param [properties] Properties to set
         * @returns HelloReply instance
         */
        public static create(properties?: helloworld.IHelloReply): helloworld.HelloReply;

        /**
         * Encodes the specified HelloReply message. Does not implicitly {@link helloworld.HelloReply.verify|verify} messages.
         * @param message HelloReply message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: helloworld.IHelloReply, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified HelloReply message, length delimited. Does not implicitly {@link helloworld.HelloReply.verify|verify} messages.
         * @param message HelloReply message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: helloworld.IHelloReply, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a HelloReply message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns HelloReply
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): helloworld.HelloReply;

        /**
         * Decodes a HelloReply message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns HelloReply
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): helloworld.HelloReply;

        /**
         * Verifies a HelloReply message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a HelloReply message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns HelloReply
         */
        public static fromObject(object: { [k: string]: any }): helloworld.HelloReply;

        /**
         * Creates a plain object from a HelloReply message. Also converts values to other types if specified.
         * @param message HelloReply
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: helloworld.HelloReply, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this HelloReply to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for HelloReply
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Represents a HelloWorld */
    class HelloWorld extends $protobuf.rpc.Service {

        /**
         * Constructs a new HelloWorld service.
         * @param rpcImpl RPC implementation
         * @param [requestDelimited=false] Whether requests are length-delimited
         * @param [responseDelimited=false] Whether responses are length-delimited
         */
        constructor(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean);

        /**
         * Creates new HelloWorld service using the specified rpc implementation.
         * @param rpcImpl RPC implementation
         * @param [requestDelimited=false] Whether requests are length-delimited
         * @param [responseDelimited=false] Whether responses are length-delimited
         * @returns RPC service. Useful where requests and/or responses are streamed.
         */
        public static create(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean): HelloWorld;

        /**
         * Calls SayHello.
         * @param request HelloRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and HelloReply
         */
        public sayHello(request: helloworld.IHelloRequest, callback: helloworld.HelloWorld.SayHelloCallback): void;

        /**
         * Calls SayHello.
         * @param request HelloRequest message or plain object
         * @returns Promise
         */
        public sayHello(request: helloworld.IHelloRequest): Promise<helloworld.HelloReply>;

        /**
         * Calls SayHelloStreamHello.
         * @param request HelloRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and HelloReply
         */
        public sayHelloStreamHello(request: helloworld.IHelloRequest, callback: helloworld.HelloWorld.SayHelloStreamHelloCallback): void;

        /**
         * Calls SayHelloStreamHello.
         * @param request HelloRequest message or plain object
         * @returns Promise
         */
        public sayHelloStreamHello(request: helloworld.IHelloRequest): Promise<helloworld.HelloReply>;

        /**
         * Calls SayHelloStreamReply.
         * @param request HelloRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and HelloReply
         */
        public sayHelloStreamReply(request: helloworld.IHelloRequest, callback: helloworld.HelloWorld.SayHelloStreamReplyCallback): void;

        /**
         * Calls SayHelloStreamReply.
         * @param request HelloRequest message or plain object
         * @returns Promise
         */
        public sayHelloStreamReply(request: helloworld.IHelloRequest): Promise<helloworld.HelloReply>;

        /**
         * Calls SayHelloBidi.
         * @param request HelloRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and HelloReply
         */
        public sayHelloBidi(request: helloworld.IHelloRequest, callback: helloworld.HelloWorld.SayHelloBidiCallback): void;

        /**
         * Calls SayHelloBidi.
         * @param request HelloRequest message or plain object
         * @returns Promise
         */
        public sayHelloBidi(request: helloworld.IHelloRequest): Promise<helloworld.HelloReply>;
    }

    namespace HelloWorld {

        /**
         * Callback as used by {@link helloworld.HelloWorld#sayHello}.
         * @param error Error, if any
         * @param [response] HelloReply
         */
        type SayHelloCallback = (error: (Error|null), response?: helloworld.HelloReply) => void;

        /**
         * Callback as used by {@link helloworld.HelloWorld#sayHelloStreamHello}.
         * @param error Error, if any
         * @param [response] HelloReply
         */
        type SayHelloStreamHelloCallback = (error: (Error|null), response?: helloworld.HelloReply) => void;

        /**
         * Callback as used by {@link helloworld.HelloWorld#sayHelloStreamReply}.
         * @param error Error, if any
         * @param [response] HelloReply
         */
        type SayHelloStreamReplyCallback = (error: (Error|null), response?: helloworld.HelloReply) => void;

        /**
         * Callback as used by {@link helloworld.HelloWorld#sayHelloBidi}.
         * @param error Error, if any
         * @param [response] HelloReply
         */
        type SayHelloBidiCallback = (error: (Error|null), response?: helloworld.HelloReply) => void;
    }
}
