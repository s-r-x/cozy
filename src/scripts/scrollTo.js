import jump from 'jump.js'
import { close } from './menu';

function clickHandler({ target }) {
  const selector = target.href.match(/#.*/)[0];
  close();
  jump(selector);
  return false;
}
[].slice.call(qsa("a[href*=\\#]")).forEach($el => $el.onclick = clickHandler);
