import { loader } from 'pixi.js';
import { IMAGES_BASE_URL, isPortrait } from './utils';
const EventEmitter = require('wolfy87-eventemitter');
window.__ee__ = new EventEmitter();

const files = {
  'filter': IMAGES_BASE_URL + '/fibers.jpg',      
  'bg': isPortrait ? IMAGES_BASE_URL + '/head.jpg' : IMAGES_BASE_URL + '/head_portrait.jpg',
  [IMAGES_BASE_URL + '/review1.jpg']: IMAGES_BASE_URL + '/review1.jpg',
};

for(let key in files) {
  loader.add(key, files[key]);
}
loader.load(() => __ee__.emit('load'));
