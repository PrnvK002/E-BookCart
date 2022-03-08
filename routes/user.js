var express = require("express");
const passport = require("passport");
const mongoose = require('mongoose');
var router = express.Router();
const { signupSchema, loginSchema, resetPasswordSchema } = require("../helpers/validator");

const { findUsers, insertUser, updateUser , updateUserDetails , loginCheck, findOneUser, updatePassword, findCategory, findPhone , findAddress , addAddress , updateAddress , findOneAddress , deleteAddress , addWallet , useWallet } = require("../helpers/user_helper");

const { findProducts , findBestProducts , findNewProducts , insertProduct, updateProduct, deleteProduct, findOneProduct , productSearch , findPriceFilter , updateStock } = require("../helpers/product_helper");

const { findCartProduct, findCart, insertCart, updateCart, findCartProducts, updateCartCount, deleteCartItem, findCartProductCount , addToWishlist , updateWishlist , removeWishlist , findWishlist , findWishlistCount } = require("../helpers/cart_helper");

const { placeOrder , findOneOrder , cancelOrder , findAllOrders , generateRazorpay , validatePayment , updateOrderAndPaymentStatus , generateStripe , deleteOrder , findOrder , findAllUserOrders } = require('../helpers/order_helper');

const { findCoupen , updateCoupen } = require('../helpers/offer_helper');

const { findBanner } = require('../helpers/banner_helper');

const { sendMail } = require("../helpers/mail");

const otpGenerator = require("otp-generator");

const { loginValidator } = require("../middleware/login_validator");

const { sendOtp } = require("../middleware/sms"); 

const Orders = require("../models/orders");
const { generate } = require("otp-generator");
const { response } = require("express");

//passport middleware detailed scripts written in there
require("../config/passport");

// generate otp for verification
let otp = otpGenerator.generate(6, {
  upperCaseAlphabets: false,
  specialChars: false,
  lowerCaseAlphabets: false,
});

/* GET users listing. */
router.get("/", function (req, res, next) {
  const user = req.session.user;
  // console.log(user);
  Promise.all([findBestProducts(), findNewProducts() ,findBanner()]).then((data) => {
    const [ bestProducts , newProducts , banners ] = data;
    let total_count = 0;
    if(user){
      Promise.all([findCartProductCount(user._id),findWishlistCount(user._id)]).then((countData) => {

        console.log(countData);
        let [ total_count , wishlist_count ]   = countData;
        res.render("user/index", {
          layout: "user_layout",
          nav: true,
          user,
          bestProducts,
          newProducts,
          banners,
          total_count,
          wishlist_count
        })
      }).catch((err) => {
        console.log(err);
        res.render("user/index", {
          layout: "user_layout",
          nav: true,
          user,
          bestProducts,
          newProducts,
          banners,
          total_count
        })
      })
    }else{
      total_count = 0;
      res.render("user/index", {
        layout: "user_layout",
        nav: true,
        user,
        bestProducts,
        newProducts,
        banners,
        total_count
      })
    }
    // console.log(products);
  ;
  });
});

/*insertMany

* login page

*/
router.get("/login", (req, res) => {
  let user = req.session.user;
  if(user){
    res.redirect('/');
  }else{
    res.render("user/login", { layout: "user_layout", nav: true });
  }
});


router.post("/login", async (req, res) => {
  try {
    const user = req.body;
    console.log(user);
    const result = await loginSchema.validateAsync(req.body);
    loginCheck(user)
      .then((data) => {
        console.log("--------------------login");
        console.log(data);
        console.log("--------------------login");

        req.session.user = {
          _id: data._id,
          email: data.email,
          address: data.address,
          image : data.image
        };
        res.redirect("/");
      })
      .catch((error) => {
        // throw error
        res.render('user/login',{layout:'user_layout',nav:true,error});
      });
    // console.log(result);
  } catch (error) {
    console.log(error);
    res.render('user/login',{layout:'user_layout',nav:true,error});
  }
});



router.get("/login_otp", (req, res) => {
  res.render("user/otp_login",{ layout : "user_layout" , nav :true });
});

router.post('/login_otp/send_otp',( req , res ) => {

  let { phone } = req.body;
  let data = req.body;
  data.time = new Date();
  findPhone(phone).then((response) => {
    console.log('user found');
    // sendOtp( phone, otp);
    res.render('user/login_otp',{ nav : true , layout : 'user_layout' , data });

  })
    .catch((err) => {
      console.log(err);
      res.render('user/otp_login',{ nav : true , layout : 'user_layout' , error : "Phone not registered"});
      
    });
})


