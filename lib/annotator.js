"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Engine = require("./engine");
const Config = require("./config");
async function Annotator({ name, receive, customConfig = {} }) {
    const config = Object.assign({}, Config.Base, Config.Annotator, customConfig);
    const send = await Engine.createSend(config);
    return await Engine.createReceive(Object.assign({}, config, { send, receive }));
}
exports.Annotator = Annotator;
