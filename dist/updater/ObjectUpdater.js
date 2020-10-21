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
var ObjectUpdater = (function (_super) {
    __extends(ObjectUpdater, _super);
    function ObjectUpdater() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ObjectUpdater.prototype.internalUpdate = function (ctor, newCtor) {
        var _this = this;
        var creatable = typeof newCtor === 'function';
        var keys = Object.keys(this.data);
        keys.forEach(function (key) {
            var element = _this.data[key];
            if (!creatable || !_this.needHotFn(element, ctor)) {
                return;
            }
            else if (!creatable) {
                console.warn("Hot fail: " + newCtor.name + " : No-parameter construction required");
            }
            _this.data[key] = _this.createInstance(newCtor, element);
        });
    };
    ObjectUpdater.prototype.cleanUpdate = function (oldCtor) {
        var _this = this;
        var keys = Object.keys(this.data);
        var removes = [];
        keys.forEach(function (key) {
            var element = _this.data[key];
            if (_this.needHotFn(element, oldCtor)) {
                removes.push(key);
            }
        });
        removes.forEach(function (key) {
            delete _this.data[key];
        });
    };
    return ObjectUpdater;
}(AbstractUpdater_1.default));
exports.default = ObjectUpdater;
