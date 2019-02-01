// TODO:: intersection observer starts to stutter
// a little bit when passing threshold in 
// the constructor
const $aboutFigure = qs('#about-section figure');
const $aboutLis = qsa('#about-section li');
const $h2 = qsa('h2');
const $furnitureImgs = qsa('#furniture-section figure');
const $interiorImgs = qsa('#interiors-section figure');

const SCROLL_DELAY = 150;

window.onload = () => {
  activeClassObserver.observe($aboutFigure);
  [].slice.call($h2).forEach($el => activeClassObserver.observe($el));
  [].slice.call($furnitureImgs).forEach($el => activeClassObserver.observe($el));
  [].slice.call($aboutLis).forEach($el => activeClassObserver.observe($el));
  [].slice.call($interiorImgs).forEach($el => activeClassObserver.observe($el));
}
const activeClassObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.intersectionRatio > 0) {
      entry.target.classList.add('is-active');
      activeClassObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.6,
});