router.post("/login_otp", (req, res) => {

  let { phone , time } = req.body;
  
  let OTP = req.body.otp;
  let pre = new Date(time);
  let post = new Date();
  let preTime = pre.getTime();
  let postTime = post.getTime();
  let six = 60 * 1000;
  let diff = postTime - preTime;

  if(diff < six){
    if( otp == OTP ){

      findPhone(phone).then((response) => {

        req.session.user = {
          _id : response._id,
          email : response.email,
          address : response.address,
          image : response.image
        }
        res.redirect('/');
    
      }).catch((err) => {
        console.log(err);
      })


    }else{

      res.render('user/login_otp',{ nav : true , layout : 'user_layout' , data , error:"invalid otp" });


    }
  }else{

    res.render('user/login_otp',{ nav : true , layout : 'user_layout' , data , error:"OTP timed out" });

  }

  
});



router.get('/resend_otp',(req,res) => {
  sendOtp(phone,otp);
  res.json({msg : "message sent"});
});



router.post('/submit_otp',(req,res) => {
  console.log(req.body);
  let date = new Date(req.body.time);
  let time = date.getTime();  
  let current_date = new Date();
  let current_time = current_date.getTime();
  console.log(current_date);
  console.log(current_time);
  let time_diff = Math.abs(current_time - time);
  const diff = Math.ceil(time_diff / (1000 * 60));
  console.log(diff);
  let received_otp = req.body.otp;
  let phone = req.body.phone;
  let six = 6 * 60 * 1000 ;
  if(otp == received_otp){
    if( diff <= six){
      findPhone(phone).then((data) => { 
        req.session.user = {
          _id: data._id,
          email: data.email,
          address: data.address,
          image : data.image
        };
        res.redirect('/');
      });
      
    }else{
    res.render('user/otp_login',{layout:"user_layout", nerr : "OTP expired"});
    }
  }
  else{
    res.render('user/otp_login',{layout:"user_layout",err : "Invalid otp or phone number"});
  }
});

/*

** Forgot Password

*/


router.get("/forgot-password", (req, res) => {
  res.render("user/forgot_password", { layout: "user_layout", nav: false });
});

router.get("/enter-otp", (req, res) => {
  console.log(req.query);
  let email = req.query.email;
  findOneUser(email)
    .then((data) => {
      sendMail(email, otp);
      res.render("user/otp", { layout: "user_layout", nav: false });
    })
    .catch((error) => {
      res.json(error);
      console.log(error);
    });
});

router.post("/enter-otp", (req, res) => {
  if (req.body.otp === otp) {
    res.redirect("/reset_password");
  } else {
    let error = "invalid otp";
    res.json(error);
  }
});

router.get("/reset_password", (req, res) => {
  res.render("user/reset_password", { layout: "user_layout", nav: false });
});

router.post("/reset_password", async (req, res) => {
  try {
    const result = await resetPasswordSchema.validateAsync(req.body);
    updatePassword(req.body.email, req.body.password)
      .then((data) => {
        console.log(data);
        res.redirect("/");
      })
      .catch((error) => {
        console.log("update error");
        throw error;
      });
  } catch (error) {
    console.log("validation error");
    res.json(error);
  }
});

/*

* signup page

*/

router.get("/signup", (req, res) => {
  res.render("user/signup", { layout: "user_layout", nav: true });
});


/*

*** OTP validation

*/


router.post('/send_otp',async(req,res) => {
  try{
    let { phone } = req.body;
    const result = await signupSchema.validateAsync(req.body);
   
    let data = req.body;
    data.time = new Date();
    console.log(phone);
    findPhone(phone).then((data) => {
      console.log("found user");
      res.render('user/signup',{layout:'user_layout', nav : true ,error: "User with this phone already exists"});
    }).catch((err) => {
      console.log("sending otp not working");
      sendOtp(phone,otp);
      res.render('user/signup-otp',{ nav: true , layout : 'user_layout' , data });
    })

  }
  catch(error){
    res.render('user/signup',{layout:'user_layout', nav : true ,error});
  }
})

