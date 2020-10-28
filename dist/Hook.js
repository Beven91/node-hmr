"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Hook = (function () {
    function Hook() {
        this.handlers = new Array();
    }
    Object.defineProperty(Hook.prototype, "count", {
        get: function () {
            return this.handlers.length;
        },
        enumerable: false,
        configurable: true
    });
    Hook.prototype.add = function (handler) {
        this.handlers.push(handler);
    };
    Hook.prototype.invoke = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.handlers.forEach(function (handler) { return handler.apply(void 0, args); });
    };
    Hook.prototype.clean = function () {
        this.handlers.length = 0;
    };
    return Hook;
}());
exports.default = Hook;
