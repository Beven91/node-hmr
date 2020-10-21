"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var AbstractUpdater_1 = __importDefault(require("./AbstractUpdater"));
var MapUpdater = (function (_super) {
    __extends(MapUpdater, _super);
    function MapUpdater() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MapUpdater.prototype.internalUpdate = function (ctor, newCtor) {
        var _this = this;
        var creatable = typeof newCtor === 'function';
        var elements = this.data;
        elements.forEach(function (element, key) {
            if (!creatable || !_this.needHotFn(element, ctor)) {
                return;
            }
            else if (!creatable) {
                console.warn("Hot fail: " + newCtor.name + " : No-parameter construction required");
            }
            elements.set(key, _this.createInstance(newCtor, element));
        });
    };
    MapUpdater.prototype.cleanUpdate = function (oldCtor) {
        var _this = this;
        var elements = this.data;
        var removes = [];
        elements.forEach(function (element, key) {
            if (_this.needHotFn(element, oldCtor)) {
                removes.push(key);
            }
        });
        removes.forEach(function (key) {
            elements.delete(key);
        });
    };
    return MapUpdater;
}(AbstractUpdater_1.default));
exports.default = MapUpdater;