router.post("/signup", (req, res) => {
    const user = req.body;
    console.log(user);
    
    let date = new Date(req.body.time);
    let time = date.getTime();  
    let current_date = new Date();
    let current_time = current_date.getTime();
    let time_diff = Math.abs(current_time - time);
    const diff = Math.ceil(time_diff / (1000 * 60));
    let six = 60 * 1000 ;

    if( req.body.otp == otp  ){
      if(diff <= six){
        findOneUser(user.email)
          .then((data) => {
            res.json({ status: "User already exists please login" });
          })
          .catch((err) => {
            insertUser(user)
              .then((data) => {
                console.log("user inserted");
                console.log(data);
                req.session.user = {
                  _id: data._id,
                  email: data.email,
                  address: data.address,
                  image : data.image
                };
                res.redirect("/");
              })
              .catch((error) => {
                throw error;
              });
          });
        }
        else{
          res.render('/signup',{ error : " OTP expired "});
        }

    }else{
      res.render('user/signup-otp',{layout:'user_layout',nav:true, error : "invalid otp" });
    }

   

  });

/*
 ** @ google oauth using passport
 ** first sending api request to google for access
 */
router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google"),
  (req, res) => {
    // req.session.user = req.user;
    findOneUser(req.user.email).then((data)=>{
        req.session.user = {
          _id: data._id,
          email: data.email,
          address: data.address,
        }
        res.redirect("/");
    })
    
  }
);


/**
 * 
 * Wishlist page start
 * 
 */

router.post('/add-To-wishlist',( req , res ) => {

    let { proId } = req.body;
    let user = req.session.user;
    if(user){

      findWishlist(user._id).then((data) => {

        console.log(data);
        let match = data.products.filter((e) => {
          return e.product_id == proId
        })

        if(match.length > 0){
            res.json({success : false});
        }
        else{

          console.log("no match found");
          updateWishlist( user._id , proId).then((response) => {
            console.log(response);
            res.json({ success : true ,  user_status : true  });
          }).catch( (err) => {
            console.log(err);
            res.json({success : false ,  user_status : true  });
          })
        }
      }).catch((err) => {
        console.log(err);

        addToWishlist(user._id , proId).then((response) => {
          
          console.log(response);
          res.json({ success : true , user_status : true  });

        }).catch((err) => {

          console.log(err);
          res.json({success : false , user_status : true });

        })


      })

    }else{

      res.json({ user_status : false , success : false});

    }

});


router.get('/wishlist',( req , res ) => {

  let user = req.session.user;
  if(user){

    findWishlist(user._id).then((data) => {
      console.log(data);
      res.render('user/wishlist',{ nav : true , layout : 'user_layout' , data , user});
    }).catch((err) => {
      console.log(err);
      res.render('user/wishlist',{ nav : true , layout : 'user_layout' , user});
    })

  }else{
    res.redirect('/login');
  }

})


router.post('/remove-from-wishlist',( req , res ) => {
  
  let user = req.session.user;
  let { proId } = req.body;  
  removeWishlist(user._id,proId).then((response) => {
    
    res.json({success : true});

  }).catch((err) => {

    console.log(err);
    res.json({success : false});
  
  })

})



/**
 * 
 * Wishlist page end
 * 
 */

/**
 * 
 * Search Start
 * 
 * 
 */

router.post('/searchProduct' , (req,res) => {

  console.log(req.body);
  let user = req.session.user;
  let { search } = req.body;
  productSearch(search)
    .then((products) => {

      res.json({ products });

  })
    .catch((err) => {
      
      res.json({ success : false });
    
      })

});

router.get('/searchResult/:id',(req,res) => {

  let user = req.session.user;
  let id = req.params.id;
  let Id = mongoose.Types.ObjectId(id);

  Promise.all([findProducts({_id : Id}),findCategory()]).then((data) => {
    let [ products , categories ] = data;
    res.render('user/store',{ layout : 'user_layout' , nav : true , user , products , categories })
  })


});


/**
 * 
 * Store page
 * 
 */

router.get('/store',( req , res ) => {

  let user = req.session.user;

  Promise.all([findProducts({}),findCategory()]).then((data) => {
    let [ products , categories ] = data;
    res.render('user/store',{ layout : 'user_layout' , nav : true , user , products , categories })
  })

});


router.get('/category_filter/:id',( req , res ) => {

  let user = req.session.user;
  let id = req.params.id;
 
  
    Promise.all([findProducts({category_id:id}),findCategory()]).then((data) => {
      let [ products , categories ] = data;
      res.render('user/store',{ layout : 'user_layout' , nav : true , user , products , categories })
    }).catch((err) => {
      findCategory().then(( categories ) => {
        res.render('user/store',{ layout : 'user_layout' , nav : true , user , categories });
      })
    })
    
});

