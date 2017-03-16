var products = [
  {
    "name": "Reversible Plaid",
    "price": 26.99,
    "description": "Two classic patterns in one great look: This supersoft and cozy reversible scarf instantly doubles your street-style cred. 100% acrylic.",
    "imageTitle": "reversible-plaid.jpg"
  },
  {
    "name": "Wool Cable Knit",
    "price": 49.99,
    "description": "Warm yourself with this women's natural cable knit scarf, crafted from 100% Merino wool. Imported.",
    "imageTitle": "wool-cable.jpeg"
  },
  {
    "name": "Northern Lights",
    "price": 29.99,
    "description": "Handmade by women in Agra, sales provide medical and educational support in this remote area of India. Crinkly 100% cotton.",
    "imageTitle": "northern-lights.jpg"
  },
  {
    "name": "Ombre Infinity",
    "price": 11.99,
    "description": "A dip-dye effect adds color and dimension to a cozy infinity scarf featuring a soft, chunky knit. 100% acrylic.",
    "imageTitle": "ombre-infinity.jpg"
  },
  {
    "name": "Fringed Plaid",
    "price": 18.99,
    "description": "Generously sized, extra soft and featuring a dazzling fringe, this scarf is rendered in a versatile gray, black and white plaid. Expertly beat the cold with style. 100% acrylic.",
    "imageTitle": "fringed-plaid.jpeg"
  },
  {
    "name": "Multi Color",
    "price": 22.99,
    "description": "The Who What Wear Oversize Color-Block Square Scarf is big, bold, and designed to twist and wrap any way you wish. All the colors of the season are harmonized in this oversize accent, so you can adjust to contrast or match your outfit; soft and lush, it’s your stylish standoff against cold AC and unexpected fall breezes. 100% acrylic",
    "imageTitle": "multi-color.jpeg"
  },
  {
    "name": "Etro Paisley-Print Silk",
    "price": 249.99,
    "description": "Luxurious silk scarf with subtle paisley pattern. 100% silk",
    "imageTitle": "etro.jpg"
  },
  {
    "name": "Ashby Twill",
    "price": 70.99,
    "description": "Faribault brings you the Ashby Twill Scarf in Natural. Woven with a 'broken' twill technique, the Ashby Twill Scarf has a slight zigzag texture. Made in USA, this timeless scarf is crafted with luxurious merino wool and finished with heather gray fringe. 100% Merino wool",
    "imageTitle": "twill.jpg"
  }
]

// Event handler function, triggered on form submit.
function sort(){
  console.log(document.sortForm.filter.value);
  event.preventDefault();
}

// This is the syntax for looping through arrays that we learned in class 1. We'll use it to loop through the products array.
for(var i = 0; i<products.length; i++){
  // "i" here is a temporary variable that refers to the index of the object we're currently on while looping through the array.

  // We reference the element of the array that we're on using brackets
  // notation with the counter/i variable. That element is an object,
  // so we can refer to it's attributes using dot notation.
  console.log(products[i].name);
  console.log(products[i].description);
  console.log(products[i].price);
}

// Cart Stuff

// contains array of CartLine instances that represent items in the user's cart
var cart;

// load the cart information from localstorage
function loadCart()
{
  if (!Modernizr.localstorage) {
    return;
  }

  var cartStorage = localStorage["cart"];

  if (cartStorage) {
    cart = JSON.parse(cartStorage);
  } else {
    cart = [];
  }

  updateCartIcon();
}

// save the cart information to localstorage
function saveCart()
{
  if (!Modernizr.localstorage) {
    return;
  }

  if (cart.length == 0) {
    localStorage.removeItem("cart")
  } else {
    localStorage["cart"] = JSON.stringify(cart);
  }
}

// update the cart icon
function updateCartIcon()
{
  var itemsInCart = 0;
  var cartIcon = document.getElementById("cartIcon");

  for (cartline of cart) {
    itemsInCart += cartline.number;
  }

  if (itemsInCart == 0) {
    cartIcon.innerHTML = "";
  } else {
    cartIcon.innerHTML = " (" + itemsInCart.toString() + ")";
  }
}

// constructor
function CartLine(productNameVal, numberVal) {
  this.productName = productNameVal;
  this.number = numberVal;
}

// 'Add' button for indivdual product <div class="item">
function onClickAdd(productName) {
  var prod = products.find(function(product) {return product.name == this}, productName);
  var cartline = cart.findIndex(function(cartline) {
      return cartline.productName == this;
    }, productName);
  if (cartline == -1) {
    var newcartline = new CartLine(productName, 1);
    cart.push(newcartline);
  } else {
    cart[cartline].number++;
  }

  hideCart();
  saveCart();
  updateCartIcon();
}

// empty the cart of items and update
function emptyCart() {
  cart = [];
  updateCartIcon();
}

