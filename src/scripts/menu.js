import TimelineLite from 'gsap/TimelineLite';   
import { Expo, Power1 } from 'gsap/EasePack'; 

const $btn = qs('.menu-btn');

const $menu = qs('.site-nav');
const $links = $menu.querySelectorAll('.site-nav--links li');
const $phone = $menu.querySelector('.phone');
const $email = $menu.querySelector('.email');
const $socials = $menu.querySelectorAll('.site-nav--socials li');

function clickHandler() {
  $btn.classList.contains('is-active') ? close() : open();
}
function open() {
  $btn.classList.add('is-active');
  const tl = new TimelineLite();
  tl.to($menu, 1, {
    onStart() {
      $menu.style.display = 'flex';
    },
    ease: Power1.easeInOut,
    opacity: 1,
  })
    .fromTo($phone, .7, {
      opacity: 0,
      x: -100,
    },{
      opacity: 1,
      ease: Power1.easeInOut,
      x: 0,
    }, .5)
    .fromTo($email, .7, {
      opacity: 0,
      x: 100,
    },{
      opacity: 1,
      ease: Power1.easeInOut,
      x: 0,
    }, .5)
    .staggerFromTo($socials, 1, {
      opacity: 0,
      scale: 0.1,
    }, {
      ease: Expo.easeOut,
      scale: 1,
      opacity: 1,
    }, 0.1, .8)
    .staggerFromTo($links, 1, {
      opacity: 0,
      scale: 0.8,
      y: -50
    }, {
      ease: Expo.easeOut,
      scale: 1,
      opacity: 1,
      y: 0,
    }, 0.1, .5)

}
export function close() {
  if(!$btn.classList.contains('is-active')) {
    return;
  }
  $btn.classList.remove('is-active');
  const tl = new TimelineLite();
  tl.to($menu, 1, {
    opacity: 0,
    ease: Power1.easeInOut,
    onComplete() {
      $menu.style.display = '';
    }
  })
}

$btn.onclick = clickHandler;
