var items = null;

//Récuperation de tout les produits de l'API //
fetch("http://localhost:3000/api/products")
  .then(response => response.json())
  .then(data => { items = data; showResult(data) })
  .catch(err => console.log("Il y'a une erreur: " + err))


//Verifie si il y a deja qqch dans le panier//
function getBasket() {
  let basket = localStorage.getItem("basket")
  if (basket == null) {
    return []
  }
  else {
    return JSON.parse(basket)
  }
}

//affiche les caracteristiques qui correspondent aux articles dans le panier//
function showResult(data) {
  let productInfos
  let basket = getBasket()
  if (basket.length >= 1) {
    let cart__items = document.getElementById("cart__items")
    let basket = getBasket()
    for (let product of basket) {
      productInfos = data.find(obj => { return obj._id === product.id })
      cart__items.insertAdjacentHTML("afterbegin",
        `<article class="cart__item" data-id="${product.id}" data-color="${product.color}">
      <div class="cart__item__img">
        <img src="${productInfos.imageUrl}" alt="${productInfos.alt}">
      </div>
      <div class="cart__item__content">
        <div class="cart__item__content__description">
          <h2>${productInfos.name}</h2>
          <p>${product.color}</p>
          <p>${productInfos.price}€</p>
        </div>
        <div class="cart__item__content__settings">
          <div class="cart__item__content__settings__quantity">
            <p>Qté : </p>
            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
          </div>
          <div class="cart__item__content__settings__delete">
            <p class="deleteItem">Supprimer</p>
          </div>
        </div>
      </div>
    </article>`)
    }
    showBasketTotal()
  }
  else {
    cart__items.insertAdjacentHTML("afterbegin", "<h2>Votre panier est vide.</h2>")
  }
}

//Calcule le prix total des produits dans le basket du localstorage//
function showBasketTotal(){
  let total = 0
  let qtyOfProduct=0
  let productInfo
  let basketItems = getBasket()
    //boucle qui calcule le prix total
    for (let basketItem of basketItems) {
      productInfo = items.find(obj => { return obj._id === basketItem.id })
      total += productInfo.price * basketItem.quantity
    }
    //boucle qui calcule le nbr de produit total
    for (let basketItem of basketItems) {
      productInfo = items.find(obj => { return obj._id === basketItem.id })
      qtyOfProduct+=basketItem.quantity
    }
  //affiche le total (quantité puis prix) dans la page//
  document.getElementById("totalQuantity").innerHTML=qtyOfProduct 
  document.getElementById("totalPrice").innerHTML=total
}


//Fonction qui gere la modification de quantité de produit//
function changeQuantity(event) {
    let newQuantity = parseInt(event.target.value);
    if (newQuantity < 1 || newQuantity > 100) {
        alert('Vous devez entrer une quantité comprise entre 1 et 100. Si vous désirez supprimer le produit : cliquez sur "Supprimer"')
    } 
    else{
    let cartItemArticle = event.target.closest('.cart__item'); 
    let basketItems = getBasket()  
    for (let product of basketItems) {
        if (product.id == cartItemArticle.dataset.id && product.color === cartItemArticle.dataset.color){
            product.quantity = newQuantity
            localStorage.setItem('basket', JSON.stringify(basketItems))
            showBasketTotal()
            break;
        }       
    }}
}


//Fonction qui gere la suppression des produits
function deleteCartItem(event) {
    console.log("Delete event")
    let cartItemArticle = event.target.closest('.cart__item')  // recuperer l'ID du canapé concerné
    let basketItems = getBasket()   // recupere le basket du local storage   
    for (let product of basketItems) {// je boucle sur le local storage pour trouver le canap dont l'ID == celui_du_clic     
      if (product.id == cartItemArticle.dataset.id && product.color === cartItemArticle.dataset.color){
        delete product
        localStorage.removeItem(product)  // je retire du talbeau
        console.log(product)
        localStorage.setItem('basket', JSON.stringify(basketItems)) // je sauve le local storage
        // on appelle showresults (qui lui va re-appeler le total)
      break    
      }
}}