// hide the Cart element
function hideCart() {
  var cartDiv = document.getElementById("cart");
  cartDiv.style.visibility="hidden";
}

// create DOM for individual cart-item
function createCartItem(cartline, prod) {
  var newCartLineElem = document.createElement("tr");
  var newData;
  var newButton;

  newData = document.createElement("td");
  newData.innerHTML = cartline.productName;
  newCartLineElem.appendChild(newData);
  newData = document.createElement("td");
  newData.innerHTML = cartline.number;
  newCartLineElem.appendChild(newData);
  newData = document.createElement("td");
  newData.innerHTML = "$";
  newCartLineElem.appendChild(newData);
  newData = document.createElement("td");
  newData.innerHTML = prod.price.toFixed(2);
  newData.setAttribute("class", "currencyAmount");
  newCartLineElem.appendChild(newData);
  newData = document.createElement("td");
  newButton = document.createElement("button");
  newButton.innerHTML = "Remove";
  newButton.setAttribute("onclick", "onClickRemove('" + cartline.productName + "')");
  newData.appendChild(newButton);
  newCartLineElem.appendChild(newData);

  return newCartLineElem;
}

// Update cart items
function updateCartItems() {
  var cartItems = document.getElementById("cartItems");
  cartItems.innerHTML = ""
  if (cart.length == 0) {
    cartItems.innerHTML= "Cart is empty";
  } else {
    var cartTotal = 0;

    var cartItemsTable = document.createElement("table");
    var newTBody = document.createElement("tbody");
    cartItems.appendChild(cartItemsTable);
    cartItemsTable.appendChild(newTBody)
    for (cartline of cart) {
      var prod = products.find(function(product) {return product.name == this}, cartline.productName);
      newTBody.appendChild(createCartItem(cartline, prod));
      cartTotal += cartline.number * prod.price;
    }

    var newData;
    var newTFoot;
    var newTableRow;
    newTFoot = document.createElement("tfoot")
    newTableRow = document.createElement("tr");
    newTableRow.setAttribute("class", "totalRow");
    newData = document.createElement("td");
    newData.innerHTML = "Total";
    newTableRow.appendChild(newData);
    newData = document.createElement("td");
    newTableRow.appendChild(newData);
    newData = document.createElement("td");
    newData.innerHTML = "$";
    newTableRow.appendChild(newData);
    newData = document.createElement("td");
    newData.innerHTML = cartTotal.toFixed(2);
    newData.setAttribute("class", "currencyAmount");
    newTableRow.appendChild(newData);
    newData = document.createElement("td");
    newTableRow.appendChild(newData);
    newTFoot.appendChild(newTableRow);
    cartItemsTable.appendChild(newTFoot);
  }
}

// update Cart element (id="cart")
function updateCart() {
  var cartEmpty = document.getElementById("cart-empty");
  var cartCheckout = document.getElementById("cart-checkout");

  updateCartItems();
  if (cart.length == 0) {
    cartEmpty.style.visibility="hidden";
    cartCheckout.style.visibility="hidden";
  } else {
    cartEmpty.style.visibility="inherit";
    cartCheckout.style.visibility="inherit";
  }
}

// make 'Cart' element visible
function showCart()
{
  var cartDiv = document.getElementById("cart");
  cartDiv.style.visibility="visible";
  updateCart();

  event.preventDefault();
}

// Cart lineitem's 'Remove' button
function onClickRemove(productName) {
  var cartline = cart.findIndex(function(cartline) {
      return cartline.productName == this;
    }, productName);
  if (cartline != -1) {
    cart[cartline].number--;
    if (cart[cartline].number == 0) {
      cart.splice(cartline, 1);
    }
  }

  updateCart();
  updateCartIcon();
  saveCart();
  event.preventDefault();
}

// Cart's 'Hide' button
function onClickHide() {
  hideCart();
  event.preventDefault();
}

// Cart's 'Empty' button
function onClickEmpty() {
  emptyCart();
  hideCart();
  saveCart();
  event.preventDefault();
}

// Cart's 'Checkout' button
function onClickCheckout() {
  alert("Checkout is not yet implemented");
}

function windowOnLoad() {
  if (typeof updateProductList != 'undefined') {
    updateProductList();
  }
  if (typeof fillFilterBy != 'undefined') {
    fillFilterBy();
  }

  loadCart();
}

window.onload = windowOnLoad;




// products in products.js script

function printProduct(product) {
  console.log(product.name + ", " + product.description + ", " + product.price);
}

function printAllProducts() {
  for (var i = 0; i < products.length; i++) {
    printProduct(products[i]);
  }
}

