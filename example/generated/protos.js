/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.helloworld = (function() {

    /**
     * Namespace helloworld.
     * @exports helloworld
     * @namespace
     */
    var helloworld = {};

    helloworld.HelloRequest = (function() {

        /**
         * Properties of a HelloRequest.
         * @memberof helloworld
         * @interface IHelloRequest
         * @property {string|null} [username] HelloRequest username
         * @property {number|null} [userNo] HelloRequest userNo
         * @property {boolean|null} [isUserEnabled] HelloRequest isUserEnabled
         */

        /**
         * Constructs a new HelloRequest.
         * @memberof helloworld
         * @classdesc Represents a HelloRequest.
         * @implements IHelloRequest
         * @constructor
         * @param {helloworld.IHelloRequest=} [properties] Properties to set
         */
        function HelloRequest(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * HelloRequest username.
         * @member {string} username
         * @memberof helloworld.HelloRequest
         * @instance
         */
        HelloRequest.prototype.username = "";

        /**
         * HelloRequest userNo.
         * @member {number} userNo
         * @memberof helloworld.HelloRequest
         * @instance
         */
        HelloRequest.prototype.userNo = 0;

        /**
         * HelloRequest isUserEnabled.
         * @member {boolean} isUserEnabled
         * @memberof helloworld.HelloRequest
         * @instance
         */
        HelloRequest.prototype.isUserEnabled = false;

        /**
         * Creates a new HelloRequest instance using the specified properties.
         * @function create
         * @memberof helloworld.HelloRequest
         * @static
         * @param {helloworld.IHelloRequest=} [properties] Properties to set
         * @returns {helloworld.HelloRequest} HelloRequest instance
         */
        HelloRequest.create = function create(properties) {
            return new HelloRequest(properties);
        };

        /**
         * Encodes the specified HelloRequest message. Does not implicitly {@link helloworld.HelloRequest.verify|verify} messages.
         * @function encode
         * @memberof helloworld.HelloRequest
         * @static
         * @param {helloworld.IHelloRequest} message HelloRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        HelloRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.username != null && Object.hasOwnProperty.call(message, "username"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.username);
            if (message.userNo != null && Object.hasOwnProperty.call(message, "userNo"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.userNo);
            if (message.isUserEnabled != null && Object.hasOwnProperty.call(message, "isUserEnabled"))
                writer.uint32(/* id 3, wireType 0 =*/24).bool(message.isUserEnabled);
            return writer;
        };

        /**
         * Encodes the specified HelloRequest message, length delimited. Does not implicitly {@link helloworld.HelloRequest.verify|verify} messages.
         * @function encodeDelimited
         * @memberof helloworld.HelloRequest
         * @static
         * @param {helloworld.IHelloRequest} message HelloRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        HelloRequest.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a HelloRequest message from the specified reader or buffer.
         * @function decode
         * @memberof helloworld.HelloRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {helloworld.HelloRequest} HelloRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        HelloRequest.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.helloworld.HelloRequest();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.username = reader.string();
                        break;
                    }
                case 2: {
                        message.userNo = reader.int32();
                        break;
                    }
                case 3: {
                        message.isUserEnabled = reader.bool();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a HelloRequest message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof helloworld.HelloRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {helloworld.HelloRequest} HelloRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        HelloRequest.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a HelloRequest message.
         * @function verify
         * @memberof helloworld.HelloRequest
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        HelloRequest.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.username != null && message.hasOwnProperty("username"))
                if (!$util.isString(message.username))
                    return "username: string expected";
            if (message.userNo != null && message.hasOwnProperty("userNo"))
                if (!$util.isInteger(message.userNo))
                    return "userNo: integer expected";
            if (message.isUserEnabled != null && message.hasOwnProperty("isUserEnabled"))
                if (typeof message.isUserEnabled !== "boolean")
                    return "isUserEnabled: boolean expected";
            return null;
        };

        /**
         * Creates a HelloRequest message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof helloworld.HelloRequest
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {helloworld.HelloRequest} HelloRequest
         */
        HelloRequest.fromObject = function fromObject(object) {
            if (object instanceof $root.helloworld.HelloRequest)
                return object;
            var message = new $root.helloworld.HelloRequest();
            if (object.username != null)
                message.username = String(object.username);
            if (object.userNo != null)
                message.userNo = object.userNo | 0;
            if (object.isUserEnabled != null)
                message.isUserEnabled = Boolean(object.isUserEnabled);
            return message;
        };

        /**
         * Creates a plain object from a HelloRequest message. Also converts values to other types if specified.
         * @function toObject
         * @memberof helloworld.HelloRequest
         * @static
         * @param {helloworld.HelloRequest} message HelloRequest
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        HelloRequest.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.username = "";
                object.userNo = 0;
                object.isUserEnabled = false;
            }
            if (message.username != null && message.hasOwnProperty("username"))
                object.username = message.username;
            if (message.userNo != null && message.hasOwnProperty("userNo"))
                object.userNo = message.userNo;
            if (message.isUserEnabled != null && message.hasOwnProperty("isUserEnabled"))
                object.isUserEnabled = message.isUserEnabled;
            return object;
        };

        /**
         * Converts this HelloRequest to JSON.
         * @function toJSON
         * @memberof helloworld.HelloRequest
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        HelloRequest.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for HelloRequest
         * @function getTypeUrl
         * @memberof helloworld.HelloRequest
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        HelloRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/helloworld.HelloRequest";
        };

        return HelloRequest;
    })();

    helloworld.HelloReply = (function() {

        /**
         * Properties of a HelloReply.
         * @memberof helloworld
         * @interface IHelloReply
         * @property {string|null} [replyMessage] HelloReply replyMessage
         * @property {number|null} [replyNo] HelloReply replyNo
         * @property {boolean|null} [isReplyValid] HelloReply isReplyValid
         */

        /**
         * Constructs a new HelloReply.
         * @memberof helloworld
         * @classdesc Represents a HelloReply.
         * @implements IHelloReply
         * @constructor
         * @param {helloworld.IHelloReply=} [properties] Properties to set
         */
        function HelloReply(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * HelloReply replyMessage.
         * @member {string} replyMessage
         * @memberof helloworld.HelloReply
         * @instance
         */
        HelloReply.prototype.replyMessage = "";

        /**
         * HelloReply replyNo.
         * @member {number} replyNo
         * @memberof helloworld.HelloReply
         * @instance
         */
        HelloReply.prototype.replyNo = 0;

        /**
         * HelloReply isReplyValid.
         * @member {boolean} isReplyValid
         * @memberof helloworld.HelloReply
         * @instance
         */
        HelloReply.prototype.isReplyValid = false;

        /**
         * Creates a new HelloReply instance using the specified properties.
         * @function create
         * @memberof helloworld.HelloReply
         * @static
         * @param {helloworld.IHelloReply=} [properties] Properties to set
         * @returns {helloworld.HelloReply} HelloReply instance
         */
        HelloReply.create = function create(properties) {
            return new HelloReply(properties);
        };

        /**
         * Encodes the specified HelloReply message. Does not implicitly {@link helloworld.HelloReply.verify|verify} messages.
         * @function encode
         * @memberof helloworld.HelloReply
         * @static
         * @param {helloworld.IHelloReply} message HelloReply message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        HelloReply.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.replyMessage != null && Object.hasOwnProperty.call(message, "replyMessage"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.replyMessage);
            if (message.replyNo != null && Object.hasOwnProperty.call(message, "replyNo"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.replyNo);
            if (message.isReplyValid != null && Object.hasOwnProperty.call(message, "isReplyValid"))
                writer.uint32(/* id 3, wireType 0 =*/24).bool(message.isReplyValid);
            return writer;
        };

        /**
         * Encodes the specified HelloReply message, length delimited. Does not implicitly {@link helloworld.HelloReply.verify|verify} messages.
         * @function encodeDelimited
         * @memberof helloworld.HelloReply
         * @static
         * @param {helloworld.IHelloReply} message HelloReply message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        HelloReply.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a HelloReply message from the specified reader or buffer.
         * @function decode
         * @memberof helloworld.HelloReply
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {helloworld.HelloReply} HelloReply
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        HelloReply.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.helloworld.HelloReply();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.replyMessage = reader.string();
                        break;
                    }
                case 2: {
                        message.replyNo = reader.int32();
                        break;
                    }
                case 3: {
                        message.isReplyValid = reader.bool();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a HelloReply message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof helloworld.HelloReply
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {helloworld.HelloReply} HelloReply
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        HelloReply.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a HelloReply message.
         * @function verify
         * @memberof helloworld.HelloReply
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        HelloReply.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.replyMessage != null && message.hasOwnProperty("replyMessage"))
                if (!$util.isString(message.replyMessage))
                    return "replyMessage: string expected";
            if (message.replyNo != null && message.hasOwnProperty("replyNo"))
                if (!$util.isInteger(message.replyNo))
                    return "replyNo: integer expected";
            if (message.isReplyValid != null && message.hasOwnProperty("isReplyValid"))
                if (typeof message.isReplyValid !== "boolean")
                    return "isReplyValid: boolean expected";
            return null;
        };

        /**
         * Creates a HelloReply message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof helloworld.HelloReply
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {helloworld.HelloReply} HelloReply
         */
        HelloReply.fromObject = function fromObject(object) {
            if (object instanceof $root.helloworld.HelloReply)
                return object;
            var message = new $root.helloworld.HelloReply();
            if (object.replyMessage != null)
                message.replyMessage = String(object.replyMessage);
            if (object.replyNo != null)
                message.replyNo = object.replyNo | 0;
            if (object.isReplyValid != null)
                message.isReplyValid = Boolean(object.isReplyValid);
            return message;
        };

        /**
         * Creates a plain object from a HelloReply message. Also converts values to other types if specified.
         * @function toObject
         * @memberof helloworld.HelloReply
         * @static
         * @param {helloworld.HelloReply} message HelloReply
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        HelloReply.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.replyMessage = "";
                object.replyNo = 0;
                object.isReplyValid = false;
            }
            if (message.replyMessage != null && message.hasOwnProperty("replyMessage"))
                object.replyMessage = message.replyMessage;
            if (message.replyNo != null && message.hasOwnProperty("replyNo"))
                object.replyNo = message.replyNo;
            if (message.isReplyValid != null && message.hasOwnProperty("isReplyValid"))
                object.isReplyValid = message.isReplyValid;
            return object;
        };

        /**
         * Converts this HelloReply to JSON.
         * @function toJSON
         * @memberof helloworld.HelloReply
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        HelloReply.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for HelloReply
         * @function getTypeUrl
         * @memberof helloworld.HelloReply
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        HelloReply.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/helloworld.HelloReply";
        };

        return HelloReply;
    })();

    helloworld.HelloWorld = (function() {

        /**
         * Constructs a new HelloWorld service.
         * @memberof helloworld
         * @classdesc Represents a HelloWorld
         * @extends $protobuf.rpc.Service
         * @constructor
         * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
         * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
         * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
         */
        function HelloWorld(rpcImpl, requestDelimited, responseDelimited) {
            $protobuf.rpc.Service.call(this, rpcImpl, requestDelimited, responseDelimited);
        }

        (HelloWorld.prototype = Object.create($protobuf.rpc.Service.prototype)).constructor = HelloWorld;

        /**
         * Creates new HelloWorld service using the specified rpc implementation.
         * @function create
         * @memberof helloworld.HelloWorld
         * @static
         * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
         * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
         * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
         * @returns {HelloWorld} RPC service. Useful where requests and/or responses are streamed.
         */
        HelloWorld.create = function create(rpcImpl, requestDelimited, responseDelimited) {
            return new this(rpcImpl, requestDelimited, responseDelimited);
        };

        /**
         * Callback as used by {@link helloworld.HelloWorld#sayHello}.
         * @memberof helloworld.HelloWorld
         * @typedef SayHelloCallback
         * @type {function}
         * @param {Error|null} error Error, if any
         * @param {helloworld.HelloReply} [response] HelloReply
         */

        /**
         * Calls SayHello.
         * @function sayHello
         * @memberof helloworld.HelloWorld
         * @instance
         * @param {helloworld.IHelloRequest} request HelloRequest message or plain object
         * @param {helloworld.HelloWorld.SayHelloCallback} callback Node-style callback called with the error, if any, and HelloReply
         * @returns {undefined}
         * @variation 1
         */
        Object.defineProperty(HelloWorld.prototype.sayHello = function sayHello(request, callback) {
            return this.rpcCall(sayHello, $root.helloworld.HelloRequest, $root.helloworld.HelloReply, request, callback);
        }, "name", { value: "SayHello" });

        /**
         * Calls SayHello.
         * @function sayHello
         * @memberof helloworld.HelloWorld
         * @instance
         * @param {helloworld.IHelloRequest} request HelloRequest message or plain object
         * @returns {Promise<helloworld.HelloReply>} Promise
         * @variation 2
         */

        /**
         * Callback as used by {@link helloworld.HelloWorld#sayHelloStreamHello}.
         * @memberof helloworld.HelloWorld
         * @typedef SayHelloStreamHelloCallback
         * @type {function}
         * @param {Error|null} error Error, if any
         * @param {helloworld.HelloReply} [response] HelloReply
         */

        /**
         * Calls SayHelloStreamHello.
         * @function sayHelloStreamHello
         * @memberof helloworld.HelloWorld
         * @instance
         * @param {helloworld.IHelloRequest} request HelloRequest message or plain object
         * @param {helloworld.HelloWorld.SayHelloStreamHelloCallback} callback Node-style callback called with the error, if any, and HelloReply
         * @returns {undefined}
         * @variation 1
         */
        Object.defineProperty(HelloWorld.prototype.sayHelloStreamHello = function sayHelloStreamHello(request, callback) {
            return this.rpcCall(sayHelloStreamHello, $root.helloworld.HelloRequest, $root.helloworld.HelloReply, request, callback);
        }, "name", { value: "SayHelloStreamHello" });

        /**
         * Calls SayHelloStreamHello.
         * @function sayHelloStreamHello
         * @memberof helloworld.HelloWorld
         * @instance
         * @param {helloworld.IHelloRequest} request HelloRequest message or plain object
         * @returns {Promise<helloworld.HelloReply>} Promise
         * @variation 2
         */

        /**
         * Callback as used by {@link helloworld.HelloWorld#sayHelloStreamReply}.
         * @memberof helloworld.HelloWorld
         * @typedef SayHelloStreamReplyCallback
         * @type {function}
         * @param {Error|null} error Error, if any
         * @param {helloworld.HelloReply} [response] HelloReply
         */

        /**
         * Calls SayHelloStreamReply.
         * @function sayHelloStreamReply
         * @memberof helloworld.HelloWorld
         * @instance
         * @param {helloworld.IHelloRequest} request HelloRequest message or plain object
         * @param {helloworld.HelloWorld.SayHelloStreamReplyCallback} callback Node-style callback called with the error, if any, and HelloReply
         * @returns {undefined}
         * @variation 1
         */
        Object.defineProperty(HelloWorld.prototype.sayHelloStreamReply = function sayHelloStreamReply(request, callback) {
            return this.rpcCall(sayHelloStreamReply, $root.helloworld.HelloRequest, $root.helloworld.HelloReply, request, callback);
        }, "name", { value: "SayHelloStreamReply" });

        /**
         * Calls SayHelloStreamReply.
         * @function sayHelloStreamReply
         * @memberof helloworld.HelloWorld
         * @instance
         * @param {helloworld.IHelloRequest} request HelloRequest message or plain object
         * @returns {Promise<helloworld.HelloReply>} Promise
         * @variation 2
         */

        /**
         * Callback as used by {@link helloworld.HelloWorld#sayHelloBidi}.
         * @memberof helloworld.HelloWorld
         * @typedef SayHelloBidiCallback
         * @type {function}
         * @param {Error|null} error Error, if any
         * @param {helloworld.HelloReply} [response] HelloReply
         */

        /**
         * Calls SayHelloBidi.
         * @function sayHelloBidi
         * @memberof helloworld.HelloWorld
         * @instance
         * @param {helloworld.IHelloRequest} request HelloRequest message or plain object
         * @param {helloworld.HelloWorld.SayHelloBidiCallback} callback Node-style callback called with the error, if any, and HelloReply
         * @returns {undefined}
         * @variation 1
         */
        Object.defineProperty(HelloWorld.prototype.sayHelloBidi = function sayHelloBidi(request, callback) {
            return this.rpcCall(sayHelloBidi, $root.helloworld.HelloRequest, $root.helloworld.HelloReply, request, callback);
        }, "name", { value: "SayHelloBidi" });

        /**
         * Calls SayHelloBidi.
         * @function sayHelloBidi
         * @memberof helloworld.HelloWorld
         * @instance
         * @param {helloworld.IHelloRequest} request HelloRequest message or plain object
         * @returns {Promise<helloworld.HelloReply>} Promise
         * @variation 2
         */

        return HelloWorld;
    })();

    return helloworld;
})();

module.exports = $root;