router.get('/store/offer_filter',( req , res ) => {

  let user = req.session.user;
 
  
    Promise.all([findProducts({ isOffer:true }),findCategory()])
    
      .then((data) => {
      
        let [ products , categories ] = data;
        res.render('user/store',{ layout : 'user_layout' , nav : true , user , products , categories })

      })
        
        .catch((err) => {
     
          findCategory()
            
            .then(( categories ) => {
            
              res.render('user/store',{ layout : 'user_layout' , nav : true , user , categories });

      })
    })
 
});

router.post('/priceFilter',(req,res) => {

  let user = req.session.user;
  console.log(req.body);
  let { priceFrom , priceTo } = req.body;

  Promise.all([ findCategory() , findPriceFilter(priceFrom , priceTo )])
    .then((data) => {

        let [ categories , products ] = data;
        console.log(products.length);
        res.render('user/store',{ layout : 'user_layout' , nav : true , user , products , categories });

})
  .catch((err) => {

      console.log(err);
      findCategory()
        .then(( categories ) => {
          res.render('user/store',{ layout : 'user_layout' , nav : true , user , categories });
      })

})


})
/**
 * 
 * Store page end
 * 
 */







/*

* cart page

*/

router.post("/add-to-cart", (req, res) => {


  let { proId } = req.body;
  let user = req.session.user;
  // console.log(userId);
  if(user){
    findOneProduct(proId)
      .then((product) => {
        findCart(user._id)
          .then((cartDetails) => {
            console.log(cartDetails.products.length);
            if (cartDetails.products.length < 1) {
              if(product.isOffer){
                updateCart(user._id, proId, product.offerPrice)
                  .then((result) => {
                    console.log(result);
                    res.json({ success: true });
                  })
                  .catch((err) => {
                    console.log(err);
                    res.json({ success: false });
                  });

              }else{

                updateCart(user._id, proId, product.price)
                  .then((result) => {
                    console.log(result);
                    res.json({ success: true });
                  })
                  .catch((err) => {
                    console.log(err);
                    res.json({ success: false });
                  });


              }
  
            } else {
                    
                    let check = cartDetails.products.filter((f) => {
                      return f.product_id == proId;
                    });
                    console.log("----check product---------");
                    console.log(check);
                    if (check.length > 0) {
                      if(product.isOffer){

                        updateCartCount(user._id, product.offerPrice, proId, 1)
                          .then((result) => {
                            console.log(result);
                            res.json({ success: true });
                          })
                          .catch((err) => {
                            console.log("occuring error trial 1");
                            console.log(err);
                            res.json({ success: false });
                          });

                      }else{

                        updateCartCount(user._id, product.price, proId, 1)
                          .then((result) => {
                            console.log(result);
                            res.json({ success: true });
                          })
                          .catch((err) => {
                            console.log("occuring error trial 1");
                            console.log(err);
                            res.json({ success: false });
                          });                        

                      }
                    } else {

                      if(product.isOffer){

                        updateCart(user._id, proId, product.offerPrice)
                          .then((result) => {
                            console.log(result);
                            res.json({ success: true });
                          })
                          .catch((err) => {
                            console.log("occuring error trial 2");
                            // console.log(err);
                            res.json({ success: false });
                          });

                      }else{

                        updateCart(user._id, proId, product.price)
                          .then((result) => {
                            console.log(result);
                            res.json({ success: true });
                          })
                          .catch((err) => {
                            console.log("occuring error trial 2");
                            // console.log(err);
                            res.json({ success: false });
                          });


                      }

                    }
            }
  
          })
          .catch((err) => {
            console.log(err);

            if(product.isOffer){

              insertCart(proId, user._id, product.offerPrice)
              .then((result) => {
                console.log(result);
                res.json({ success: true });
              })
              .catch((err) => {
                console.log(err);
                res.json({ success: false });
              });

            }else{

              insertCart(proId, user._id, product.price)
                .then((result) => {
                  console.log(result);
                  res.json({ success: true });
                })
                .catch((err) => {
                  console.log(err);
                  res.json({ success: false });
                });

            }

          });
      })
      .catch((err) => {
        console.log(err);
        res.json({ success: false });
      });
  }else{
    console.log("user not present");
    res.json({ success: false });
  }
});

