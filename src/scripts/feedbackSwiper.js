import Hammer from 'hammerjs'

export function init({ $container, prev, next }) {
  const hammertime = new Hammer($container, {});
  hammertime.on('swipe', function({ offsetDirection: dir }) {
    if(dir === Hammer.DIRECTION_LEFT) {
      next();
    }
    else if(dir === Hammer.DIRECTION_RIGHT) {
      prev();
    }
  });
}
