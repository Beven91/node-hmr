import Color from './model/color';
import Size from './model/size';
import Type from './model/type';
import hot from '../src/index';

const registrations = new Array<Type>();

registrations.push(new Color());
registrations.push(new Size());


hot
  .create(module)
  .accept((now, old) => {
    // 热更新registrations
    hot.createHotUpdater<Type>(registrations, now, old).update();
    console.log('array.registrations.length',registrations.length);
  })