router.get("/cart",(req, res) => {
  let user = req.session.user;
  let total_count = 0;
  if(user){
    findCartProductCount(user._id).then((count) => {
      total_count = count;
    }).catch((err) => {
      console.log(err);
    })
  }else{
    total_count = 0;
  }
  // res.render("user/cart", {
  //   layout: "user_layout",
  //   nav: true,
  //   user
  // });
  findCartProducts(user._id)
    .then((cartData) => {
      // res.json(cartData)
      console.log(cartData);
      
      res.render("user/cart", {
        layout: "user_layout",
        nav: true,
        user,
        cartData,
        total_count
      });
    })
    .catch((err) => {
      console.log("-----------err0r-------");
      // res.json(err);
      console.log(err);
      res.render("user/cart", {
        layout: "user_layout",
        nav: true,
        user,
        total_count
      });
    });
});

// updateCartCount
router.post("/updateCount", (req, res) => {
  let userId = req.session.user._id;
  console.log('cart Count');
  console.log(req.body);
  updateCartCount(userId, req.body.price, req.body.productId, req.body.count)
    .then((data) => {
      // console.log(data);
      res.json({ success: true });
    })
    .catch((err) => {
      console.error(err);
      res.json({ success: false });
    });
});

router.post("/deleteCartItem", (req, res) => {
  console.log(req.body);
  let userId = req.session.user._id;
  console.log(userId);
  deleteCartItem(userId, req.body.proId, req.body.price , req.body.currentCount)
    .then((success) => {
      console.log(success);
      res.json({ success: true });
    })
    .catch((err) => {
      console.log(err);
      res.json({ success: false });
    });
});

/*

* categories page

*/

router.get("/categories", loginValidator, (req, res) => {
  res.render("user/categories", { layout: "user_layout", nav: true });
});

/*

* product view page

*/

router.get("/view-product/:id", (req, res) => {
    let id = req.params.id;
    let user = req.session.user;
    let total_count = 0;
    if(user){
      findCartProductCount(user._id).then((count) => {
        total_count = count;
      }).catch((err) => {
        console.log(err);
      })
    }else{
      total_count = 0;
    }
    findOneProduct(id)
      .then((product) => {
        console.log(product);
        res.render("user/view_product", {
          layout: "user_layout",
          nav: true,
          product,
          total_count,
          user
        });
        // res.json(product)
      })
      .catch((error) => {
        console.log(error);
      });
});


/**
 * 
 * Apply coupen start 
 * 

 */

router.post('/apply_coupen',(req,res) => {

  let user = req.session.user;
  console.log(req.body);
  let { coupenCode } = req.body;

  findCoupen({ coupenCode : coupenCode })
    .then((response) => {

      console.log(response);
      let check = response.users.find((e) => {
          return e._id == req.session.user._id;
      });

      let expiry = new Date(response.expiry_date);
      let today = new Date();

      let expiry_date = expiry.getDate();
      let now = today.getDate();

      if(!check && (expiry_date - now) >= 0 ){
        
        updateCoupen( user._id , response[0]._id ).then((resp) => {
          
          console.log(resp);
          res.json({ success : true , discount : response[0].offer_rate });
        
        })
          .catch((err) => {
  
            console.log(err);
            res.json({ success : false });
  
          })
      }else{

        res.json({ success : false});

      }

    })
    .catch((err) => {

      console.log(err);
      res.json({ success : false });

    })

});


/**
 * 
 * End coupen 
 * 

 */



/*

* orders Management

*/


router.get( '/checkout' , ( req , res ) => {

    let user = req.session.user;
    Promise.all([findCartProductCount(user._id),findAddress(user._id) , findOneUser(user.email)]).then((data) => {
      // console.log(data);
      let [ count , address , userData ] = data;
      findCart(user._id).then((cartData)=> {
        // console.log(cartData);
        res.render('user/checkout',{ nav : true , layout : 'user_layout' , cartData , userData , user , count , address})
      })
    }).catch((err) => {
      console.log(err);
    })
   

});

router.get('/filterOrders/:id',(req,res) => {

  let user = req.session.user;
  let filter = req.params.id;
  if( filter == "ascending"){

    findAllOrders({ user_id : req.session.user._id },1)
      .then((orderData) => {

      res.render('user/order_history',{ nav : true , layout : 'user_layout' , user , orderData , o : "Ascending"});        

    })
      .catch((err) => {

        console.log(err);
        res.render('user/order_history',{ nav : true , layout : 'user_layout' , user });        


      })

  }else{

    findAllOrders({ user_id : req.session.user._id },-1)
    .then((orderData) => {

    res.render('user/order_history',{ nav : true , layout : 'user_layout' , user , orderData , o : "Descending"});        

  })
    .catch((err) => {

      console.log(err);
      res.render('user/order_history',{ nav : true , layout : 'user_layout' , user });        


    })

  }

});


