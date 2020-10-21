"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ArrayUpdater_1 = __importDefault(require("./ArrayUpdater"));
var ObjectUpdater_1 = __importDefault(require("./ObjectUpdater"));
var MapUpdater_1 = __importDefault(require("./MapUpdater"));
function createHotUpdater(data, now, old) {
    if (data instanceof Array) {
        return new ArrayUpdater_1.default(data, now, old);
    }
    else if (data instanceof Map) {
        return new MapUpdater_1.default(data, now, old);
    }
    else {
        return new ObjectUpdater_1.default(data, now, old);
    }
}
exports.default = createHotUpdater;
