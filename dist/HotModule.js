"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Hook_1 = __importDefault(require("./Hook"));
var includes = [
    /node_modules\/node-web-mvc/,
    /^((?!node_modules).)*$/i,
];
var HotModule = (function () {
    function HotModule(id) {
        this.hooks = {
            accept: new Hook_1.default(),
            pre: new Hook_1.default(),
            preend: new Hook_1.default(),
            postend: new Hook_1.default()
        };
        this.id = id;
        this.reasons = [];
    }
    HotModule.setInclude = function (items) {
        (items || []).forEach(function (item) {
            if (item instanceof RegExp) {
                includes.push(item);
            }
        });
    };
    Object.defineProperty(HotModule.prototype, "nativeExports", {
        get: function () {
            return require.cache[this.id].exports;
        },
        enumerable: false,
        configurable: true
    });
    HotModule.isInclude = function (filename) {
        filename = filename.replace(/\\/g, '/');
        return !!includes.find(function (reg) { return reg.test(filename); });
    };
    Object.defineProperty(HotModule.prototype, "hasAnyHooks", {
        get: function () {
            var _a = this.hooks, accept = _a.accept, pre = _a.pre, preend = _a.preend, postend = _a.postend;
            return accept.count > 0 || pre.count > 0 || preend.count > 0 || postend.count > 0;
        },
        enumerable: false,
        configurable: true
    });
    HotModule.prototype.accept = function (handler) {
        this.hooks.accept.add(handler);
        return this;
    };
    HotModule.prototype.preload = function (handler) {
        this.hooks.pre.add(handler);
        return this;
    };
    HotModule.prototype.preend = function (handler) {
        this.hooks.preend.add(handler);
        return this;
    };
    HotModule.prototype.clean = function (types) {
        var _this = this;
        types = types || ['accept', 'pre', 'preend', 'postend'];
        types.forEach(function (name) {
            var hook = _this.hooks[name];
            hook.clean();
        });
    };
    HotModule.prototype.postend = function (handler) {
        this.hooks.postend.add(handler);
    };
    HotModule.prototype.invokeHook = function (name, invokes) {
        var params = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            params[_i - 2] = arguments[_i];
        }
        if (invokes[this.id] || !require.cache[this.id]) {
            return;
        }
        else if (this.hooks[name]) {
            var hook = this.hooks[name];
            hook.invoke.apply(hook, params);
        }
        invokes[this.id] = true;
        try {
            var mod = require.cache[this.id];
            var children = mod.children;
            children.forEach(function (child) {
                var _a;
                if (HotModule.isInclude(child.filename)) {
                    child.hot = child.hot || new HotModule(child.filename);
                }
                if (child.hot) {
                    (_a = child.hot).invokeHook.apply(_a, __spreadArrays([name, invokes], params));
                }
            });
        }
        catch (ex) {
            console.error(ex.stack);
        }
    };
    HotModule.prototype.addReason = function (hotModule) {
        if (this.reasons.indexOf(hotModule) < 0) {
            this.reasons.push(hotModule);
        }
    };
    return HotModule;
}());
exports.default = HotModule;
