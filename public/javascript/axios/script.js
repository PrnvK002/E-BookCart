window.addEventListener("load", function () {

  let images_to_zoom = document.querySelectorAll(".image-hover-zoom img");
  for (let item of images_to_zoom) {
    item.parentElement.style.height = item.height + "px";
    item.parentElement.style.width = item.width + "px";
    item.parentElement.style.overflow = "hidden";
    item.addEventListener("mousemove", (e) =>
  
    zoom_element(
        e,
        item.parentElement.offsetLeft,
        item.parentElement.offsetTop,
        item.parentElement.offsetWidth,
        item.parentElement.offsetHeight
      )
    );
    
    item.addEventListener("mouseenter", function (e) {
      let item = e.currentTarget;
      let scale = item.parentElement.getAttribute("scale");
      e.currentTarget.style.transform = scale
        ? "scale(" + scale + ")"
        : "scale(2)";
    });
    item.addEventListener("mouseleave", function (e) {
      e.currentTarget.style.transform = "none";
    });
  }
});
function zoom_element(e, start_x, start_y, width, height) {
  let p_x = ((e.clientX - start_x) * 100) / width;
  let p_y = ((e.clientY - start_y) * 100) / height;
  e.currentTarget.style.transformOrigin = p_x + "% " + p_y + "%";
}


/**
 * 
 * login validator start
 * 
 */



function loginValidation() {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  if (validateEmail(email) && password.length > 5) {
    return true;
  } else {
    document.getElementById("error-block").style.display = "block";
    document.getElementById("error-msg").innerText =
      "Check the credentials and try again";
    return false;
  }
}



/**
 * 
 * login validator end
 * 
 */


/**
 * 
 * signup validator start
 * 
 */


 function signInValidation(){

  let name = String(document.getElementById('name').value);
  let email = String(document.getElementById('email').value);
  let password = String(document.getElementById('password').value);
  let confirm_password = String(document.getElementById('confirm_password').value);
  let phone = String(document.getElementById('phone').value);

  console.log(name , email , password , confirm_password , phone);

  if(name.length > 1 ){
    if( validateEmail(email)){
      if(phone.length == 10){
        if ( password.length > 6 && confirm_password > 6) {
          if(confirm_password === password ){
            return true;
          }else{
            document.getElementById('error-block').style.display = "block";
            document.getElementById('err-msg').innerText = "Password and confirm password must be equal";

            setTimeout(()=>{
              document.getElementById('error-block').style.display = "none";
            },3000);

            return false;
          }
  
        }else{
            document.getElementById('error-block').style.display = "block";
            document.getElementById('err-msg').innerText = "Password must contain atleast 7 characters";

            setTimeout(()=>{
              document.getElementById('error-block').style.display = "none";
            },3000);

            return false;
        }
      }else{
            document.getElementById('error-block').style.display = "block";

            document.getElementById('err-msg').innerText = "Phone must contain 10 digits";

            setTimeout(()=>{
              document.getElementById('error-block').style.display = "none";
            },3000);

            return false;
      }
    }else{
            document.getElementById('error-block').style.display = "block";
            document.getElementById('err-msg').innerText = "Enter a valid email ";
            
            setTimeout(()=>{
              document.getElementById('error-block').style.display = "none";
            },3000);
            
            return false;
    }

  }else{
          document.getElementById('error-block').style.display = "block";
          document.getElementById('err-msg').innerText = "Name must be filled ";

          setTimeout(()=>{
            document.getElementById('error-block').style.display = "none";
          },3000);

          return false;
  }
}


function validateEmail(email) {
  let email_id = email.trim();
  if (
    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email_id) &&
    email_id.length > 6
  ) {
    return true;
  }
  return false;
}


function otpValidation(){

  let otp = String(document.getElementById('otp').value);

  if(otp.length == 6){

    return true;

  }else{

    document.getElementById('error-block').style.display = "block";
    document.getElementById('err-msg').innerText = "Enter a valid otp of atleast length 6 ";
            
    setTimeout(()=>{
      document.getElementById('error-block').style.display = "none";
    },3000);
    return false;
  
  }

}






/**
 * 
 * sign in validation end
 * 
 *  
 */


/*

** order 

*/

//calculating total

function checkout(n) {
  let amount = Number(n);
  console.log("working");
  if (document.getElementById("cash-on-delivery").checked) {
    console.log("COD");
    document.getElementById("extra").innerText =
      " including delivery charge 30₹";
    console.log(amount);
    document.getElementById("total").innerHTML = Number(amount + 30);
    document.getElementById("total_amount").value = Number(amount + 30);
  } else if (document.getElementById("razor").checked) {
    console.log("Razor");

    document.getElementById("extra").innerText = " including Payment Tax 10₹";
    document.getElementById("total").innerHTML = Number(amount + 10);
    document.getElementById("total_amount").value = Number(amount + 10);
  } else if (document.getElementById("stripe").checked) {
    console.log("Stripe");

    document.getElementById("extra").innerText = " including Payment Tax 10₹";
    document.getElementById("total").innerHTML = Number(amount + 10);
    document.getElementById("total_amount").value = Number(amount + 10);
  }
}

/*

** order validation

*/

function validateOrder() {
  let address = document.getElementById("address").value;
  let pin = document.getElementById("pin").value;
  let landmark = document.getElementById("landmark").value;
  let town = document.getElementById("town").value;

  if (
    address.length > 5 &&
    pin.length == 6 &&
    landmark.length > 2 &&
    town.length > 1
  ) {
    return true;
  } else {
    document.getElementById("validation-failed").style.display = "block";
    setTimeout(() => {
      document.getElementById("validation-failed").style.display = "none";
    }, 3000);
    return false;
  }
}



