const menu = document.querySelector('#toMenu');
const signUP = document.querySelector('#toSignUP');
const login = document.querySelector('#toLogin');
const products = document.querySelector('#toProducts');
const contact =document.querySelector('#toContact');


menu.addEventListener('mouseover', ()=>{
   const word = JSON.parse(document.querySelector('#toMenu').getAttribute('data'));
   document.querySelector('.txt-type').innerHTML = `${word}`;
})

menu.addEventListener('mouseout', ()=>{
   document.querySelector('.txt-type').innerHTML = '';
})

signUP.addEventListener('mouseover', ()=>{
   const word = JSON.parse(document.querySelector('#toSignUP').getAttribute('data'));

   document.querySelector('.txt-type').innerHTML = `${word}`;
})

signUP.addEventListener('mouseout',()=> {
   document.querySelector('.txt-type').innerHTML = '';
})

login.addEventListener('mouseover', ()=>{
   const word = JSON.parse(document.querySelector('#toLogin').getAttribute('data'));

   document.querySelector('.txt-type').innerHTML = `${word}`;
})

login.addEventListener('mouseout',()=> {
   document.querySelector('.txt-type').innerHTML = '';
})

products.addEventListener('mouseover', ()=>{
   const word = JSON.parse(document.querySelector('#toProducts').getAttribute('data'));

   document.querySelector('.txt-type').innerHTML = `${word}`;
})

products.addEventListener('mouseout',()=> {
   document.querySelector('.txt-type').innerHTML = '';
})

contact.addEventListener('mouseover', ()=>{
   const word = JSON.parse(document.querySelector('#toContact').getAttribute('data'));

   document.querySelector('.txt-type').innerHTML = `${word}`;
})

contact.addEventListener('mouseout',()=> {
   document.querySelector('.txt-type').innerHTML = '';
})

