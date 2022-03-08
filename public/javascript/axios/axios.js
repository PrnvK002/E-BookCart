
//======================= Loading screen =====================

// addLoader();

// document.addEventListener('DOMContentLoaded', function() {
//   // your code here
//   removeLoader();

// }, false);

// const axios = require('ax
// document.getElementById('product_subtotal').innerHTML =
// console.log("reaching at axios");
function changeCartCount(productId, price, count , name) {
      let Count  = Number(count);
      let currentCount = Number(
        document.getElementById(`cart_count-${productId}`).innerText
      );

      if(currentCount == 1 && Count == -1){
          deleteCartItem(productId,price,name);
      }
      else{
        currentCount += count;
        let subtotal = currentCount * Number(price);
        let total_price = Number(
          document.getElementById('total_price').innerText
        );
        document.getElementById(`cart_count-${productId}`).innerText = currentCount;
        document.getElementById(`product_subtotal-${productId}`).innerHTML = subtotal;
  
          let total = total_price + (Number(price)*Number(count));
          document.getElementById('total_price').innerHTML = total;
          // document.getElementById('shipping_total').innerHTML = total + 12;
        
        // console.log("---------------------");
            
            axios
                .post("/updateCount", {
                  productId,
                  price,
                  count,
                })
                .then((response) => {
                  if (response.data.success) {
                    console.log('success');
                    let total_count = Number(document.getElementById('cart-total-count').innerText);
                    document.getElementById('cart-total-count').innerText = (total_count + Count);
                  }
                }).catch((err) => {
                  location.reload();
                });

      }
}

function deleteCartItem(proId,price,productName) {
  
  console.log("------Reached delete-------------");
  // let state = confirm(`Are you sure about deleting ${productName} from the cart ?`);
  // let state = runDemo(`Are you sure about deleting ${productName} from the cart ?`);

  confirmThis(
    "BOOK STORE",
    `Are you sure about deleting ${productName} from the cart ?`,
    "CANCEL",
    "CONTINUE",
    function () {
      //Continue code here
      console.log("continue");
      // return "success";

    document.getElementById('item-removed-msg').style.display = "block";
    setTimeout(() => {
    document.getElementById('item-removed-msg').style.display = "none";
    },3000);
    let currentCount = Number(
      document.getElementById(`cart_count-${proId}`).innerText
    );
      document.getElementById(`product-row-${proId}`).style.display = "none";
      let total_price = Number(
        document.getElementById('total_price').innerText
      );

      console.log("Reading total price"+ total_price);

      let total = total_price - (Number(price)*Number(currentCount));
      
      console.log("Total price after calculation" + total);
      
      document.getElementById('total_price').innerHTML = total;

      let count = Number(document.getElementById('cart-total-count').innerText);
      document.getElementById('cart-total-count').innerHTML = (count - currentCount);

      if((count-currentCount) == 0){

        document.getElementById('akeeba-renderjoomla').style.display = "none";
        

      }
       
        axios
            .post('/deleteCartItem', {
                proId,price,currentCount 
              })
              .then((response) => {
               
                console.log('Item removed from cart');
              }).catch((err) => {
                location.reload();
              })



      // document.getElementById("button").innerHTML = "Continued";
      // window.open(link, "_blank");
    },
    function () {
      //Cancel code here
      // return false;

      // document.getElementById("button").innerHTML = "Cancelled";
    }
  );
  }


// add to Cart

function addToCart(proId){

  document.getElementById(`AddedToCart-${proId}`).style.display = "block";
  setTimeout(() => {
  document.getElementById(`AddedToCart-${proId}`).style.display = "none";
  },2000);
    
      axios
            .post('/add-to-cart',{
              proId
            }).then((response) => {
              console.log(response.data.success);
              if(response.data.success){
                console.log("product added to Cart");
                console.log(" reached add to cart");
                console.log(proId);
                console.log("product added to Cart");
                
                let total_count = Number(document.getElementById('cart-total-count').innerHTML);
                document.getElementById('cart-total-count').innerHTML = (total_count+1);

              }else{

                console.log(response);
                location.href = '/login'; 

              }


            }).catch((err) => {
              console.log(err);
            });  

}