router.post("/orders", loginValidator, (req, res) => {
  

  let user = req.session.user;
  // console.log(req.body);
  let { data } = req.body;
  console.log("------data from the t--------");
  console.log(data);

  // data.forEach(element => {
  //   console.log(element);
  // });



  if(data.newAddress){

    addAddress( user._id , data )
      .then((f) => {
        console.log("reached there yes success");
        console.log(f);
          
          findCart(user._id)
           .then((cartData) => {
        
           placeOrder( cartData , user._id , f._id , data.paymentMethod , data.total_amount)
            .then((response) => {
             updateStock(cartData.products , true).then((e) => {

              console.log(e);
              if(data.paymentMethod == "Razor pay")
              {
                if(req.body.wallet == 'true'){
                  
                  let total = Number(response.total_prize) - Number(user.wallet);
                  useWallet(user._id).then((s) =>{
                    console.log(s);
                    generateRazorpay(response._id, total).then((orderData) => {
                      res.json({ orderData , razorPay : true });
                    }).catch((err) => {
                      console.log(err);
                      res.json({ codSuccess : false });
                    })
                  })
                }else{

                  generateRazorpay(response._id, response.total_prize).then((orderData) => {
                    res.json({ orderData , razorPay : true });
                  }).catch((err) => {
                    console.log(err);
                    res.json({ codSuccess : false });
                  })

                }
  
              }
              else if(data.paymentMethod == "Stripe"){

                if(req.body.wallet){
                  
                  let total = Number(data.total_amount) - Number(user.wallet);
                  useWallet(user._id)
                  .then((s) => {
                    console.log(s);
                    findCartProducts(user._id).then((cartDetail) => {
                      generateStripe(total)
                        .then((clientSecret) => {
    
                        res.json({ order_id : response._id , clientSecret , stripePay : true });
    
                      })
                        .catch((err) => {
                          
                          console.log(err);
                          res.json({ codSuccess : false })
    
                        })
                    })
                  })
                }else{

                  findCartProducts(user._id).then((cartDetail) => {
                    generateStripe(data.total_amount)
                      .then((clientSecret) => {
  
                      res.json({ order_id : response._id , clientSecret , stripePay : true });
  
                    })
                      .catch((err) => {
                        
                        console.log(err);
                        res.json({ codSuccess : false })
  
                      })
                  })

                }

              }
              else{
                res.json({codSuccess : true});
              }
        


             })
              
              .catch((err) => {

                console.log(err);
                res.json({ codSuccess : false });

              })
            // console.log(response);
            // res.redirect("/orders");
        
            })
            .catch((err) => {
          
            console.log(err);
          
          })
        })
          .catch((err) => {
  
          console.log(err);
       
        })
  
      
        
      }).catch((err) => {
        console.log(err);
      })


  }
  else{
    
    findOneAddress(data._id).then((details) => {
        
          findCart(user._id)
           .then((cartData) => {
        
           placeOrder( cartData , user._id , data._id , data.paymentMethod , data.total_amount)
            .then((response) => {
              updateStock(cartData.products , true).then((e) => {
                
                  if(data.paymentMethod == "Razor pay")
                  {
                    if(req.body.wallet == 'true'){
                      
                      let total = Number(response.total_prize) - Number(user.wallet);
                      generateRazorpay(response._id, total).then((orderData) => {
                        res.json({ orderData , razorPay : true });
                      }).catch((err) => {
                        console.log(err);
                        res.json({ codSuccess : false });
                      })
                    }else{
    
                      generateRazorpay(response._id, response.total_prize).then((orderData) => {
                        res.json({ orderData , razorPay : true });
                      }).catch((err) => {
                        console.log(err);
                        res.json({ codSuccess : false });
                      })
    
                    }
      
                  }
                  else if(data.paymentMethod == "Stripe"){
    
                    if(req.body.wallet){
                      
                      let total = Number(data.total_amount) - Number(user.wallet);
    
                      findCartProducts(user._id).then((cartDetail) => {
                        generateStripe(total)
                          .then((clientSecret) => {
      
                          res.json({ order_id : response._id , clientSecret , stripePay : true });
      
                        })
                          .catch((err) => {
                            
                            console.log(err);
                            res.json({ codSuccess : false })
      
                          })
                      })
                    }else{
    
                      findCartProducts(user._id).then((cartDetail) => {
                        generateStripe(data.total_amount)
                          .then((clientSecret) => {
      
                          res.json({ order_id : response._id , clientSecret , stripePay : true });
      
                        })
                          .catch((err) => {
                            
                            console.log(err);
                            res.json({ codSuccess : false })
      
                          })
                      })
    
                    }
    
                  }
                  else{
                    res.json({ codSuccess : true});
                  }
            
                // console.log(response);
                // res.json({success : true});
            


              })

              .catch((err) => {

                console.log(err);
                res.json({ codSuccess : false })
                

              })

            })
            .catch((err) => {
          
            console.log(err);
            res.json({ codSuccess : false });
  
          
          })
        })
          .catch((err) => {
  
          console.log(err);
          res.json({ codSuccess : false });
  
       
        })
  
  
    }).catch((err) => {
  
      console.log(err);
      res.json({ codSuccess : false });
      
  
    });

  }


});


