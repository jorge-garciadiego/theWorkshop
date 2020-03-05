/*
// Contstructor Method

const typeWriter = function(txtElement, words, wait = 3000) {
   this.txtElement = txtElement;
   this.words = words;
   this.txt = ''; // Represents whatever is currently in the text area
   this.wordIndex = 0;
   this.wait = parseInt(wait, 10);
   this.type();
   this.isDeleting = false;
}

//Type Method
typeWriter.prototype.type = function(){
   
   //Current index of word
   const current = this.wordIndex % this.words.length;

   //Get full text of current word
   const fullTxt = this.words[current];

   //Check if deleting 
   if(this.isDeleting){
      //Remove a character
      this.txt = fullTxt.substring(0, this.txt.length -1);
   }else{
      //Add a character
      this.txt = fullTxt.substring(0, this.txt.length +1);
   }

   //Insert txt to element
   this.txtElement.innerHTML = `<span class="txt">${this.txt}</span>`

   //Type speed
   let typeSpeed = 300;

   if (this.isDeleting) {
      typeSpeed /= 2;
   }

   // If word is complete

   if (!this.isDeleting && this.txt === fullTxt) {
      //This make a pause at the end
      typeSpeed = this.wait;
      //Set isDeleting to true
      this.isDeleting = true;
   } else if(this.isDeleting && this.txt === ''){
      this.isDeleting = false;
      //Move to the next word
      this.wordIndex++;
      //Pause before start typing
      typeSpeed = 500;
   }

   setTimeout(()=> this.type(), typeSpeed);
}

//Init when DOM load
document.addEventListener('DOMContentLoaded', init);

//init the app

function init(){
   const txtElement = document.querySelector('.txt-type');
   const words = JSON.parse(txtElement.getAttribute('data-words'));
   const wait = txtElement.getAttribute('data-wait');

   //Initialize the Type writer

   new typeWriter(txtElement, words, wait);
}

*/

class TypeWriter{
   constructor(txtElement, words, wait = 3000){
      this.txtElement = txtElement;
      this.words = words;
      this.txt = '';
      this.wordIndex = 0;
      this.wait = parseInt(wait, 10);
      this.type();
      this.isDeleting = false;
   }

   type(){
      //Current index of word
   const current = this.wordIndex % this.words.length;

   console.log(this.current);

   //Get full text of current word
   const fullTxt = this.words[current];
   console.log(this.words[current]);

   // Check if deleting
   if(this.isDeleting) {
      // Remove char
      this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
      // Add char
      this.txt = fullTxt.substring(0, this.txt.length + 1);
    }
    
   //Insert txt to element
   this.txtElement.innerHTML = `<span class="welcomeTxt">${this.txt}</span>`;
    
   //Type speed
   let typeSpeed = 300;

   if (this.isDeleting) {
      typeSpeed /= 2;
   }

   // If word is complete

   if (!this.isDeleting && this.txt === fullTxt) {
      //This make a pause at the end
      typeSpeed = this.wait;
      //Set isDeleting to true
      this.isDeleting = true;
   } else if(this.isDeleting && this.txt === ''){
      this.isDeleting = false;
      //Move to the next word
      this.wordIndex++;
      //Pause before start typing
      typeSpeed = 500;
   }

   setTimeout(()=> this.type(), typeSpeed);
   }
}

//Init when DOM load
document.addEventListener('DOMContentLoaded', init);

//init the app

function init(){
   const txtElement = document.querySelector('.welcome-type');
   const words = JSON.parse(txtElement.getAttribute('data-words'));
   const wait = txtElement.getAttribute('data-wait');

   //Initialize the Type writer

   new TypeWriter(txtElement, words, wait);
}
