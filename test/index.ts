import path from 'path';
import hot from '../src/index';
import './demo';
import './array';
import './map';
import './object';

hot.run({
  cwd: path.join(__dirname)
})