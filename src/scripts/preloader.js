const windowLoad = new Promise( r => window.addEventListener('load', r));
const assetsLoad = new Promise(r => __ee__.on('load', r));


Promise.all([ windowLoad, assetsLoad ])
  .then(() => {
    const $el = qs('.preloader');
    $el.style.opacity = 0;
    setTimeout(() => $el.style.display = 'none', 300);
  });
