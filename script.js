document.addEventListener("DOMContentLoaded", () => {
    let iconcart = document.querySelector(".nav-profile-cart");
    let cart = document.querySelector(".cart-container");
    let close = document.querySelector(".close");
    let listproducthtml = document.querySelector(".listproduct");
    let listcarthtml = document.querySelector(".listcart");
    let iconcartcount = document.querySelector(".cartcount");
    let menubarSearch = document.querySelector(".menubar-search");
    let searchButton = document.querySelector(".searchbtn");
  
    let listproduct = [];
    let cartlist = [];
  
    iconcart.addEventListener("click", () => {
      cart.style.visibility = "visible";
    });
  
    close.addEventListener("click", () => {
      cart.style.visibility = "hidden";
    });
  
    const addDatatoHTML = (products) => {
      listproducthtml.innerHTML = "";
      if (products.length > 0) {
        products.forEach((product) => {
          let newproduct = document.createElement("div");
          newproduct.classList.add("item");
          newproduct.dataset.id = product.id;
          newproduct.innerHTML = `<img src="${product.image}" alt="" />
                  <h2>${product.name}</h2>
                  <div class="price">THB ${product.price}</div>
                  <button class="addCart">Add To Cart</button>
                  `;
          listproducthtml.appendChild(newproduct);
        });
      }
    };
  
    listproducthtml.addEventListener("click", (event) => {
      let positionclick = event.target;
      if (positionclick.classList.contains("addCart")) {
        let product_id = positionclick.parentElement.dataset.id;
        addtocart(product_id);
      }
    });
  
    const addtocart = (product_id) => {
      let positionthisproductincart = cartlist.findIndex(
        (value) => value.product_id == product_id
      );
      if (cartlist.length <= 0) {
        cartlist = [
          {
            product_id: product_id,
            quantity: 1,
          },
        ];
      } else if (positionthisproductincart < 0) {
        cartlist.push({
          product_id: product_id,
          quantity: 1,
        });
      } else {
        cartlist[positionthisproductincart].quantity += 1;
      }
      addcarttohtml();
      addcarttomemory();
    };
  
    const removefromcart = (product_id) => {
      let positionthisproductincart = cartlist.findIndex(
        (value) => value.product_id == product_id
      );
      if (positionthisproductincart >= 0) {
        if (cartlist[positionthisproductincart].quantity > 1) {
          cartlist[positionthisproductincart].quantity -= 1;
        } else {
          cartlist.splice(positionthisproductincart, 1);
        }
        addcarttohtml();
        addcarttomemory();
      }
    };
  
    const addcarttomemory = () => {
      localStorage.setItem("cart", JSON.stringify(cartlist));
    };
  
    const addcarttohtml = () => {
      listcarthtml.innerHTML = "";
      let totalquantity = 0;
      let totalprice = 0;
  
      if (cartlist.length > 0) {
        cartlist.forEach((cart) => {
          totalquantity += cart.quantity;
          let newcart = document.createElement("div");
          newcart.classList.add("item");
          let positionproduct = listproduct.findIndex(
            (value) => value.id == cart.product_id
          );
          let info = listproduct[positionproduct];
          let itemprice = info.price * cart.quantity;
          totalprice += itemprice;
  
          newcart.innerHTML = `
                  <div class="cartimg">
                      <img src="${info.image}" alt="">
                  </div>
                  <div class="itemcart-detail">
                      <div class="itemname">${info.name}</div>
                      <div class="itemprice">THB ${itemprice}</div>
                  </div>
                  <div class="itemquantity">
                      <button class="minus" data-productid="${cart.product_id}">-</button>
                      <span class="itemvalue">${cart.quantity}</span>
                      <button class="plus" data-productid="${cart.product_id}">+</button>
                  </div>
                </div>
                  `;
          listcarthtml.appendChild(newcart);
        });
      }
      iconcartcount.innerHTML = totalquantity;
  
      let totalSection = document.createElement("div");
      totalSection.classList.add("total-section");
      totalSection.innerHTML = `
              <div class="total-label">Total:</div>
              <div class="total-price">THB ${totalprice}</div>
          `;
      listcarthtml.appendChild(totalSection);
  
      document.querySelectorAll(".plus").forEach((button) => {
        button.addEventListener("click", () => {
          const productId = button.dataset.productid;
          addtocart(productId);
        });
      });
  
      document.querySelectorAll(".minus").forEach((button) => {
        button.addEventListener("click", () => {
          const productId = button.dataset.productid;
          removefromcart(productId);
        });
      });
    };
  
    const initApp = () => {
      fetch("product.json")
        .then((response) => response.json())
        .then((data) => {
          listproduct = data;
          addDatatoHTML(listproduct);
  
          if (localStorage.getItem("cart")) {
            cartlist = JSON.parse(localStorage.getItem("cart"));
            addcarttohtml();
          }
        });
    };
  
    searchButton.addEventListener("click", () => {
      const searchTerm = menubarSearch.value.toLowerCase();
      const filteredProducts = listproduct.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm)
      );
  
      addDatatoHTML(filteredProducts);
    });
  
    initApp();
  });