/**
 * 
 * Add to Wishlist start
 *  
 */

function addCartlist(proId){

  
  document.getElementById('wishMessage').innerText = "Successfully Added To Cart";
  document.getElementById('item-removed-msg').style.display = "block";

  axios.post('/add-to-cart' , {
    proId
  })
    .then((response) => {

      if(response.data.success){

        let total_count = Number(document.getElementById('cart-total-count').innerHTML);
        document.getElementById('cart-total-count').innerHTML = (total_count+1);
        
      }


  })

}


function addWishlist(proId){

  console.log("reaching add to wishlist");
  document.getElementById(`AddedToWishlist-${proId}`).innerText = " Item added to Wishlist ";

  setTimeout(()=>{
  document.getElementById(`AddedToWishlist-${proId}`).innerText = " Item added to Cart ";
  },4000);

  document.getElementById(`AddedToCart-${proId}`).style.display = "block";

  setTimeout(() => {
  document.getElementById(`AddedToCart-${proId}`).style.display = "none";
  },2000);

  let count = Number(document.getElementById('wishlist_count').innerHTML);

  console.log(count);
  let i = count+1;

  document.getElementById('wishlist_count').innerHTML= i;

  axios.post('/add-To-wishlist',{
    proId
  }).then((response) => {

      if(response.data.success && response.data.user_status){

        console.log(" --productAdded to wishlist-- ");

      }
      else if( response.data.user_status == false ){

          let count = Number(document.getElementById('wishlist_count').innerHTML);
          dplaceOocument.getElementById('wishlist_count').innerHTML = count--;
          location.href = '/login';


      }
      else{

        console.log("else case wishlist");
        let count = Number(document.getElementById('wishlist_count').innerHTML);
        document.getElementById('wishlist_count').innerHTML = count--;
      
      }



  } )
}


function removeFromWish(proId){
  

  let block = document.getElementById('msg_block');
  block.classList.remove('alert-success');
  block.classList.add('alert-warning');
  document.getElementById('wishMessage').innerText = "successfully removed from wishlist";
  document.getElementById('item-removed-msg').style.display = "block";

  document.getElementById(`${proId}`).style.display = "none";

  axios.post('/remove-from-wishlist',{ proId }).then( ( response ) =>{

    console.log("success");

  })


}



/**
 * 
 * Add to Wishlist start
 *  
 */




// function showCart(){
  
//   let cartItems = JSON.parse(localStorage.getItem('cart'));
//   console.log(cartItems);
//   let html = " ";
//   for (i in cartItems.products) {
//     html+="<tr>";
//     html+="<td>"+`<img src = /images/products/${cartItems.products[i].image} width=50>`+"</td>";
//     html+="<td>"+ "<span class=cart-product-name>"+cartItems.products[i].productName +"</span>"+ "<br/>"+ " <span class=cart-product-unit-price>"+
//     "<span class=cart-item-title>"+"Unit Price"+ "<span class=cart-item-value>"+ cartItems.products[i].price + "</span>" +  "</span>" + "<br/>" + "</td>";
//     html+="<td style=display: flex; justify-content:space-around>" + "<div class=product-qty>" + "<button onclick=changeCartCount(`${cartItems.products[i].product_id}`,`${cartItems.products[i].price,1,user}`)>" + rows[i].age+"</td>";
//     html+="<td>"+rows[i].email+"</td>";
    
//     html+="</tr>";

// }
// html+="</table>";
// }






//Otp login 


function submitPhone(){
  let phone = String(document.getElementById('phone').value);
  if(phone.length == 10){
    // document.getElementById('error_msg').style.display = "none";
    popupView(phone);

        axios
            .post('/login_otp',{
              phone
            }).then((response) => {
              console.log(response);
            }).catch((err) => {
              console.log(err);
            });

  }else{

    document.getElementById('error_msg').style.display = "block";
    setTimeout(()=>{
    document.getElementById('error_msg').style.display = "none";
    },3000);

  }
}


