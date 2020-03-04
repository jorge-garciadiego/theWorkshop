 
const products=
{
    fakeDB:[],

    categories: [],

    init()
    {

         this.fakeDB.push({title:'Canasta', description:`Hand made bascket`, artist: "Pajarito Tejedor" , cat: 'Decor',price:`25.99`, bestSeller: 0, img: "./img/products/canasta_01.png"});

         this.fakeDB.push({title:'Canasta set', description:`Hand made bascket set`, artist: "Pajarito Tejedor" , cat: 'Decor',price:`40.99`, bestSeller: 1, img: "./img/products/set_canasta_01.png"});

         this.fakeDB.push({title:'Flower Round Frame', description:`Hand made hang round frame`, artist: "Pajarito Tejedor" , cat: 'Decor',price:`14.99`, bestSeller: 1, img: "./img/products/wall_01.png"});

         this.fakeDB.push({title:'Key Chain', description:`Hand made colourfull key chain`, artist: "Pajarito Tejedor" , cat: 'Accesories',price:`9.99`, bestSeller: 0, img: "./img/products/keychain.png"});

         this.fakeDB.push({title:'Scarf', description:`Man scarf`, artist: "Pajarito Tejedor" , cat: 'Accesories',price:`29.99`, bestSeller: 1, img: "./img/products/scarf.png"});
        
         this.fakeDB.push({title:'Cleaning Set', description:`Bascket with the bestt cleaning selection`, artist: "Verde Urbano" , cat: 'Home',price:`19.99`, bestSeller: 0, img: "./img/products/cleaningSet.png"});

         this.fakeDB.push({title:'Tea Set', description:`Beautiful ceramic tea set`, artist: "Verde Urbano" , cat: 'Home',price:`35.50`, bestSeller: 1, img: "./img/products/teaSet.png"});

         this.fakeDB.push({title:'Flower Pot', description:`Ceramic flower pot`, artist: "Atelier Armand" , cat: 'Home',price:`25.50`, bestSeller: 0, img: "./img/products/flowerPot.png"});

        
         // this is the simulation of a Categories table in the database
         this.categories.push({title: 'Accesories', description: 'Amazing crafted articles', colour: "background:#CFFFF1"});

         this.categories.push({title: 'Boutique', description: 'Incredible clothes for you', colour: "background:#BDD8E8"});

         this.categories.push({title: 'Decor', description: 'Ideas to improve your house', colour: "background:#DDDCFF"});

         this.categories.push({title: 'Home', description: 'Beautiful creations that make your life easy', colour: "background:#DDC4E8"});

    },

    getAllProducts()
    {
       //console.log(`Listed all the products holded in fakeDB`);
        //console.log(this.fakeDB);
        return this.fakeDB;
    },

    getBestSellers(){
        let bestSellers = [];

        for (let i =0; i < this.fakeDB.length; i++){
            if(this.fakeDB[i].bestSeller == 1){
                bestSellers.push(this.fakeDB[i]);
            }
        }

        //console.log(`Here the best seller products mined from fakeDB`);
        //console.log(bestSellers);

        return bestSellers;
    },

    getCategories(){

        //console.log(`These are the categories for now:`)
        //console.log(this.categories);

        return this.categories;
        
    }

}

products.init();
module.exports=products;