// create list of <option> tags from optionList data, and append to 'selectElem'
function createOptions(selectElem, optionList) {
  var optionElem;
  var optionItem;

  // option 'All'
  optionElem = document.createElement("option");
  optionElem.setAttribute("value", "");
  optionElem.innerHTML = "All";
  selectElem.appendChild(optionElem);

  for (optionItem of optionList) {
    optionElem = document.createElement("option");
    optionElem.setAttribute("value", optionItem.optionValue);
    optionElem.innerHTML = optionItem.optionText;
    selectElem.appendChild(optionElem);
  }
}

// populate the <select> element with the appropiate <option>s
function fillFilterBy() {
   if (typeof pageProductType != 'undefined') {
    if (pageProductType.length != 0) {
      var selectElement = document.getElementById("filterBy");
      switch(pageProductType) {
        case 'Gloves':
          createOptions(selectElement, filterGloves);
          break;
        case 'Hats':
          createOptions(selectElement, filterHats);
          break;
        case 'Scarves':
          createOptions(selectElement, filterScarves);
          break;
        default:
          // do nothing
          break;
      }
    }
  }
}

// comparison function used for sorting by name
function compareByName(prod1, prod2)
{
  if (prod1.name.toLowerCase() < prod2.name.toLowerCase())
    return -1;
  else if (prod1.name.toLowerCase() > prod2.name.toLowerCase())
    return 1;
  else
    return 0;
}

// comparison function used for sorting by price
function compareByPrice(prod1, prod2)
{
  return prod1.price - prod2.price;
}

// create anew item <img> for an individual product
function createItemImg(product) {
  var newImg;
  
  newImg = document.createElement("img");
  newImg.setAttribute("src", "images/" + product.imageTitle);
  newImg.setAttribute("alt", product.name);
  if (product.imageSizes) {
    if (product.imageSizes.length > 0) {
      newImg.setAttribute("sizes", product.imageSizes);
      newImg.setAttribute("srcset", product.imageSet)
    }
  }
  
  return newImg;
}

// create a new item <figure> for an individual product
function createItemFigure(product)
{
  var newFigure;
  var newImg;
  var newFigCaption;

  newFigure = document.createElement("figure");

  newImg = createItemImg(product);
  newFigure.appendChild(newImg);

  newFigCaption = document.createElement("figcaption");
  newFigCaption.innerHTML = product.name;
  newFigure.appendChild(newFigCaption);

  return newFigure;
}

// create a new item <div> for an individual product
function createItemProduct(product)
{
  var newItem;
  var newElm;

  newItem = document.createElement("div");
  newItem.setAttribute("class", "item")

  newElm = createItemFigure(product);
  newItem.appendChild(newElm);

  newElm = document.createElement("p");
  newElm.setAttribute("class", "item-description");
  newElm.innerHTML = product.description;
  newItem.appendChild(newElm);

  newElm = document.createElement("p");
  newElm.setAttribute("class", "item-price");
  newElm.innerHTML = "$" + product.price.toFixed(2);
  newItem.appendChild(newElm);

  newElm = document.createElement("button");
  newElm.setAttribute("onclick", "onClickAdd('" + product.name + "')");
  newElm.innerHTML = "Add to Cart";
  newItem.appendChild(newElm);

  return newItem;
}

// update <div id="items"> from productList array
function updateItemContainer(productList)
{
  var container = document.getElementById("items");

  container.innerHTML = "";

  if (productList.length == 0) {
    container.innerHTML = "No items matching filter.";
  } else {
    for (product of productList) {
      container.appendChild(createItemProduct(product));
    }
  }
}

// create products list as specified by category filter and sorting requirement
function createProductList(itemSort, itemFilter) {
  var productList;
  var productListType;

  // filter the products based on type, pageProductType defined in HTML <script> element
  productListType = products;
  if (typeof pageProductType != 'undefined') {
    if (pageProductType.length != 0) {
      productListType = products.filter(function(product) {
        return product.productType == pageProductType;
      });
    }
  }

  // filter the products based on category
  if (itemFilter.length == 0) {
    productList = productListType;
  } else {
    productList = productListType.filter(function(product) {
        return product.category == itemFilter;
      });
  }

  // sort the products based on sorting specified by itemSort
  switch (itemSort) {
    case 'price':
      productList = productList.sort(compareByPrice);
      break;
    case 'name':
      productList = productList.sort(compareByName);
      break;
    default:
      // do nothing
      break;
  }

  return productList;
}

// update the list of products
function updateProductList()
{
  var itemSort = '';
  var itemFilter = '';

  if (typeof document.filterForm != 'undefined') {
    itemSort = document.filterForm.sortBy.value;
    itemFilter = document.filterForm.filterBy.value;
  }

  // pageProduct
  var prodList = createProductList(itemSort, itemFilter);

  updateItemContainer(prodList);
}

// filter form's submit ("Update") button
function captureFilter() {
  updateProductList();
  event.preventDefault();
}






