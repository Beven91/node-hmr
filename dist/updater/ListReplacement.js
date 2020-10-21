"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ArrayUpdater_1 = __importDefault(require("./ArrayUpdater"));
var ListReplacement = (function () {
    function ListReplacement(elements, now, old) {
        var updater = new ArrayUpdater_1.default(elements, now, old);
        updater.update();
    }
    return ListReplacement;
}());
exports.default = ListReplacement;
