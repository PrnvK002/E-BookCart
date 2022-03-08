
//================== Onload show graph ===================
console.log("-- Working ---");
// document.addEventListener('DOMContentLoaded', function() {
//   // your code here
//   showMonthlyOrderGraph();
// }, false);


/**
 *
 * Coupen removal start
 *
 */

function deleteCoupen(id) {
  confirmThis(
    "BOOK STORE",
    `Are you sure about removing this coupen ?`,
    "CANCEL",
    "CONTINUE",
    () => {
      document.getElementById(`row-${id}`).style.display = "none";
      axios
        .post("/admin/remove_coupen", { id })

        .then((response) => {
          if (response.data.success) {
            console.log("success");
          }
        });
    },
    () => {}
  );
}

/**
 *
 * Coupen removal end
 *
 */

/**
 *
 * Cancel button controll start
 *
 */

window.onload = () => {
  let status = document.getElementsByClassName("order_status");
  //  console.log(status);

  for (i in status) {
    // console.log(status[i].innerHTML);
    if (
      status[i].innerText == "delivered" ||
      status[i].innerText == "out for delivery"
    ) {
      // console.log(status[i]);
      let id = String(status[i].getAttribute("data-id"));
      // console.log(id);
      document.getElementById(`cancelButton-${id}`).style.display = "none";
      document.getElementById(`changeButton-${id}`).style.display = "none";
    }
  }
};

/**
 *
 * Cancel button controll end
 *
 */

/**
 *
 * delete Product section start
 *
 */

