"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AbstractUpdater = (function () {
    function AbstractUpdater(data, now, old) {
        this.createInstance = function (ctor, oldInstance) { return new ctor(); };
        this.useFn = function (m) { return m.exports.default || m.exports; };
        this.needHotFn = function (m, ctor) { return m instanceof ctor; };
        this.data = data;
        this.now = now;
        this.old = old;
    }
    AbstractUpdater.prototype.needHot = function (handler) {
        this.needHotFn = handler;
        return this;
    };
    AbstractUpdater.prototype.use = function (handler) {
        this.useFn = handler;
        return this;
    };
    AbstractUpdater.prototype.creator = function (createInstance) {
        this.createInstance = createInstance;
        return this;
    };
    AbstractUpdater.prototype.update = function () {
        var _a = this, now = _a.now, old = _a.old;
        if (!now || !old || !this.data)
            return;
        var ctor = this.useFn(old);
        var newCtor = this.useFn(now);
        if (typeof ctor !== 'function')
            return;
        this.internalUpdate(ctor, newCtor);
        this.cleanUpdate(ctor);
    };
    return AbstractUpdater;
}());
exports.default = AbstractUpdater;
