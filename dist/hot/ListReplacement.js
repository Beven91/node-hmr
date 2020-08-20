"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ListReplacement = (function () {
    function ListReplacement(elements, now, old) {
        if (!now || !old)
            return;
        var ctor = old.exports.default || old.exports;
        var newCtor = now.exports.default || now.exports;
        if (typeof ctor !== 'function')
            return;
        var creatable = typeof newCtor === 'function';
        elements.forEach(function (element, index) {
            if (!creatable || !(element instanceof ctor)) {
                return;
            }
            else if (!creatable) {
                console.warn("Hot fail: " + newCtor.name + " : No-parameter construction required");
            }
            elements[index] = new newCtor();
        });
        var items = elements.filter(function (i) { return !(i instanceof ctor); });
        if (items.length !== elements.length) {
            elements.length = 0;
            elements.push.apply(elements, items);
        }
        ;
    }
    return ListReplacement;
}());
exports.default = ListReplacement;
