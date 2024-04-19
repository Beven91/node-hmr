/**
 * @module HotReload
 */
import path from 'path';
import fs from 'fs';
import HotModule from './HotModule';
import Module from 'module';
import ListReplacement from './updater/ListReplacement';
import createHotUpdater from './updater/index';

type Hooks = HotModule['hooks'];
type HookTypeKeys = keyof Hooks;

export declare class NodeHotModule extends Module {
  hot: HotModule
}

export declare class HotOptions {
  /**
   * 热更新监听目录
   */
  cwd: string | Array<string>
  /**
   * 热更新执行频率，单位：毫秒
   */
  reloadTimeout?: number
}

class HotReload {

  ListReplacement = ListReplacement

  /**
   * 创建一个数据热更新器
   */
  createHotUpdater<T>(data, now, old) {
    return createHotUpdater<T>(data, now, old);
  }

  /**
   * 热更新配置
   */
  options: HotOptions

  /**
   * 当前所有热更新模块
   */
  private hotModules: Map<string, HotModule>

  /**
   * 热更新执行频率单位：毫秒
   */
  private reloadTimeout: number

  constructor() {
    this.hotModules = new Map<string, HotModule>();
  }

  /**
   * 创建指定id的热更新模块，如果模块已存在，则直接返回
   * @param {Module} mod 模块对象 
   */
  public create(mod): HotModule {
    const id = mod.filename || mod.id;
    if (!this.hotModules.get(id)) {
      mod.hot = new HotModule(id);
      this.hotModules.set(id, mod.hot);
    }
    return this.hotModules.get(id);
  }

  /**
   * 监听文件改动
   */
  watch(cwd) {
    if (!cwd) {
      return;
    }
    const runtime = {}
    fs.watch(cwd, { recursive: true }, (type, filename) => {
      if (!/node_module/.test(filename) && /\.(ts|js)$/.test(filename)) {
        const id = path.join(cwd, filename).replace(/^[A-Z]:/, (a) => a.toUpperCase());
        clearTimeout(runtime[type]);
        runtime[type] = setTimeout(() => this.hotWatch(type, id), this.reloadTimeout);
      }
    });
  }

  hotWatch(type, filename) {
    const mode = type === 'rename' ? fs.existsSync(filename) ? 'created' : 'remove' : type;
    switch (mode) {
      case 'created':
        if (!require.cache[filename]) {
          // console.log('created:', filename)
          require(filename);
          const m = require.cache[filename] as NodeHotModule;
          this.invokeHook('created', m);
          this.invokeHook('postend', m, m);
        }
        break;
      default:
        this.handleReload(filename);
    }
  }

  renderId(id) {
    if (process.platform === 'win32') {
      return require.cache[id] ? id : id.replace(/^[A-Z]:/, (a) => a.toLowerCase());
    }
    return id;
  }

  /**
   * 文件改动时，处理热更新
   * @param id 
   */
  handleReload(id) {
    id = this.renderId(id);
    if (!require.cache[id]) {
      // 如果模块已删除，则直接掠过
      return;
    }
    const start = Date.now();
    this.reload(id, {});
    const end = new Date();
    console.log(`Time: ${end.getTime() - start}ms`);
    console.log(`Built at: ${end.toLocaleDateString()} ${end.toLocaleTimeString()}`);
    console.log(`Hot reload successfully`);
  }

  /**
   * 重载模块
   */
  reload(id: string, reloadeds: Record<string, boolean>, stopReason = false) {
    if (reloadeds[id] || !require.cache[id] || require.cache[id] === module) {
      return;
    }
    reloadeds[id] = true;
    // 获取旧的模块实例
    const old = require.cache[id] as NodeHotModule;
    const parent = old.parent;
    try {
      // 执行hooks.pre
      this.invokeHook('pre', old);
      // 执行hooks.preend
      this.invokeHook('preend', old);
      // 将hot对象从旧的模块实例上分离
      delete old.hot;
      // 删除缓存
      delete require.cache[id];
      // 如果文件一删除，则跳过
      if (!fs.existsSync(id)) {
        console.log('Hot remove: ', id);
        return;
      }
      console.log(`Hot reload: ${id}`);
      // 执行hooks.accept
      const reasons = stopReason ? [] : this.findDependencies(old);
      if (reasons.length < 1) {
        // 1.重要： 如果是顶层,才开始重新载入，需要保证模块按照原本顺序重新载入
        require(id);
      }
      // 向上传递更新
      reasons.forEach((reason) => {
        if (reason.hooks.accept.count > 0) {
          // 如果父模块定义了accept 
          return;
        } else if (require.cache[reason.id] !== require.main && !reason.hasAnyHooks) {
          // 如果当前父模块已载入过，则本地父模块重新载入不需要reason回溯
          const stopReason = reloadeds[reason.id];
          // 确保父模块需要重新载入
          reloadeds[reason.id] = false;
          // 如果父模块没有定义accept 则重新载入父模块
          this.reload(reason.id, reloadeds, stopReason);
        }
      });
      if (!require.cache[id]) {
        // 2.如果当前模块没有重新载入，则补偿载入
        require(id);
      }
      // 获取当前更新后的模块实例
      const now = require.cache[id] as NodeHotModule;
      // 从子依赖中删除掉刚刚引入的模块，防止出现错误的依赖关系
      const index = module.children.indexOf(now);
      index > -1 ? module.children.splice(index, 1) : undefined;
      // 执行父级accept函数
      reasons.forEach((reason) => {
        reason.hooks.accept.invoke(now, old);
      })
      this.invokeHook('postend', now, old);
      // 还原父依赖
      if (old.parent) {
        now.parent = require.cache[old.parent.id];
      }
    } catch (ex) {
      // 如果热更新异常，则需要还原被删除的内容
      const mod = require.cache[id] = (require.cache[id] || old) as NodeHotModule;
      mod.parent = parent;
      // 从子依赖中删除掉刚刚引入的模块，防止出现错误的依赖关系
      const finded = module.children.find((m) => m.filename === id);
      const index = module.children.indexOf(finded)
      index > -1 ? module.children.splice(index, 1) : undefined;
      console.error('Hot reload error', ex.stack);
    }
  }

  /**
   * 广播注册的热更新消息
   */
  invokeHook<K extends HookTypeKeys>(name: K, ...args: Parameters<Hooks[K]['invoke']>) {
    this.hotModules.forEach((m) => {
      const hook = m.hooks[name];
      if (hook) {
        return hook.invoke.apply(hook, args);
      }
    })
  }

  /**
   * 项目启动后，初始化构建热更新模块
   */
  findDependencies(old: NodeHotModule) {
    const reasons = [] as HotModule[]
    const cache = require.cache;
    Object.keys(cache).map((k) => {
      const mod = cache[k] as NodeHotModule;
      const isDependency = mod.children.indexOf(old) > -1;
      if (isDependency) {
        // 如果依赖了当前id模块 >>> reason
        reasons.push(this.create(mod));
      }
    });
    return reasons;
  }

  /**
   * 监听改变
   */
  run(options?: HotOptions) {
    options = options || {} as HotOptions;
    this.options = options;
    this.reloadTimeout = options.reloadTimeout || 300;
    const cwd = options.cwd || path.resolve('');
    const dirs = cwd instanceof Array ? cwd : [cwd];
    dirs.forEach((item) => this.watch(item))
  }
}

export default new HotReload();