function resendOtp(){
  let phone = String(document.getElementById('otp_phone').value);
  if(phone.length == 10){
    // document.getElementById('error_msg').style.display = "none";
    popupView(phone);

        axios
            .post('/resend_otp',{
              phone
            }).then((response) => {
              console.log(response);
            }).catch((err) => {
              console.log(err);
            });
  }else{
    document.getElementById('error_msg').style.display = "block";
    setTimeout(()=>{
    document.getElementById('error_msg').style.display = "none";
    },3000);
  }
}



//popup window

function popupView(p){
  var popup = document.getElementById('popup-wrapper');
  // var btn = document.getElementById("popup-btn");
  var span = document.getElementById("close");
  document.getElementById('time').value = new Date();
  document.getElementById('otp_phone').value = p;
  popup.classList.add('show');
  span.onclick = function() {
      popup.classList.remove('show');
  }
  
  // window.onclick = function(event) {
  //     if (event.target == popup) {
  //         popup.classList.remove('show');
  //     }
  // }
}


/*

*** Sign in Validation

*/




function applyCoupen(){

  let coupenCode = String(document.getElementById('discount_code').value);

  axios.post('/apply_coupen',{ coupenCode })
    .then((response) => {
        if(response.data.success){
          console.log(response);
          let discount = Number(response.data.discount);
          let total = Number(document.getElementById('total').innerHTML);
          let d = total - discount;
          console.log(discount , total , d);
          document.getElementById('total').innerHTML = total - discount;
          document.getElementById('something').innerHTML = "Successfully added Coupen"
          document.getElementById('validation-failed').style.display = "block";

        }else{

          document.getElementById('something').innerHTML = " Coupen expired or invalid coupen code";
          document.getElementById('validation-failed').style.display = "block";

        }
  })

}




 




/**
 * 
 * Cancel Order Start 
 * 
 */


function cancelOrderHistory( id , total_prize ){
  confirmThis(
    "BOOK STORE",
    `Are you sure about cancelling this order ?`,
    "CANCEL",
    "CONTINUE",
    () =>{
      let status = String(document.getElementById(`status-${id}`).innerText);
      document.getElementById(`status-${id}`).innerText = "cancelled";
      axios.post('/orders/cancel-order',{
        id , total_prize
      }).then((response) => {
        if(response.data.success){
          console.log(response);
        }else{
        document.getElementById(`status-${id}`).innerText = status;
        }

      }).catch((err) => {
        console.log(err);
      })

    } ,
    ()=> {

    })

}




function cancelOrder( id , total_prize ){
   console.log("cancel order");
  confirmThis(
    "BOOK STORE",
    `Are you sure about cancelling this order ?`,
    "CANCEL",
    "CONTINUE",
    () =>{
      document.getElementById(`orderRow-${id}`).style.display = "none";
      axios.post('/orders/cancel-order',{
        id , total_prize
      }).then((response) => {
        if(response.data.success){
          console.log(response);
        }else{
        document.getElementById(`orderRow-${id}`).style.display = "block";
        }

      }).catch((err) => {
        console.log(err);
      })

    } ,
    ()=> {

    })


}



/**
 * 
 * Cancel Order End
 * 
 */



/**
 * 
 * Place order part start
 * 
 */


 function display(type){
  if(type === "new"){
    document.getElementById('address_block').style.display = "block";
  }else{
    document.getElementById('address_block').style.display = "none";
  }
}

