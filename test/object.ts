import Color from './model/color';
import Size from './model/size';
import Type from './model/type';
import hot from '../src/index';

const registrations = {
  color:new Color(),
  size:new Size()
}

hot
  .create(module)
  .accept((now, old) => {
    // 热更新registrations
    hot.createHotUpdater<Type>(registrations, now, old).update();
    console.log('array.registrations.length',Object.keys(registrations));
  })