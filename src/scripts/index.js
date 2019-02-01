require('../styles/index.less');
require('intersection-observer');

import CSSPlugin from 'gsap/CSSPlugin';
import { isMobile } from './utils';

window.isMobile = isMobile;
const plugins = [ CSSPlugin ];
window.qs = document.querySelector.bind(document);
window.qsa = document.querySelectorAll.bind(document);

const $head = qs('.main-head');
$head.style.height = window.innerHeight + 'px';

require('./loader');
require('./preloader');
require('./scrollTo');
require('./scroll');
require('./head');
require('./menu');
require('./feedback');
require('./form');
