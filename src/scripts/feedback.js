import * as PIXI from 'pixi.js';
import { IMAGES_BASE_URL, isMobile } from './utils';
import TimelineLite from 'gsap/TimelineLite';   
import TweenLite from 'gsap/TweenLite'
import { Power1 } from 'gsap/EasePack'; 
const feedbackList = require('../../feedback.json').list;

const { Sprite, Container, loader, autoDetectRenderer, filters, WRAP_MODES } = PIXI;

// ^-^ DOM REFS ^-^
const pr = '.feedback-slider';
const $root = qs(pr);
const DOMrefs = {
  sect: qs('.feedback-section'),
  canvasWrap: $root.querySelector('figure'),
  canvas: $root.querySelector('canvas'),
  prevBtn: $root.querySelector(`${pr}--prev`),
  nextBtn: $root.querySelector(`${pr}--next`),
  head: $root.querySelector(`${pr}--header`),
  name: $root.querySelector(`${pr}--name`),
  quote: $root.querySelector(`${pr}--quote`),
  countCurrent: $root.querySelector(`${pr}--count-current`),
  countOverall: $root.querySelector(`${pr}--count-overall`),
  dots: $root.querySelector(`${pr}--dots`),
};

// ^-^ SLIDES ^-^ 
let activeSlide = 0;
const slides = feedbackList.map(({ photo }) => IMAGES_BASE_URL + photo);

// ^-^ INIT ^-^ 
const renderer = new autoDetectRenderer(DOMrefs.canvasWrap.offsetWidth, DOMrefs.canvasWrap.offsetHeight, {
  view: DOMrefs.canvas,
  transparent: true,
});
renderer.plugins.interaction.autoPreventDefault = false;
const stage = new Container();
let isAnimating = false;
let sprite;
let filter;
let filterSprite;
const myticker = new PIXI.ticker.Ticker();
function onloadHandler() {
  updateValues(feedbackList[activeSlide]);
  $createDots();

  sprite = new Sprite(loader.resources[slides[0]].texture);

  filterSprite = new Sprite(loader.resources.filter.texture);
  filter = new filters.DisplacementFilter(filterSprite);
  filter.padding = 0;
  filter.scale.x = 0;
  filter.scale.y = 0;
  filterSprite.scale.x = 0;
  filterSprite.scale.y = 0;
  filterSprite.texture.baseTexture.wrapMode = WRAP_MODES.MIRRORED_REPEAT;

  stage.addChild(sprite);
  stage.addChild(filterSprite);
  stage.filters = [ filter ];

  scaleSlide(sprite);
  myticker.add(() => renderer.render(stage));
  myticker.start();
  if(!isMobile) {
    filter.scale.x = 15;
    filter.scale.y = 15;
    filterSprite.scale.x = 4;
    filterSprite.scale.y = 4;
    myticker.add(() => {
      filterSprite.x += 0.15;
      filterSprite.y = - 0.5;
    });
  }
  if(isMobile) {
    loadSwiper()
      .then(({ init }) => init({
        $container: DOMrefs.canvas,
        next: nextSlide,
        prev: prevSlide,
      }))
      .catch(err => console.error('could\'t load feedback swiper'));
  }
  renderer.plugins.interaction.on('pointerover', mouseoverHandler);
  renderer.plugins.interaction.on('pointerout', mouseoutHandler);
}
function mouseoverHandler() {
  TweenLite.to(filter.scale, 1, {
    x: 0,
    y: 0,
  });
}
function mouseoutHandler() {
  TweenLite.to(filter.scale, 1, {
    x: 15,
    y: 15,
  });
}
function $createDots() {
  const $frag = document.createDocumentFragment();  
  const len = feedbackList.length;
  for(let i = 0; i < len; i++) {
    const $dot = document.createElement('button');
    $dot.classList.add('feedback-slider--dot');
    if(i === 0) {
      $dot.classList.add('is-active');
    }
    $dot.dataset.index = i;
    $frag.appendChild($dot);
  }
  DOMrefs.dots.appendChild($frag);
}


