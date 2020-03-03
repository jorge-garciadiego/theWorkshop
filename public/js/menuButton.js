
const navButton = document.querySelector('button[aria-expanded]');

function toogleNav({target}){
   const expanded = target.getAttribute('aria-expanded') === 'true' || false;
   navButton.setAttribute('aria-expanded', !expanded);

   console.log(expanded);

}

navButton.addEventListener('click', toogleNav);

const openMenu = document.querySelector('#toMenu');

openMenu.addEventListener('click', toogleNav);