function placeOrder( email){

  addLoader();

  let data = {};

  if(document.getElementById('new_Address').checked) {

    data.total_amount = document.getElementById('total').innerHTML;
    data.newAddress = true;
    data.company = String(document.getElementById('companyName').value);
    data.country = String(document.getElementById('country').value);
    data.address = String(document.getElementById('address').value);
    data.pin = String(document.getElementById('pin').value);
    data.landmark = String(document.getElementById('landmark').value);
    data.town = String(document.getElementById('town').value);

    let method = document.getElementsByName('paymentMethod');
    for(i in method){
      if(method[i].checked){
        data.paymentMethod = method[i].value;
      }
    } 
    
  }else{

    data.total_amount = document.getElementById('total').innerHTML;
    data.newAddress = false;
    let address_out = document.getElementsByClassName('address');
    for(i in address_out){
      if(address_out[i].checked){
        // data= address[i].value;
        let id = address_out[i].getAttribute('data-id');
        // console.log(id);
        data._id = document.getElementById(`address_id-${id}`).value;
        data.address = document.getElementById(`address-${id}`).value;
        data.pin = document.getElementById(`pin-${id}`).value;
        data.town = document.getElementById(`town-${id}`).value;
        data.landmark = document.getElementById(`landmark-${id}`).value;
        data.country = document.getElementById(`country-${id}`).value;
        data.companyName = document.getElementById(`companyName-${id}`).value;
        data.additional_info = document.getElementById(`additional_info-${id}`).value;
        data.country = document.getElementById(`country-${id}`).value;

        // console.log(data);
      }
    }
    let method = document.getElementsByName('paymentMethod');
      for(i in method){
        if(method[i].checked){
          data.paymentMethod = method[i].value;

        }
      }  
  }

  console.log(data);
  for(i in data){
    console.log(data[i]);
  }

  axios
    .post('/orders',{ data })
    
    .then((response) => {

    console.log(response);

    if(response.data.codSuccess){

      removeLoader();
      location.href = "/orders";

    }
    else if(response.data.razorPay){

      removeLoader();
      razorpayPayment(response.data.orderData , email);


    }else if(response.data.stripePay){

      removeLoader();
      stripePayment(response.data.clientSecret , response.data.order_id);

    }
    else{

      removeLoader();

      document.getElementById('something').innerText = "Order failed ! Please try again";

      document.getElementById('validation-failed').style.display = "block";

      setTimeout(()=>{

      document.getElementById('validation-failed').style.display = "none";

      },4000);

    }
  })  


}


/**
 * 
 * Place order part end
 * 
 */



/**
 * Razor Pay veiw window
 */


function razorpayPayment(orderData , email){
  let money = orderData.amount * 100;
  var options = {
    "key": "rzp_test_whd2gtvMWQhfdJ", // Enter the Key ID generated from the Dashboard
    "amount": money, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    "currency": "INR",
    "name": "Book Cart",
    "description": "Test Transaction",
    "image": "https://example.com/your_logo",
    "order_id": `${orderData.id}`, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
    "handler": function (response){

        // alert(response.razorpay_payment_id);
        // alert(response.razorpay_order_id);
        // alert(response.razorpay_signature);


        verifyPayment( response , orderData );

    },
    "prefill": {

        "email": email,

    },
    "notes": {
        "address": "Razorpay Corporate Office"
    },
    "theme": {
        "color": "#307d2d"
    }
};

  var rzp1 = new Razorpay(options);
  rzp1.open();

  rzp1.on('payment.failed', function (response){
    
    document.getElementById('something').innerText = "Payment failed due to some issue in the bank try again later";
    document.getElementById('validation-failed').style.display = "block";
    axios.post('/PaymentFailed' , { id : orderData.receipt }).then((resp) => {

      location.reload();

    })

});

}

/**
 * 
 * stripe payment start
 * 
 */

function cancelStripe(){

  document.getElementById('stripe_window').style.display = "none";
  axios.post('/PaymentFailed' , { id }).then((resp) => {

    location.reload();

  })

}
 
var id;

//  document
//  .querySelector("#payment-form")
//  .addEventListener("submit", handleSubmit(id));


var elements;
const stripe = Stripe("pk_test_51KXfB0SFkuoDyYkYa2ygwINB9uxWPwWKFoF2F9jw2UizjF9CfQCyUU9ciTy3DqCKgCoJjZYr7JAJ4S5J4Oqgy3iV00OjigmFUU");

function stripePayment(clientSecret , order_id){
  id = order_id;
  
  document.getElementById('bckground').classList.add('back');
  document.getElementById('payment-form').style.display = "block";
  
  const appearance = {
    theme: 'stripe',
  };
  elements = stripe.elements({ appearance, clientSecret });
  const paymentElement = elements.create("payment");
  paymentElement.mount("#payment-element");

  // handleSubmit();
  checkStatus();

}


