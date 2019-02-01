import * as PIXI from 'pixi.js';
import throttle from 'lodash.throttle';
import TimelineLite from 'gsap/TimelineLite';   
import TweenLite from 'gsap/TweenLite'
import { Power0, Power3, Expo } from 'gsap/EasePack'; 
import { isMobile } from './utils';

const { Container, loader, Sprite, Graphics, WRAP_MODES, filters, autoDetectRenderer, ticker } = PIXI;

const FILTER_STATIC_SCALE = 15;
const RESIZE_DELAY = 750;
const CIRCLE_RADIUS = 350;

const $container = qs('.main-head');
const $canvas = $container.querySelector('#head-bg');

const renderer = new autoDetectRenderer($container.offsetWidth, $container.offsetHeight, {
  view: $canvas,
  backgroundColor: 0x2B2B2B,
  transparent: false,
});
const stage = new Container();
const myticker = new ticker.Ticker();
myticker.add(() => renderer.render(stage));
myticker.start();

// need to set alpha to 1 to the circle on first render
let isFirstMove = true;
let bg;
let filter;
let filterSprite;
let bg2;
const graphics = new Graphics();
graphics.beginFill(0xffffff);
graphics.drawCircle(0, 0, CIRCLE_RADIUS);
graphics.endFill();

function onload() {
  const txt = renderer.generateTexture(graphics);
  filterSprite = new Sprite(loader.resources.filter.texture);
  filterSprite.texture.baseTexture.wrapMode = WRAP_MODES.MIRRORED_REPEAT;
  filter = new filters.DisplacementFilter(filterSprite);
  filterSprite.scale.x = 4;
  filterSprite.scale.y = 4;
  filter.scale.x = 150;
  filter.scale.y = 150;
  filter.padding = 0;
  filterSprite.anchor.set(0.5);
  bg = new Sprite(loader.resources.bg.texture);
  bg2 = new Sprite(loader.resources.bg.texture);
  bg2.alpha = 0;
  stage.addChild(bg);
  stage.addChild(filterSprite);
  bg.filters = [ filter ];
  stage.addChild(bg2);
  stage.addChild(graphics);
  bg2.mask = graphics;
  resizeHandler();
  // filter animation is stuttering on mobile devices(at least my ipad air can't handle it)
  if(!isMobile) {
    myticker.add(() => {
      filterSprite.x += 0.15;
      filterSprite.y = - 0.5;
    });
  }
  animator();
  window.addEventListener('resize', resizeHandler);
  $container.addEventListener('mousemove', moveHandler);
}
const moveHandler = e => {
  if(isFirstMove) {
    TweenLite.to(bg2, 2, {
      alpha: 1,
    });
    isFirstMove = false;
  }
  const x = e.clientX, y = e.clientY + document.documentElement.scrollTop;
  graphics.x = x;
  graphics.y = y;
};
__ee__.on('load', onload);

const resizeHandler = throttle(() => {
  const width = $container.offsetWidth, height = $container.offsetHeight;
  const contRatio = width / height, bgRatio = bg.width / bg.height;
  if(contRatio > bgRatio) {
    bg.width = width;
    bg.height = width / bgRatio;
    bg2.width = width;
    bg2.height = width / bgRatio;
  } else {
    bg.height = height;
    bg.width = height * bgRatio;
    bg2.height = height;
    bg2.width = height * bgRatio;
  }
  renderer.resize(width, height);
  renderer.render(stage);
}, RESIZE_DELAY);

const scrollObserver = new IntersectionObserver(entries => {
  const entry = entries[0];
  if(entry.intersectionRatio > 0) {
    myticker.start();
  }
  else {
    myticker.stop();
  }
});
scrollObserver.observe($canvas);

function animator() {
  const $h1 = $container.querySelector('h1');
  const $p = $container.querySelector('p');
  const $btn = $container.querySelector('a');
  const tl = new TimelineLite();
  tl.to(filter.scale, 1.75, {
    x: isMobile ? 0 : FILTER_STATIC_SCALE, 
    y: isMobile ? 0 : FILTER_STATIC_SCALE,
    ease: Expo.ease,
  })
    .fromTo($h1, 2, {
      opacity: 0,
      y: -50,
    }, {
      opacity: 1,
      y: 0,
      ease: Power3.easeInOut,
    }, -0.3)
    .fromTo($p, 1.75, {
      opacity: 0, 
      x: -50,
    }, {
      opacity: 1,
      x: 0,
      ease: Power3.easeInOut,
    }, -0.1)
    .fromTo($btn, 1.75, {
      opacity: 0, 
      x: -50,
    }, {
      opacity: 1,
      x: 0,
      ease: Power3.easeInOut,
    }, 0)
}