/**
 *
 * Cusotm alert box
 *
 */


//Creates the confirm box
function createConfirm(title, content, button1, button2) {

  var confirmBody = document.createElement("div");
  confirmBody.className = "confirmBody";
  confirmBody.setAttribute("id", "confirmBody");
  var confirmContainer = document.createElement("div");
  confirmContainer.className = "confirmContainer";
  var confirmInner = document.createElement("div");
  confirmInner.className = "confirmInner";
  var cfTop = document.createElement("div");
  cfTop.className = "cfTop";
  var cfclose = document.createElement("div");
  cfclose.className = "cfClose material-icons";
  // cfclose.innerHTML = "close";
  var cfTitle = document.createElement("div");
  cfTitle.className = "cfTitle";
  cfTitle.innerHTML = title;
  var cfContent = document.createElement("div");
  cfContent.className = "cfContent";
  cfContent.innerHTML = content;
  var cfBottom = document.createElement("div");
  cfBottom.className = "cfBottom";
  var cfSubmitContainer = document.createElement("div");
  cfSubmitContainer.className = "cfSubmitContainer";
  var cfCancel = document.createElement("div");
  cfCancel.className = "cfSubmit_bt cfCancel";
  cfCancel.innerHTML = button1;
  var cfYes = document.createElement("div");
  cfYes.className = "cfSubmit_bt cfYes";
  cfYes.innerHTML = button2;

  confirmBody.appendChild(confirmContainer);
  confirmContainer.appendChild(confirmInner);
  confirmInner.appendChild(cfTop);
  cfTop.appendChild(cfclose);
  cfTop.appendChild(cfTitle);
  confirmInner.appendChild(cfContent);
  confirmInner.appendChild(cfBottom);
  cfBottom.appendChild(cfSubmitContainer);
  cfSubmitContainer.appendChild(cfCancel);
  cfSubmitContainer.appendChild(cfYes);

  document.body.appendChild(confirmBody);

  var elements = [cfclose, cfCancel, cfYes, confirmBody, confirmContainer];
  return elements;
}

function removeConfirm(e) {
  e.parentNode.removeChild(e);
}

function confirmThis(
  title,
  content,
  button1Text,
  button2Text,
  yesCallback,
  noCallback
) {
  var elements = createConfirm(title, content, button1Text, button2Text);
  var close = elements[0];
  var cancel = elements[1];
  var yes = elements[2];
  var cfbody = elements[3];
  var cfContainer = elements[4];
  cfContainer.style.top = "-200px";
  setTimeout(function () {
    cfContainer.style.top = "100px";
  }, 100);

  close.addEventListener("click", function (e) {
    cfContainer.style.top = "-200px";
    setTimeout(function () {
      removeConfirm(cfbody);
    }, 200);
    noCallback();
  });

  window.onclick = function (event) {
    if (event.target == cfbody) {
      cfbody.style.backgroundColor = "rgb(192, 192, 192, 0.6)";
      setTimeout(function () {
        cfbody.style.backgroundColor = "transparent";
      }, 100);
    }
  };

  yes.addEventListener("click", function () {
    cfContainer.style.top = "-200px";
    setTimeout(function () {
      removeConfirm(cfbody);
    }, 200);
    yesCallback();
  });

  cancel.addEventListener("click", function () {
    cfContainer.style.top = "-200px";
    setTimeout(function () {
      removeConfirm(cfbody);
    }, 200);
    noCallback();
  });
}

//First function: Yes, Second: No
/*

Function call for a confirm message

confirmThis("Title here", "Content here","CANCEL", "CONTINUE",function(){
console.log("Yes");
},function(){
  console.log("No");
});
*/


/**
 * 
 * Cancel button controll start
 * 
 */

 window.onload = () => {

  let status = document.getElementsByClassName('order_status');
 //  console.log(status);
  
 for( i in status ){

   // console.log(status[i].innerHTML);
   if( status[i].innerText == "delivered" || status[i].innerText == "out for delivery" ){

       // console.log(status[i]);
       let id = String(status[i].getAttribute("data-id"));
       // console.log(id);
       document.getElementById(`cancelButton-${id}`).style.display = "none";

   }

 }

}

/**
* 
* Cancel button controll end
* 
*/

/**
 * 
 *  Search for Products Start
 * 
 */

let search = document.getElementById('searchHead');

search.addEventListener('change' , (e) => {


    document.getElementById("box").innerHTML = '';
    const text = search.value;
    console.log(text);
    submitSearch(text);


});

function submitSearch(search){

  document.getElementById('search_result').style.display = "block";
  console.log("sending request");
  let box =  document.getElementById("box");
  axios.post('/searchProduct',{ search })
    .then((response) => {
      console.log(response);
      if(response.data.products){

        let products = response.data.products;
        console.log(products);

        for (i = 0; i < products.length; i++) {

            // Create anchor element.
            let a = document.createElement('a'); 
                  
            // Create the text node for anchor element.
            let link = document.createTextNode(products[i].productName);
              
            // Append the text node to anchor element.
            a.appendChild(link); 
              
            // Set the title.
            a.title = "This is leads to the product store"; 
              
            // Set the href property.
            a.href = `/searchResult/${products[i]._id}`; 
            a.style = "text-align : center ;  "
            // Append the anchor element to the body.
            // document.body.appendChild(a); 
            box.appendChild(a);
            // html+="<a href=/searchResult/{{product[i]._id}} style=text-decoration:none >"+products[i].productName+"</a>";

            setTimeout(()=>{
              document.getElementById('search_result').style.display = "none";
            },5000);

          }

      }else{


        box.innerHTML = "No items match your search";

      }

    })

}



/**
 * 
 *  Search for Products End
 * 
 */