//Evenement qui précise que l'on fait la séléction des élements une fois que la page a finit de se charger//
window.addEventListener('load', function(event) {
    // Initialisation des evenements sur la page

    let quantityInputs = document.querySelectorAll(".itemQuantity")
    for (let quantityInput of quantityInputs) {
      quantityInput.addEventListener("change", changeQuantity)  
    }
    
    let deleteButtons = document.querySelectorAll(".deleteItem")
    for (let deleteButton of deleteButtons) {
        deleteButton.addEventListener('click', deleteCartItem)
    }

    form.order.addEventListener('click',submitOrder)
})


// Séléction zone de formulaire
let form = document.querySelector('.cart__order__form')


//Vérification du prenom
form.firstName.addEventListener('change', function() {validFirstName(this)})
const validFirstName = function(inputFirstName){
  let firstNameRegExp=new RegExp(/^[a-zA-Zéè -]+$/)
  let firstNameErrorMsg=document.querySelector('#firstNameErrorMsg')
  if(firstNameRegExp.test(inputFirstName.value)==false){
    firstNameErrorMsg.innerHTML='Prénom erronée'
    return false
  }
  else{
    firstNameErrorMsg.innerHTML=''
    return true
  }
}

//Vérification du nom
form.lastName.addEventListener('change', function() {validLastName(this)})
const validLastName = function(inputLastName){
  let lastNameRegExp=new RegExp(/^[a-zA-Zéè -]+$/)
  let lastNameErrorMsg=document.querySelector('#lastNameErrorMsg')
  if(lastNameRegExp.test(inputLastName.value)==false){
    lastNameErrorMsg.innerHTML='Nom erronée'
    return false
  }
  else{
    lastNameErrorMsg.innerHTML=''
    return true
  }
}

//Vérification de l'adresse
form.address.addEventListener('change', function() {validAddress(this)})
const validAddress = function(inputAddress){
  let addressRegExp=new RegExp(/^[a-zA-Z0-9éè -]+$/)
  let addressErrorMsg=document.querySelector('#addressErrorMsg')
  if(addressRegExp.test(inputAddress.value)==false){
    addressErrorMsg.innerHTML='Adresse erronée'
    return false
  }
  else{
    addressErrorMsg.innerHTML=''
    return true
  }
}

//Vérification de la ville
form.city.addEventListener('change', function() {validCity(this)})
const validCity = function(inputCity){
  let cityRegExp=new RegExp(/^[a-zA-Zéè -]+$/)
  let cityErrorMsg=document.querySelector('#cityErrorMsg')
  if(cityRegExp.test(inputCity.value)==false){
    cityErrorMsg.innerHTML='Ville erronée'
    return false
  }
  else{
    cityErrorMsg.innerHTML=''
    return true
  }
}

//Vérification du email
form.email.addEventListener('change', function() {validEmail(this)})
const validEmail = function(inputEmail){
  let emailRegExp=new RegExp( /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i)
  let emailErrorMsg=document.querySelector('#emailErrorMsg')
  if(emailRegExp.test(inputEmail.value)==false){
    emailErrorMsg.innerHTML='Adresse email erronée'
    return false
  }
  else{
    emailErrorMsg.innerHTML=''
    return true
  }
}

//fonction submitOrder
function submitOrder(){
  if (validFirstName(form.firstName)&&validLastName(form.lastName)&&validAddress(form.address)&&validCity(form.city)&&validEmail(form.email))
    {if(getBasket())  {
        let basket = JSON.parse(localStorage.getItem("basket"));
        let products = []
        for (let i = 0; i < basket.length; i++) {
            products.push(basket[i].id)
        }   
        let contact={
            firtName:form.firstName.value,
            lastName:form.lastName.value,
            address:form.address.value,
            city:form.city.value,
            email:form.email.value
          }
          console.log(contact)
          console.log(products)
        //let data={contact,products}
      
          fetch("http://localhost:3000/api/products/order",
          {method:"POST",
          headers:{"accept":"application/json",
                  "content-type":"application/json"},
          body:JSON.stringify({contact:{
                                          firtName:form.firstName.value,
                                          lastName:form.lastName.value,
                                          address:form.address.value,
                                          city:form.city.value,
                                          email:form.email.value
          },products})})
          .then((res)=>{
            window.location.href=`confirmation.html?orderId=${res.orderId}`
            //localStorage.clear()
          })
          .catch((error)=>console.log("Erreur : "+error))
        
      }
      else{
        alert("Votre panier est vide, veuillez séléctionner un produit avant de passer commande")
      }
    }
  else{
    alert("Le formulaire n'est pas rempli correctement")
  }
}
