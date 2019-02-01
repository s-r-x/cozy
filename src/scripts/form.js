const $form = qs('#contacts-section form');
const $name = $form.querySelector('#contact-name');
const $email = $form.querySelector('#contact-email');
const $message = $form.querySelector('#contact-message');

const DELAY = 1000;



function submitHandler(e) {
  e.preventDefault();
  setTimeout(() => {
    alert('Отправлено');
  }, DELAY); 
}
function focusHandler({ target }) {
  target.parentNode.classList.add('focused');
}
function blurHandler({ target }) {
  target.parentNode.classList.remove('focused');
}
$form.onsubmit = submitHandler;
[$name, $email, $message].forEach($input => {
  $input.onfocus = focusHandler;
  $input.onblur = blurHandler;
});
