"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Engine = require("./engine");
const Config = require("./config");
async function Broker({ name, receive, customConfig = {} }) {
    const config = Object.assign({}, Config.Base, Config.Broker, customConfig);
    const send = async (operation) => { };
    return (await Engine.createReceive(Object.assign({}, config, { send, receive: (send) => receive })));
}
exports.Broker = Broker;
