import Material from './model/material';
import Origin from './model/origin';
import Type from './model/type';
import hot from '../src/index';

const registrations = new Map<string, Type>();

registrations.set('material', new Material());
registrations.set('origin', new Origin());

hot
  .create(module)
  .accept((now, old) => {
    // 热更新registrations
    hot.createHotUpdater<Type>(registrations, now, old).update();
    const keys = [];
    registrations.forEach((item, k) => keys.push(k));
    console.log('array.registrations.length', keys.join(','));
  })