router.get('/orders',(req,res) => {
  let user = req.session.user ;

  findOneOrder(user._id)
    .then((orderData) => {
      // console.log("------------ ordered data ------------");
      console.log(orderData);
      res.render('user/orders',{ nav : true , layout : 'user_layout' , user , orderData});
    
    })
    .catch((err) => {
    
      console.log(err);
    
    });
});

router.post('/orders/cancel-order', (req,res) => {
  // let id = req.params.id;
  let user = req.session.user;
  let { id , total_prize } = req.body;
  Promise.all([cancelOrder(id) , addWallet( user._id , total_prize)]).then((status) => {

    console.log(status);
    res.json({success : true});
  }).catch((err) => {
    console.log(err);
    // res.redirect('/orders');
    res.json({success : false});
  })
});


router.get('/order_history',(req,res) => {
  let user = req.session.user ;

  findAllUserOrders( user._id , -1)
    .then((orderData) => {
      // console.log(orderData);
      res.render('user/order_history',{ nav : true , layout : 'user_layout' , user , orderData});
    
    })
    .catch((err) => {
    
      console.log(err);
      res.render('user/order_history',{ nav : true , layout : 'user_layout' , user });

    });
});


router.post('/verify-order',( req , res ) => {
  console.log("verify order");
  console.log(req.body);
  let { payment ,order } = req.body;
  validatePayment(payment).then((response) => {
    updateOrderAndPaymentStatus(order.receipt , "paid" , "Order Placed").then((response) => {
      
      console.log(response);
      res.json({success : true});

    }).catch((err) => {

      console.log(err);
      res.json({success :false});

    })
  }).catch((err) => {

    console.log(err);
    res.json({ success : false });
    
  });

});


router.get('/stripeSuccess/:id',(req,res) => {

  let user = req.session.user;
  let id = req.params.id;
  console.log(id);
  updateOrderAndPaymentStatus(id,'paid','order placed')
    .then((response) =>{
      console.log(response);
      res.redirect('/orders');
  })
    .catch((err) => {

      console.log(err);
      res.render('user/checkout',{ nav : true , layout : 'user_layout' , user , error : "Payment Failed" });

    })

});


router.post('/PaymentFailed' , (req,res) => {

    console.log( " Id is ");
    console.log(req.body);
    let { id } = req.body;
    findOrder(id)
      .then((orderData) => {

        Promise.all([ deleteOrder(id) , updateStock(orderData.products , false) ])
          .then((status) => {
    
          res.json({ success : true });
    
        })
          .catch((err) => {
    
          console.log(err);
          res.json({ success : false });
    
        })
    })
      .catch((err) => {

        console.log(err);
        res.json({ success : false });

      })
})

/*

* track order page

*/

// router.get("/track_order", loginValidator, (req, res) => {
//   res.render("user/track_order", { layout: "user_layout", nav: true });
// });


/**
 * 
 * User Profile  Page
 * 
 */

router.get('/profile',(req,res) => {
  console.log("profile");
  console.log(req.session.user);
  let email = req.session.user.email;
  let userId = req.session.user._id;

  Promise.all([findOneUser(email),findAddress(userId), findCartProductCount(userId)]).then((data) => {

    let [ user , address , total_count ] = data; 
    console.log(user);
    console.log(address);

    res.render('user/profile',{nav : true , layout : 'user_layout' , user , address , total_count })
  })
    .catch((err) =>{
      
      console.log(err);
    Promise.all([ findOneUser(email),findAddress(userId) ]).then((data) => {
       
      let [ user , address ] = data;
      res.render('user/profile',{nav : true , layout : 'user_layout' , user , address , total_count:0 })
    })
      .catch((err) => {

          console.log(err);
          findOneUser(email).then((user) => {
            res.render('user/profile',{nav : true , layout : 'user_layout' , user , total_count:0 });
          })

      })  

  
    });
});


