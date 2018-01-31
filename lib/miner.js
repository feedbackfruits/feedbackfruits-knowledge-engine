"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Engine = require("./engine");
const Config = require("./config");
async function Miner({ name, customConfig = {} }) {
    const config = Object.assign({}, Config.Base, Config.Miner, customConfig);
    return await Engine.createSend(config);
}
exports.Miner = Miner;