async function handleSubmit() {

  setLoading(true);

  // console.log(id);
  const { error } = await stripe.confirmPayment({
    elements,
    confirmParams: {
      // Make sure to change this to your payment completion page
      return_url: `http://localhost:5000/stripeSuccess/${id}`,
    },
  });

  // This point will only be reached if there is an immediate error when
  // confirming the payment. Otherwise, your customer will be redirected to
  // your `return_url`. For some payment methods like iDEAL, your customer will
  // be redirected to an intermediate site first to authorize the payment, then
  // redirected to the `return_url`.
  if (error.type === "card_error" || error.type === "validation_error") {

    showMessage(error.message);
    axios.post('/PaymentFailed' , { id }).then((resp) => {

      location.reload();

    })

  } else {

    showMessage("An unexpected error occured.");
    axios.post('/PaymentFailed' , { id }).then((resp) => {

      location.reload();

    })

  }

  setLoading(false);
}

// Fetches the payment intent status after payment submission
async function checkStatus() {
  const clientSecret = new URLSearchParams(window.location.search).get(
    "payment_intent_client_secret"
  );

  if (!clientSecret) {
    return;
  }

  const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);

  switch (paymentIntent.status) {
    case "succeeded":
      showMessage("Payment succeeded!");
      break;
    case "processing":
      showMessage("Your payment is processing.");
      break;
    case "requires_payment_method":
      showMessage("Your payment was not successful, please try again.");
      break;
    default:
      showMessage("Something went wrong.");
      break;
  }
}



// ------- UI helpers -------

function showMessage(messageText) {
  const messageContainer = document.querySelector("#payment-message");

  messageContainer.classList.remove("hidden");
  messageContainer.textContent = messageText;

  setTimeout(function () {
    messageContainer.classList.add("hidden");
    messageText.textContent = "";
  }, 4000);
}

// Show a spinner on payment submission
function setLoading(isLoading) {
  if (isLoading) {
    // Disable the button and show a spinner
    document.querySelector("#submit").disabled = true;
    document.querySelector("#spinner").classList.remove("hidden");
    document.querySelector("#button-text").classList.add("hidden");

  } else {

    document.querySelector("#submit").disabled = false;
    document.querySelector("#spinner").classList.add("hidden");
    document.querySelector("#button-text").classList.remove("hidden");

  }
}


/**
 * 
 * stripe payment end
 * 
 */


function verifyPayment( payment , order ){
  console.log("verifying");
  axios.post('/verify-order',{
    payment , order
  }).then((response) => {
    if(response.data.success){
      location.href = "/orders";
    }
    else{
      document.getElementById('something').innerText = "Order failed ! Please try again";
      document.getElementById('validation failed').style.display = "block";
      setTimeout(()=>{
      document.getElementById('validation failed').style.display = "none";
      },4000);
    }
  })
}




/**
 * 
 * Delete Address Start
 * 
 */

function deleteAddress(id){

  confirmThis(
    "BOOK STORE",
    `Are you sure about deleting this address ?`,
    "CANCEL",
    "CONTINUE",
    () =>{

      document.getElementById(`address_row-${id}`).style.display = "none";

      axios.post('/delete-address',{ id }).then((response) => {
        console.log(success);
      })

    } ,
    ()=> {

    })


}


/**
 * 
 * Delete Address End
 * 
 */

/**
 * 
 *  Order filter
 * 
 */


function filterOrders(){

  let filter = document.getElementById('filter');
  let order = filter.getAttribute('data-id');
  if(order == "Ascending"){

    filter.setAttribute('data-id','Descending');
    location.href = "/filterOrders/descending";
  
  }
  else{

    filter.setAttribute('data-id','Ascending');
    location.href = "/filterOrders/ascending";

  }


}



/**
 * 
 * Order filter end
 * 
 */

/**
 * 
 * Loading screen functions
 * 
 */


 function addLoader() {
  let load = document.getElementById("loading");

  load.classList.add("loader");
  let back = document.getElementById('bckground');
  back.classList.add('blur');
}

function removeLoader() {
  let load = document.getElementById("loading");
  load.classList.remove("loader");
  let back = document.getElementById('bckground');
  back.classList.remove('blur');
}

/**
 * 
 * Loading screen functions end
 * 
 */