router.get('/edit-address/:id',(req,res) => {

  let user = req.session.user;
  let id = req.params.id;

  findCartProductCount(user._id).then((total_count) =>{
    findOneAddress(id).then((address) => {
      console.log(address);
      res.render('user/address',{ nav : true , layout: 'user_layout' , user , total_count , address });
    }).catch((err) => {
      console.log(err);
    })
  }).catch((err) => {
    console.log(err);
  })

});

router.post('/delete-address', (req,res) => {

  let { id } = req.body;
  deleteAddress(id)
    .then((status) => {

    console.log(status);
    res.json({success:true})
  
  })
    .catch((err)=> {

    console.log(err);
    res.json({success : false})
  
  })

});


router.get('/add-address',(req,res) => {

  let user = req.session.user;

  findCartProductCount(user._id)
    
    .then((total_count) => {

    res.render('user/add-address',{ nav : true , layout : 'user_layout' , user , total_count })

  })

    .catch((err) => {

      console.log(err);
      res.render('user/add-address',{ nav : true , layout : 'user_layout' , user , total_count : 0 })


    })

});


router.post('/add-address' , (req,res) => {

  let user = req.session.user;

  console.log(req.body);

  addAddress( user._id , req.body )
    .then((response) => {

    console.log(response);
    res.redirect('/profile')
  
  })
    .catch((err) =>{
      
      console.log(err);
  })

} )

router.get('/change-password', (req,res) => {

  let user = req.session.user;
  findCartProductCount(user._id)
    .then((total_count) =>{
    res.render('user/change-password',{ nav : true , layout : 'user_layout' , user , total_count })
  })
    .catch((err) => {
    console.log(err);
  });
});

router.post('/change-password', (req,res) => {

  let user = req.session.user;
  console.log(req.body);

  loginCheck( user.email , req.body.password_old ).then((response) => {

      updatePassword(user.email , req.body.password_new).then((status) => {

          console.log(status);
          res.redirect('/profile');

      }).catch((error) => {

        console.log(error);
        findCartProductCount(user._id).then((total_count) =>{

        res.render('user/change-password',{ nav : true , layout : 'user_layout' , user , total_count , error });
        })
      })

  }).catch((err) => {
    findCartProductCount(user._id).then((total_count) =>{

      let error = "Older Password doesn't matches , please check and enter again"
      res.render('user/change-password',{ nav : true , layout : 'user_layout' , user , total_count , error });
      
    })
      })

});

router.get('/change-phone', (req,res) => {

  let user = req.session.user;

  findCartProductCount(user._id).then((total_count) =>{
    
    res.render('user/change-phone',{ nav : true , layout : 'user_layout' , user , total_count });

  })
});

router.post('/send-phone' , (req,res) => {
  let user = req.session.user;
  let { phone } = req.body;
  sendOtp(phone , otp);
  let time = new Date();
  findCartProductCount(user._id).then((total_count) =>{
    
    res.render('user/phone_otp', { nav : true , layout : 'user_layout' , user , total_count , phone ,time });

  })
});

router.post('/change-phone', (req,res) => {
  
  let user = req.session.user;
  let { phone , time} = req.body;

  let old = new Date(time);
  let now = new Date();
  let oldTime = old.getTime();
  let nowTime = now.getTime(); 
  let diff = oldTime - nowTime;
  
  if(otp == req.body.otp ){
    if(diff <= 60000){

      updateUserDetails(user._id,{phone : phone}).then((state) => {

          res.redirect('/profile');

      }).catch((error) => {
          console.log(error);
          res.redirect('/profile');
      })
  }else{

    let time = new Date();
    findCartProductCount(user._id).then((total_count) =>{
    
      res.render('user/phone_otp', { nav : true , layout : 'user_layout' , user , total_count , phone ,time , error : "otp times out" });
  
    })
  }

}else{

  let time = new Date();
  findCartProductCount(user._id).then((total_count) =>{
    
    res.render('user/phone_otp', { nav : true , layout : 'user_layout' , user , total_count , phone ,time , error : "otp not matching" });

  })
}

});

//================== About page ================

router.get('/contact',(req,res) => {
  res.render('user/contact_us',{ layout : 'user_layout' , nav : true });
});


//logout

router.get("/logout", (req, res) => {
  delete req.session.user;
  req.logout();
  res.redirect("/");
});


module.exports = router;