// ^-^ MAIN LOGIC ^-^
function scaleSlide(sprite) {
  const { width, height } = sprite.texture;
  const containerWidth = DOMrefs.canvasWrap.offsetWidth;
  let ratio;
  if(width >= containerWidth) {
    ratio = containerWidth / width;
  }
  else {
    ratio = width / containerWidth;
  }
  sprite.scale.x = ratio;
  sprite.scale.y = ratio;
  renderer.resize(width * ratio, height * ratio);
}

async function changeSlide() {
  isAnimating = true;
  const texture = await getNewTexture();
  const TIME = 0.7;
  const TEXT_TIME = 0.6;
  const tl = new TimelineLite();

  tl.add('START', 0);
  tl.add('FADE_END', TIME);
  // photo 
  tl.to(sprite, TIME, {
    onComplete() {
      sprite.texture = texture;
    },
    ease: Power1.easeInOut,
    alpha: 0.025,
  }, 'START')
  tl.to(sprite, TIME, {
    ease: Power1.easeInOut,
    alpha: 1,
  }, 'FADE_END');

  // text
  const data = feedbackList[activeSlide];
  const $text = [ DOMrefs.countCurrent, DOMrefs.head, DOMrefs.name, DOMrefs.quote ];
  tl.staggerTo($text, TEXT_TIME, {
    ease: Power1.easeInOut,
    y: '100%',
  }, 0.05, 'START', () => {
    updateValues(data);
    [].slice.call($text).forEach($el => TweenLite.set($el, { y: '-100%' }));
    (new TimelineLite()).staggerTo($text, TEXT_TIME, {
      y: '0%',
      ease: Power1.easeInOut,
    }, 0.05, 0, () => {
      isAnimating = false;
    });
  })
}


function getNewTexture() {
  return new Promise((res, rej) => {
    const url = slides[activeSlide];
    // already loaded
    if(url in loader.resources) {
      res(loader.resources[url].texture);
    }
    else {
      // need to load
      loader.add(url).load(() => {
        res(loader.resources[url].texture);
      });
    }
  })
}
function updateValues(data) {
  let { name, head, quote, countCurrent, countOverall } = DOMrefs;
  countOverall.textContent = normalizeNumber(feedbackList.length);
  countCurrent.textContent = normalizeNumber(activeSlide + 1);
  name.textContent = data.name;
  head.innerHTML = data.head.replace(' ', '<br/>');
  quote.textContent = data.text;
}
function updateDots() {
  [].slice.call(DOMrefs.dots.querySelectorAll('button')).forEach($btn => {
    if($btn.dataset.index == activeSlide) {
      $btn.classList.add('is-active');
    }
    else {
      $btn.classList.remove('is-active');
    }
  });
}
function normalizeNumber(n) {
  return n < 9 ? '0' + n : n;
}


// ^-^ EVENTS ^-^ 
function nextSlide() {
  if(loader.loading || isAnimating) {
    return;
  }
  activeSlide = activeSlide === slides.length - 1 ? 0 : activeSlide + 1;
  updateDots();
  changeSlide();
}
function prevSlide() {
  if(loader.loading || isAnimating) {
    return;
  }
  activeSlide = activeSlide === 0 ? slides.length-1 : activeSlide - 1;
  updateDots();
  changeSlide();
}
DOMrefs.nextBtn.onclick = nextSlide;
DOMrefs.prevBtn.onclick = prevSlide;
DOMrefs.dots.onclick = ({ target }) => {
  if(loader.loading || isAnimating) {
    return;
  }
  const index = target.dataset.index;
  if(index === undefined || index == activeSlide) {
    return;
  }
  else {
    activeSlide = Number(index);
    updateDots();
    changeSlide();
  }
};
function loadSwiper() {
  return import(/* webpackChunkName: "feedbackSwiper" */ './feedbackSwiper');
}

// first slide has loaded, let's start!
__ee__.on('load', onloadHandler);