function deleteProduct(id, productName) {
  confirmThis(
    "BOOK STORE",
    `Are you sure about deleting ${productName} ?`,
    "CANCEL",
    "CONTINUE",
    () => {
      document.getElementById(`row-${id}`).style.display = "none";
      axios
        .post("/admin/products/delete_product", {
          id,
        })
        .then((response) => {
          console.log(response);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    () => {}
  );
}

/**
 *
 * delete Product section end
 *
 */

/**
 *
 *  Filter product section
 *
 */

function filterProducts(filter) {
  if (filter == "price") {
    let f = document.getElementById("filterPrice");
    let order = f.getAttribute("data-id");

    if (order == "Ascending") {
      f.setAttribute("data-id", "Descending");
      location.href = "/admin/productFilter/price/descending";
    } else {
      f.setAttribute("data-id", "Ascending");
      location.href = "/admin/productFilter/price/ascending";
    }
  } else {
    let f = document.getElementById("filterQuantity");
    let order = f.getAttribute("data-id");

    if (order == "Ascending") {
      f.setAttribute("data-id", "Descending");
      location.href = "/admin/productFilter/quantity/descending";
    } else {
      f.setAttribute("data-id", "Ascending");
      location.href = "/admin/productFilter/quantity/ascending";
    }
  }
}

/**
 *
 *  Filter product section end
 *
 */

/**
 * 
 * Block user / unblock user
 * 
 */

function blockUser( id , status ){

  confirmThis(
    "BOOK STORE",
    `Are you sure about BLocking this user ?`,
    "CANCEL",
    "CONTINUE",
    
    () => {
      if(status == 'false'){
        document.getElementById(`preBlockButton-${id}`).style.display = "none";
        document.getElementById(`unBlockButton-${id}`).style.display = "block";
        axios.post('/admin/updateBlock' , { id , blockStatus : true })
          .then((response) => {
  
            console.log(response.data);
  
        })
      }else{

        document.getElementById(`blockButton-${id}`).style.display = "none";
        document.getElementById(`unBlockButton-${id}`).style.display = "block";
        axios.post('/admin/updateBlock' , { id , blockStatus : true })
          .then((response) => {
  
            console.log(response.data);
  
        })
      }
    },
    () => {}
  );


}

function unBlockUser( id , status ){

  confirmThis(
    "BOOK STORE",
    `Are you sure about Unblocking this user ?`,
    "CANCEL",
    "CONTINUE",
    
    () => {

      if(status == 'false'){

        document.getElementById(`preUnBlockButton-${id}`).style.display = "none";
        document.getElementById(`blockButton-${id}`).style.display = "block";
        axios.post('/admin/updateBlock' , { id , blockStatus : false })
          .then((response) => {
  
            console.log(response.data);
  
        })
      }else{

        document.getElementById(`unBlockButton-${id}`).style.display = "none";
        document.getElementById(`blockButton-${id}`).style.display = "block";
        axios.post('/admin/updateBlock' , { id , blockStatus : false })
          .then((response) => {
  
            console.log(response.data);
  
        })

      }

    },
    () => {}
  );


}

/**
 * 
 * Block user / unblock user
 * 
 */


/**
 *
 *  Order start
 *
 */

function cancelOrder(id) {
  console.log("reaching cancel");
  confirmThis(
    "BOOK STORE",
    `Are you sure about cancelling this order ?`,
    "CANCEL",
    "CONTINUE",
    () => {
      let status = String(document.getElementById(`status-${id}`).innerText);
      document.getElementById(`status-${id}`).innerText = "cancelled";

      let buttons = document.getElementsByClassName("order-button");

      for (i in buttons) {
        buttons[i].style.display = "none";
      }

      axios
        .post("/admin/orders/cancel-order/", {
          id,
        })
        .then((response) => {
          if (response.data.success) {
            console.log(response);
          } else {
            document.getElementById(`row-${id}`).innerText = status;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    () => {}
  );
}

function filterOrders() {
  let filter = document.getElementById("filter");
  let order = filter.getAttribute("data-id");
  if (order == "Ascending") {
    filter.setAttribute("data-id", "Descending");
    location.href = "/admin/filterOrders/descending";
  } else {
    filter.setAttribute("data-id", "Ascending");
    location.href = "/admin/filterOrders/ascending";
  }
}

/**
 *
 *  Order end
 *
 */

/**
 *
 * update Order start
 *
 */

function updateOrder(id) {
  document.getElementById("order_id").value = id;
  popupView();
}

/**
 *
 * update Order end
 *
 */

/**
 *
 * Image handling section
 *
 * cropper
 * preview
 *
 *
 */

function fileValidation(e, id) {
  var fileInput = document.getElementById(id);

  var filePath = fileInput.value;

  // Allowing file type
  var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;

  if (!allowedExtensions.exec(filePath)) {
    document.getElementById("invalid").style.display = "block";
    setTimeout(() => {
      document.getElementById("invalid").style.display = "none";
    }, 2000);
    return false;
  } else {
    return true;
  }
}

const imagebox1 = document.getElementById("image-box1");
const crop_btn1 = document.getElementById("crop-btn1");
const input1 = document.getElementById("id_image1");

function viewImage1(event) {
  if (fileValidation(event, "id_image1"))
    document.getElementById("imgView1").src = URL.createObjectURL(
      event.target.files[0]
    );
  else {
    return false;
  }
}

// When user uploads the image this event will get triggered
input1.addEventListener("change", () => {
  // Getting image file object from the input variable
  const img_data1 = input1.files[0];

  // createObjectURL() static method creates a DOMString containing a URL representing the object given in the parameter.
  // The new object URL represents the specified File object or Blob object.
  const url1 = URL.createObjectURL(img_data1);

  // Creating a image tag inside imagebox which will hold the cropping view image(uploaded file) to it using the url created before.
  imagebox1.innerHTML = `<img src="${url1}" id="image1" style="width:100%;">`;

  // Storing that cropping view image in a variable
  const image1 = document.getElementById("image1");

  // Displaying the image box
  document.getElementById("image-box1").style.display = "block";
  // Displaying the Crop buttton
  document.getElementById("crop-btn1").style.display = "block";
  // Hiding the Post button

  const cropper1 = new Cropper(image1, {
    autoCropArea: 1,
    viewMode: 1,
    scalable: false,
    zoomable: false,
    movable: false,
    minCropBoxWidth: 200,
    minCropBoxHeight: 200,
  });

  // When crop button is clicked this event will get triggered
  crop_btn1.addEventListener("click", () => {
    // This method coverts the selected cropped image on the cropper canvas into a blob object
    cropper1.getCroppedCanvas().toBlob((blob) => {
      // Gets the original image data
      let fileInputElement1 = document.getElementById("id_image1");
      // Make a new cropped image file using that blob object, image_data.name will make the new file name same as original image
      let file1 = new File([blob], img_data1.name, {
        type: "image/*",
        lastModified: new Date().getTime(),
      });
      // Create a new container

      let container1 = new DataTransfer();
      // Add the cropped image file to the container
      container1.items.add(file1);
      // Replace the original image file with the new cropped image file
      fileInputElement1.file = container1.files[0];
      document.getElementById("imgView1").src = URL.createObjectURL(
        fileInputElement1.files[0]
      );
      // Hide the cropper box
      document.getElementById("image-box1").style.display = "none";
      // Hide the crop button
      document.getElementById("crop-btn1").style.display = "none";
    });
  });
});

//second image

function viewImage2(event) {
  if (fileValidation(event, "id_image2")) {
    document.getElementById("imgView2").src = URL.createObjectURL(
      event.target.files[0]
    );
  } else {
    return false;
  }
}

const imagebox2 = document.getElementById("image-box2");
const crop_btn2 = document.getElementById("crop-btn2");
const input2 = document.getElementById("id_image2");

// When user uploads the image this event will get triggered
input2.addEventListener("change", () => {
  // Getting image file object from the input variable
  const img_data2 = input2.files[0];

  // createObjectURL() static method creates a DOMString containing a URL representing the object given in the parameter.
  // The new object URL represents the specified File object or Blob object.
  const url2 = URL.createObjectURL(img_data2);

  // Creating a image tag inside imagebox which will hold the cropping view image(uploaded file) to it using the url created before.
  imagebox2.innerHTML = `<img src="${url2}" id="image2" style="width:100%;">`;

  // Storing that cropping view image in a variable
  const image2 = document.getElementById("image2");

  // Displaying the image box
  document.getElementById("image-box2").style.display = "block";
  // Displaying the Crop buttton
  document.getElementById("crop-btn2").style.display = "block";
  // Hiding the Post button

  const cropper2 = new Cropper(image2, {
    autoCropArea: 1,
    viewMode: 1,
    scalable: false,
    zoomable: false,
    movable: false,
    minCropBoxWidth: 200,
    minCropBoxHeight: 200,
  });

  // When crop button is clicked this event will get triggered
  crop_btn2.addEventListener("click", () => {
    // This method coverts the selected cropped image on the cropper canvas into a blob object
    cropper2.getCroppedCanvas().toBlob((blob) => {
      // Gets the original image data
      let fileInputElement2 = document.getElementById("id_image2");
      // Make a new cropped image file using that blob object, image_data.name will make the new file name same as original image
      let file2 = new File([blob], img_data2.name, {
        type: "image/*",
        lastModified: new Date().getTime(),
      });
      // Create a new container

      let container2 = new DataTransfer();
      // Add the cropped image file to the container
      container2.items.add(file2);
      // Replace the original image file with the new cropped image file
      fileInputElement2.file = container2.files[0];
      document.getElementById("imgView2").src = URL.createObjectURL(
        fileInputElement2.files[0]
      );
      // Hide the cropper box
      document.getElementById("image-box2").style.display = "none";
      // Hide the crop button
      document.getElementById("crop-btn2").style.display = "none";
    });
  });
});

//Third image

function viewImage3(event) {
  if (fileValidation(event, "id_image3"))
    document.getElementById("imgView3").src = URL.createObjectURL(
      event.target.files[0]
    );
}

const imagebox3 = document.getElementById("image-box3");
const crop_btn3 = document.getElementById("crop-btn3");
const input3 = document.getElementById("id_image3");

// When user uploads the image this event will get triggered
input3.addEventListener("change", () => {
  // Getting image file object from the input variable
  const img_data3 = input3.files[0];

  // createObjectURL() static method creates a DOMString containing a URL representing the object given in the parameter.
  // The new object URL represents the specified File object or Blob object.
  const url3 = URL.createObjectURL(img_data3);

  // Creating a image tag inside imagebox which will hold the cropping view image(uploaded file) to it using the url created before.
  imagebox3.innerHTML = `<img src="${url3}" id="image3" style="width:100%;">`;

  // Storing that cropping view image in a variable
  const image3 = document.getElementById("image3");

  // Displaying the image box
  document.getElementById("image-box3").style.display = "block";
  // Displaying the Crop buttton
  document.getElementById("crop-btn3").style.display = "block";
  // Hiding the Post button

  const cropper3 = new Cropper(image3, {
    autoCropArea: 1,
    viewMode: 1,
    scalable: false,
    zoomable: false,
    movable: false,
    minCropBoxWidth: 200,
    minCropBoxHeight: 200,
  });

  // When crop button is clicked this event will get triggered
  crop_btn3.addEventListener("click", () => {
    // This method coverts the selected cropped image on the cropper canvas into a blob object
    cropper3.getCroppedCanvas().toBlob((blob) => {
      // Gets the original image data
      let fileInputElement3 = document.getElementById("id_image3");

      console.log("just checking out");
      // Make a new cropped image file using that blob object, image_data.name will make the new file name same as original image
      let file3 = new File([blob], img_data3.name, {
        type: "image/*",
        lastModified: new Date().getTime(),
      });
      // Create a new container
      console.log(file3);

      let container3 = new DataTransfer();
      // Add the cropped image file to the container
      container3.items.add(file3);

      console.log("container3");
      console.log(container3);
      // Replace the original image file with the new cropped image file
      fileInputElement3.file = container3.files[0];

      document.getElementById("imgView3").src = URL.createObjectURL(
        fileInputElement3.files[0]
      );
      // Hide the cropper box
      document.getElementById("image-box3").style.display = "none";
      // Hide the crop button
      document.getElementById("crop-btn3").style.display = "none";
    });
  });
});

/**
 *
 * Image handling section en
 *
 * cropper
 * preview
 *
 *
 */

/// pop up of offers

function popupView() {
  var popup = document.getElementById("popup-wrapper");
  // var btn = document.getElementById("popup-btn");
  var span = document.getElementById("close");
  popup.classList.add("show");
  span.onclick = function () {
    popup.classList.remove("show");
  };
}

// remove banner

function removeBanner(id) {
  console.log("reaching here remove");
   
  
      confirmThis(
        "BOOK STORE",
        `Are you sure about removing this banner ?`,
        "CANCEL",
        "CONTINUE",
        () => {
          
          document.getElementById(`card-${id}`).style.display = "none";
          axios
            .post("/admin/remove-banner", {
              id,
            })
            .then((response) => {
              if (response.data.state) {
                console.log(response);
              }
            });

        },
        () => {}
      );


}

function validationAdd() {

  let name = document.getElementById("productName").value;
  let author = document.getElementById("author").value;
  let stock = document.getElementById("stock").value;
  let description = document.getElementById("description").value;
  let price = document.getElementById("price").value;


  if(name.length > 0){

    document.getElementById('productName_err').style.display = "none";

    if(author.length > 0){

      document.getElementById('author_err').style.display = "none";

      if(description.length > 0){
        
        document.getElementById('description_err').style.display = "none";

        if(stock.length > 0){

          document.getElementById('stock_err').style.display = "none";

          if(price.length > 0){

            document.getElementById('price_err').style.display = "none";
            return true;

          }else{

            document.getElementById('price_err').style.display = "block";
            return false;

          }
        }else{

          document.getElementById('stock_err').style.display = "block";
          return false;

        }

      }else{

        document.getElementById('description_err').style.display = "block";
        return false;

      }

    }else{

      document.getElementById('author_err').style.display = "block";
      return false;

    }
  }else{

    document.getElementById('productName_err').style.display = "block";
    return false;

  }

}

function valdiateText(name) {
  if (name.length > 1) {
    return true;
  } else {
    return false;
  }
}

function vlalidateNumber() {}

/**
 * custom alert box configuration
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
  // console.log("reaching confirm this");
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

/**
 *
 * View Category start
 *
 */
function addCategory() {
  let categoryName = String(document.getElementById("category").value);
  addLoader();

  axios.post("/admin/add-category", { categoryName }).then((response) => {
    if (response.data.success) {
      removeLoader();
      location.href = "/admin/view-category";
    } else {
      removeLoader();
      document.getElementById("category_error").style.display = "block";
      setTimeout(() => {
        document.getElementById("category_error").style.display = "none";
      }, 3000);
    }
  });
}

function viewAddCategory() {
  popupView();
}

function deleteCategory(id, name) {
  confirmThis(
    "BOOK STORE",
    `Are you sure about deleting ${name} ?`,
    "CANCEL",
    "CONTINUE",
    () => {
      document.getElementById(`row-${id}`).style.display = "none";
      axios
        .post("/admin/category/delete-category", {
          id,
        })
        .then((response) => {
          console.log(response);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    () => {}
  );
}

/**
 *
 * View Category end
 *
 */

/**
 *
 * Loading screen start
 *
 *
 */

function addLoader() {
  let load = document.getElementById("loading");
  load.classList.add("loader");
  // let back = document.getElementById('background');
  // back.classList.add('blur');
}

function removeLoader() {
  let load = document.getElementById("loading");
  load.classList.remove("loader");
  // let back = document.getElementById('background');
  // back.classList.remove('blur');
}

/**
 *
 * Loading screen end
 *
 *
 */

/**
 *
 *  Offer section start
 *
 */

function deleteOffer(id, category_id, product, isCategory, isProduct) {
  confirmThis(
    "BOOK STORE",
    `Are you sure about deleting offer ?`,
    "CANCEL",
    "CONTINUE",
    () => {
      document.getElementById(`row-${id}`).style.display = "none";
      axios
        .post("/admin/remove_offer", {
          id,
          category_id,
          product,
          isCategory,
          isProduct,
        })
        .then((response) => {
          console.log(response);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    () => {}
  );
}

function addOffer(id, hide) {
  document.getElementById(id).style.display = "block";
  document.getElementById(hide).style.display = "none";
}

/**
 *
 *  Offer section end
 *
 */

/**
 *
 *   Generate Sales Report start
 *
 */

function generateReport() {
  let from = document.getElementById("from-date").value;
  console.log(from);
  let to = document.getElementById("to-date").value;
  console.log(to);
  if (from.length > 0 && to.length > 0) {
    location.href = `/admin/salesReport/${from}/${to}`;
  } else {
    document.getElementById("salesError").style.display = "block";
    setTimeout(() => {
      document.getElementById("salesError").style.display = "none";
    }, 4000);
  }
}

/**
 *
 * Generate Sales Report End
 *
 */

/**
 *
 * Graph generation in dashboard start
 *
 */




//bar
function showYearlyOrderGraph(){  

  document.getElementById('showYearlyOrderGraph').style.display = "block";
  document.getElementById('showYearlyRevenueGraph').style.display = "none";
  document.getElementById('showMonthlyRevenueGraph').style.display = "none";
  document.getElementById('showMonthlyOrderGraph').style.display = "none";
  document.getElementById('graph').style.display = "block";
  addLoader();

  axios.get('/admin/getGraph/yearlyOrderGraph').then((response) => {
      
      document.getElementById('chartStatus').value == true ;
      console.log(response.data);
      let orderData = response.data.orderCount;
  
      let label = [ '2018' , '2019' , '2020' , '2021' , '2022' ];
      let data = [ orderData.eighteen.order_count , orderData.nineteen.order_count , orderData.twenty.order_count , orderData.twentyone.order_count , orderData.twentytwo.order_count ];
      let id = document.getElementById('showYearlyOrderGraph');
      showGraph( label , data , id);
  
    })

  // document.getElementById('barChart').remove();
}

function showMonthlyOrderGraph(){

  document.getElementById('showMonthlyOrderGraph').style.display = "block";
  document.getElementById('showYearlyRevenueGraph').style.display = "none";
  document.getElementById('showMonthlyRevenueGraph').style.display = "none";
  document.getElementById('showYearlyOrderGraph').style.display = "none";
  document.getElementById('graph').style.display = "block";
  addLoader();


  axios.get('/admin/getGraph/monthlyOrderGraph').then((response) => {
      console.log(response.data);
      document.getElementById('chartStatus').value == true ;
      let orderData = response.data.orderCount;
      let label = [ "January" , "February" , "March" , "April" , "May" , "June" , "July" , "August" , "September" , "October" , "November" , "December" ];
      let data = [ orderData.january.order_count , orderData.february.order_count , orderData.march.order_count , orderData.april.order_count , orderData.may.order_count , orderData.june.order_count , orderData.july.order_count , orderData.august.order_count , orderData.september.order_count , orderData.october.order_count , orderData.november.order_count , orderData.december.order_count ]
      let id = document.getElementById('showMonthlyOrderGraph');

      showGraph( label , data , id);
  });
  // document.getElementById('barChart').remove();
}

function showMonthlyRevenueGraph(){

  // document.getElementById('barChart').remove();
  document.getElementById('showMonthlyRevenueGraph').style.display = "block";
  document.getElementById('showYearlyRevenueGraph').style.display = "none";
  document.getElementById('showMonthlyOrderGraph').style.display = "none";
  document.getElementById('showYearlyOrderGraph').style.display = "none";
  document.getElementById('graph').style.display = "block";
  addLoader();

  
    axios.get('/admin/getGraph/monthlyRevenueGraph').then((response) => {
      console.log(response.data);
      document.getElementById('chartStatus').value == true ;
      let revenueData = response.data.revenueData;
      let label = [ "January" , "February" , "March" , "April" , "May" , "June" , "July" , "August" , "September" , "October" , "November" , "December" ];
      let data = [ revenueData.january.total , revenueData.february.total , revenueData.march.total , revenueData.april.total , revenueData.may.total , revenueData.june.total , revenueData.july.total , revenueData.august.total , revenueData.september.total , revenueData.october.total , revenueData.november.total , revenueData.december.total ]
      let id = document.getElementById('showMonthlyRevenueGraph');

      showGraph(label , data , id);
  })



}

function showYearlyRevenueGraph(){

  document.getElementById('showYearlyRevenueGraph').style.display = "block";
  document.getElementById('showMonthlyRevenueGraph').style.display = "none";
  document.getElementById('showMonthlyOrderGraph').style.display = "none";
  document.getElementById('showYearlyOrderGraph').style.display = "none";

  document.getElementById('graph').style.display = "block";
  addLoader();

  
    axios.get('/admin/getGraph/yearlyRevenueGraph').then((response) => {
      console.log(response.data);
      document.getElementById('chartStatus').value == true ;

      let revenueData = response.data.revenueData;
      let label = [ '2018' , '2019' , '2020' , '2021' , '2022' ];
      let data = [ revenueData.eighteen.total , revenueData.nineteen.total , revenueData.twenty.total , revenueData.twentyone.total , revenueData.twentytwo.total ]
      let id = document.getElementById('showYearlyRevenueGraph');
      
      showGraph( label , data , id);

  })   
 
  
  // document.getElementById('barChart').remove();

}

function showGraph( labels , data , id ){

    removeLoader();
    id.getContext("2d");
    var myBarChart = new Chart(id, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Number of Orders",
            data: data,
            backgroundColor: 
              "rgba(255, 99, 132, 0.2)",
            borderColor: 
              "rgba(255,99,132,1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    });


}
/**
 *
 * Graph generation in dashboard end
 *
 */

/**
 * 
 *  Coupen Validation start
 * 
 */

function validateCoupen(){

  let coupenName = document.getElementById('coupenName').value;
  let offer_rate = document.getElementById('offer_rate').value;
  let coupenCode = document.getElementById('coupenCode').value;
  let expiry = document.getElementById('expiry-date').value;

  let date = new Date();
  let diff = date.getDate() - expiry.getDate();
  if(diff >  0 ){
    if(coupenName.length > 0 ){
      if(offer_rate.length > 0){
        if(coupenCode.length > 0){
            
          return true;
          
        }else{

          document.getElementById('coupen_error').innerText = "Coupen code must be filled";
          document.getElementById('coupen_error_section').style.display = "block";
          return false;

        }
      }else{

        document.getElementById('coupen_error').innerText = "Offer rate must be filled";
        document.getElementById('coupen_error_section').style.display = "block";

      }
    }else{

      document.getElementById('coupen_error').innerText = "Coupen name must be filled";
      document.getElementById('coupen_error_section').style.display = "block";

    }
  }else{
    document.getElementById('coupen_error').innerText = "Enter a valid coupen expiry date";
    document.getElementById('coupen_error_section').style.display = "block";
    return false;
  }


}

/**
 * 
 * Coupen Validation end
 * 
 */