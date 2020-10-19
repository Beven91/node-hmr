/**
 * @module Hook
 * @description 更新钩子
 */

export default class Hook {

  private handlers = new Array<Function>();

  add(handler: Function) {
    this.handlers.push(handler);
  }

  invoke(...args) {
    this.handlers.forEach((handler) => handler(...args));
  }
}