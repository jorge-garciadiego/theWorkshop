
const navButton = document.querySelector('button[aria-expanded]');


navButton.addEventListener('click', toogleNav);

const openMenu = document.querySelector('#toMenu');


function toogleNav({target}){
   const expanded = target.getAttribute('aria-expanded') === 'true' || false;
   navButton.setAttribute('aria-expanded', !expanded);

   console.log(expanded);

}