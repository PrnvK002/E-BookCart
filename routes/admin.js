var express = require("express");
var router = express.Router();

//================================== helpers ======================================


const { loginSchema, resetPasswordSchema } = require("../helpers/validator");
const { loginCheck, updatePassword, findAdmin , insertAdmin } = require("../helpers/admin_helper");
const { findUsers, updateUser, findCategory, deleteCategory, addCategory , findTotalUser } = require("../helpers/user_helper");
const { findProducts, updateProduct, insertProduct,  deleteProduct, findOneProduct, activateProduct , updateProductOffer , updateRemoveOffer , productSearch , findAdminProducts , findProductsCount } = require("../helpers/product_helper");
const { find, remove } = require("../models/admin");
const { findBanner, insertBanner, removeBanner } = require('../helpers/banner_helper');
const { sendMail } = require("../helpers/mail");
const { placeOrder , findOneOrder , cancelOrder , findAllOrders , updateDeliveryStatus , monthlyOrders , monthlyRevenue , yearlyOrders , yearlyRevenue , recentOrders , totalOrderCount , totalIncome , salesReport } = require('../helpers/order_helper');
const { findOffers , addOffer , removeOffer , updateOffer , addCoupen , removeCoupen , updateCoupen , findCoupen } = require('../helpers/offer_helper');

//=================================== Middle wares=====================================================

const otpGenerator = require("otp-generator");
const { upload_product , upload_banner } = require("../middleware/upload_file");
const { response } = require("express");
const cloudinary = require('../middleware/cloudinary');


/* GET home page. */
router.get("/", function (req, res, next) {

  let admin = req.session.admin;

  if (admin) {
    findAdmin(admin.email).then((admin) => {
      Promise.all([ recentOrders() , totalOrderCount() , totalIncome() , findTotalUser()])
        .then((response) => {

        let [ recentOrdersData , totalOrderCount , total_amount , totalUserCount ] = response;
          console.log(totalUserCount);

        res.render("admin/index", {
          layout: "admin_layout",
          nav: true,
          admin,
          recentOrdersData,
          totalOrderCount,
          total_amount,
          totalUserCount
        });
      })
      .catch((err) => {

        console.log(err);
        res.render("admin/index", {
          layout: "admin_layout",
          nav: true,
          admin,
          recentOrdersData : 0,
          totalOrderCount : 0,
          total_amount : 0,
          totalUserCount : 0
        });

      })
    });
  } else {
    res.redirect("/admin/login");
  }
});

/*
 ** Admin Login Section
 *
 */

router.get("/login", (req, res) => {
  res.render("admin/login", { layout: "admin_layout", nav: false });
});

router.post("/login", async (req, res) => {
  try {
    let validate = req.body;
    console.log(validate);
    let result = await loginSchema.validateAsync(validate);
    loginCheck(req.body)
      .then((data) => {
        req.session.admin = req.body;
        res.redirect("/admin");
      })
      .catch((error) => {
        res.render("admin/login", { layout: "admin_layout", nav: false , error : "Invalid Credentials please check and try again"});
      });
  } catch (error) {
    console.log(error);
    res.render("admin/login", { layout: "admin_layout", nav: false , error : "Invalid Credentials please check and try again"});
    
  }
});

//========================= forgot password section ====================================

router.get("/forgot_password", (req, res) => {
  res.render("admin/forgot_password", { layout: "admin_layout", nav: false });
});

let otp = otpGenerator.generate(6, {
  upperCaseAlphabets: false,
  specialChars: false,
  lowerCaseAlphabets: false,
});

router.get("/enter-otp", (req, res) => {
  console.log(req.query);
  let email = req.query.email;
  findAdmin(email)
    .then((data) => {
      sendMail(email, otp);
      res.render("admin/otp", { layout: "admin_layout", nav: false });
    })
    .catch((error) => {
      res.json(error);
      console.log(error);
    });
});

router.post("/enter-otp", (req, res) => {
  if (req.body.otp === otp) {
    res.redirect("/admin/reset_password");
  } else {
    let error = "invalid otp";
    res.json(error);
  }
});

router.get("/reset_password", (req, res) => {
  res.render("admin/reset_password", { layout: "admin_layout", nav: false });
});

router.post("/reset_password", async (req, res) => {
  try {
    console.log(req.body);
    const result = await resetPasswordSchema.validateAsync(req.body);
    updatePassword(req.body.email, req.body.password)
      .then((data) => {
        console.log(data);
        res.redirect("/admin");
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
 ** Admin manage User Section
 *
 */
router.get("/view-users", function (req, res, next){
  let admin = req.session.admin;
  findUsers().then((data) => {
    res.render("admin/view-users", {
      layout: "admin_layout",
      nav: true,
      users: data,
      admin
    });
  });
});


router.post("/updateblock", (req, res) => {

  console.log(req.body);
  
  let { id , blockStatus } = req.body;

  updateUser(id, blockStatus)
    .then((d) => {
      
      console.log(d);
      res.json({ success : true });

    })
    .catch((err) => {

      console.log(err);
      res.json({ success : false });

    });
});


/*
 ** Admin manage products Section
 *
 */
router.get("/products", function (req, res, next) {
  let admin = req.session.admin;
  Promise.all([findAdminProducts( {} , 4 , 0 ,  "price" , 1) , findProductsCount() ]).then((data) => {
    // console.log(data);
    // let datas = data.toArray();
    // findCategory
    // console.log(data);
    let [ products , totalCount ] = data;
    let length = totalCount/4;
    let pagination = [];
    
    for( i = 1 ; i <= length +1 ; i++){

        pagination.push(i);

    }

    // console.log(pagination);

    res.render("admin/view-products", {
      layout: "admin_layout",
      nav: true,
      products,
      admin,
      pagination
    });
  });
});

//========================== Filter products on price ====================

router.get('/productFilter/:filter/:order' , (req,res) => {

  let admin = req.session.admin;
  let filter = req.params.filter;
  let order = req.params.order;

  if(filter == "price"){

    if( order == "ascending" ){

      let o = "Ascending";
      findAdminProducts( {} , 4 , 0 , "price" , 1 )
        .then((products) => {

          res.render("admin/view-products", {
            layout: "admin_layout",
            nav: true,
            products,
            admin,
            o
          });          

        })
        .catch((err) => {

          res.render("admin/view-products", {
            layout: "admin_layout",
            nav: true,
            admin
          });   

        })

    }else{

      let o = "Descending";
      findAdminProducts( {} , 4 , 0 , "price" , -1 )
        .then((products) => {

          res.render("admin/view-products", {
            layout: "admin_layout",
            nav: true,
            products,
            admin,
            o
          });          

        })
        .catch((err) => {

          res.render("admin/view-products", {
            layout: "admin_layout",
            nav: true,
            admin
          });   

        })


    }


  }else{

    if( order == "ascending" ){
      let o = "Ascending";
      findAdminProducts( {} , 4 , 0 , "stock" , 1 )
        .then((products) => {

          res.render("admin/view-products", {
            layout: "admin_layout",
            nav: true,
            products,
            admin,
            o
          });          

        })
        .catch((err) => {

          res.render("admin/view-products", {
            layout: "admin_layout",
            nav: true,
            admin
          });   

        })

    }else{

      let o = "Descending";
      findAdminProducts( {} , 4 , 0 , "stock" , -1 )
        .then((products) => {

          res.render("admin/view-products", {
            layout: "admin_layout",
            nav: true,
            products,
            admin,
            o
          });          

        })
        .catch((err) => {

          res.render("admin/view-products", {
            layout: "admin_layout",
            nav: true,
            admin
          });   

        })


    }

  }


})


router.post('/searchProduct',(req,res) => {

  let admin = req.session.admin;
  let { searchProduct } = req.body;
  productSearch(searchProduct)
    .then((products) => {
      res.render("admin/view-products", {
        layout: "admin_layout",
        nav: true,
        products,
        admin
      });
  })
    .catch((err) => {
      
      console.log(err);
      res.render("admin/view-products", {
        layout: "admin_layout",
        nav: true,
        admin
      });

    })

})


router.get('/products/:id',(req,res) => {
  
  let admin = req.session.admin;

  let id = req.params.id;

  let skip = (( id - 1 ) * 4) ;

  Promise.all([findAdminProducts({},4, skip , "price" , 1) , findProductsCount() ])
    .then((data) => {

      let [ products , totalCount ] = data;
      let length = totalCount/4;
      let pagination = [];
      
      for( i = 1 ; i <= length ; i++){
  
          pagination.push(i);
  
      }
  

      res.render("admin/view-products", {
        layout: "admin_layout",
        nav: true,
        products,
        admin,
        pagination
      });
  })
    .catch((err) => {

      res.render("admin/view-products", {
        layout: "admin_layout",
        nav: true,
        admin
      });

    })

})

//====================== add Product ==============================

router.get("/add-products", function (req, res, next) {
  let admin = req.session.admin;
  findCategory()
    .then((data) => {
      res.render("admin/add-products", {
        layout: "admin_layout",
        nav: true,
        category: data,
        admin
      });
    })
    .catch((error) => {
      console.log(error);
    });
});

router.post(
    "/add-products", upload_product.fields([{name : 'product_image1'},{name : 'product_image2'},{name : 'product_image3'}]) ,async (req, res, next) => {
   
    try{

      let image1 = req.files.product_image1[0].path;
      let image2 = req.files.product_image2[0].path;
      let image3 = req.files.product_image3[0].path;

      let result1 = await cloudinary.uploader.upload(image1);
      let result2 = await cloudinary.uploader.upload(image2);
      let result3 = await cloudinary.uploader.upload(image3);


    let products = req.body;
    let images = [result1.url , result2.url , result3.url ];
    // let images = req.file.filename;
    console.log("images");
    console.log(images); 
    insertProduct(products, images)
      .then((data) => {
        console.log(data);
        res.redirect("/admin/products");
      })
      .catch((error) => {
        console.log(error);
        // throw error;
      });

    }
    catch(err){

      console.log(err);
      res.redirect('/admin/products')

    }
      
  }
);

//======================= edit Product section =====================

router.get("/edit-product/:id", function (req, res, next) {
  let admin = req.session.admin;
  let id = req.params.id;
  findOneProduct(id)
    .then((product) => {
      findCategory()
        .then((category) => {
          res.render("admin/edit-products", {
            layout: "admin_layout",
            nav: true,
            product,
            category,
            admin
          });
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      console.log(error);
    });
});

router.post("/edit-products",upload_product.fields([{name : 'product_image1'},{name : 'product_image2'},{name : 'product_image3'}]) ,async function (req, res, next) {
  let products = req.body;
    // let images = req.file.filename;

  // console.log(req.body);
  console.log(req);
  let images = [];

  try{

  if(req.files){
    
    let  image1 = req.files.product_image1[0].path || req.body.image1 ;
    let  image2 = req.files.product_image2[0].path || req.body.image2 ;
    let  image3 = req.files.product_image3[0].path || req.body.image3 ;

    let result1 = await cloudinary.uploader.upload(image1);
    let result2 = await cloudinary.uploader.upload(image2);
    let result3 = await cloudinary.uploader.upload(image3);

    console.log(result1 ,result2 , result3 );
    images = [result1.url , result2.url , result3.url ];


  }

  console.log(images);
  // req.files.forEach((e) => {
  //     images.push(e.filename);
  //   });  
  updateProduct(products,images)
    .then((data) => {
      console.log(data);
      res.redirect("/admin/products");
    })
    .catch((error) => {

      console.log(error);
      res.redirect("/admin/products");

      // throw error;
    });

  }
  catch(err){

    console.log(err);

  }

});

router.post("/products/delete_product/", (req, res) => {
  // let id = req.params.id;
  let { id } = req.body;
  deleteProduct(id)
    .then((data) => {
      console.log(data);
      // res.redirect('/admin/products')
      res.json({ success : true });
    })
    .catch((error) => {
      console.log(error);
    });
});


router.get('/products/activate_product/:id',(req,res) => {
  let id = req.params.id;
  activateProduct(id).then((state) => {
    console.log(state);
    res.redirect('/admin/products');
  }).catch((err) => {
    console.log(err);
  });
});



/*
 ** Admin profile Section
 *
 */

router.get("/profile", function (req, res, next) {
  res.render("admin/profile", { layout: "admin_layout", nav: true });
});

/**
 * 
 *  Category Management 
 * 
 */

router.get("/view-category", (req, res) => {
  let admin = req.session.admin;
  findCategory()
    .then((data) => {
      res.render("admin/view_category", {
        layout: "admin_layout",
        nav: true,
        category: data,
        admin
      });
    })
    .catch((error) => {
      console.log(error);
    });
});


router.post("/add-category", (req, res) => {

  console.log(req.body);
  let admin = req.session.admin;
  let { categoryName } = req.body;
  findCategory().then((check) => {
    // console.log(check);
    let status = check.filter((c) => {
      return c.categoryName == categoryName
    });

    console.log("status");
    console.log(status);

    if(status.length == 0){
      addCategory(categoryName)
        .then((data) => {
          console.log(data);
          // res.redirect("/admin/category");
          res.json({success:true});
        })
        .catch((error) => {
          console.log(error);
        });
    }
    else{
      // res.render("admin/view_category", {
      //   layout: "admin_layout",
      //   nav: true,
      //   category: check,
      //   admin,
      //   error : "Category already exists"
      // });  
      res.json({success:false});

    }
  })
});

router.post("/category/delete-category", (req, res) => {
  // let id = req.params.id;
  let id = req.body.id;

  deleteCategory(id)  
    .then((status) => {

      console.log(status);
      res.json({success : true});
    
    })
    .catch((err) => {

      console.log(err);
      res.json({success : true});
    
    });
});


/**
 * 
 * Offer management Section start
 * 
 */


router.get('/view_offers',( req , res ) => {

  let admin = req.session.admin;
  findOffers({})
    .then((offers) => {
    
      console.log(offers);
      res.render('admin/view_offers',{ layout : 'admin_layout' , nav : true , admin , offers  })

  }).catch((err) => {
    
    console.log(err);

    res.render('user/view_offers',{ layout : 'admin_layout' , nav : true , error : "Cannot find any offers" , admin })

  })

});


router.get('/add-offers',( req , res ) => {
  
  let admin = req.session.admin;

  Promise.all([ findProducts({}) , findCategory() ])
    
    .then((data) => {

        let [ products , categories ] = data;

        res.render('admin/add_offers', { layout : 'admin_layout' , nav :true , admin , categories , products } );

  })
    .catch((err) => {

        console.log(err);

    });
});

router.post('/add_offers', ( req , res ) => {

  let admin = req.session.admin;

  console.log(req.body);
  
  let { isProduct , isCategory } = req.body;

  if(isProduct){

    findOneProduct(req.body.product).then((product) => {
      
        Promise.all([ updateProductOffer( req.body.product   , req.body.offer_rate , false , product.price ) , addOffer(req.body) ])
          
          .then((response) => {
    
              console.log(response);
    
    
            res.redirect('/admin/view_offers')
    
      })
        .catch((err) => {
        
            console.log(err);
            res.render('admin/add_offers', { layout : 'admin_layout' , nav :true , error : "Erro occured while adding this offer " , admin } );
  
      })


    })


  }
  else if(isCategory){

    Promise.all([ updateProductOffer( req.body.category , req.body.offer_rate , true ) , addOffer(req.body) ])
      
      .then((response) => {

        console.log(response);

      res.redirect('/admin/view_offers')

})
  .catch((err) => {
  
      console.log(err);
      res.render('admin/add_offers', { layout : 'admin_layout' , nav :true , error : "Erro occured while adding this offer " , admin } );



})

  }

});

router.post('/remove_offer' , ( req , res ) => {

  let { id , category_id , product , isCategory , isProduct } = req.body;

  if(isCategory == 'true'){
    
    Promise.all([removeOffer(id) , updateRemoveOffer( category_id , true )])
  
      .then((response) => {
        
        console.log(response);
        res.json({ success : true });
  
    })
      .catch((err) => {
  
        console.log(err);
        res.json({ success : false });
  
      });


  }else if(isProduct == 'true'){

    console.log("products");
    console.log(product);
    Promise.all([removeOffer(id) , updateRemoveOffer( product , false )])
  
    .then((response) => {
      
      console.log(response);
      res.json({ success : true });

  })
    .catch((err) => {

      console.log(err);
      res.json({ success : false });

    });    

  }


});

router.get('/edit_offer/:id',( req , res ) => {
  
  let admin = req.session.admin;
  let id = req.params.id;
  findOffers({ _id : id })
    .then((offer) => {

    res.render('admin/edit-offer',{ layout : 'admin_layout' , nav : true , admin , offer})

  })
    .catch((err) => {

    console.log(err);

  });

});

router.post('/edit_offer',( req , res ) => {

    updateOffer(req.body)
      .then((state) => {

        console.log(state);
        res.redirect('/admin/view_offers');
    
    })
      .catch((err) => {

          console.log(err);
          res.redirect('/admin/view_offers');
          

    });
  
});

/**
 * 
 * Offer management Section end
 * 
 */


/**
 * 
 *  Coupen Management Start
 * 
 */

router.get('/view_coupens', ( req , res ) => { 

    let admin = req.session.admin;
    findCoupen({})
      .then((coupens) => {

      res.render('admin/view_coupens',{ layout : 'admin_layout' , nav :true , admin , coupens });

    })
      .catch((err) => {

        console.log(err);
        res.render('admin/view_coupens',{ layout : 'admin_layout' , nav :true , admin  });


      })

 });

 router.get('/add_coupens',(req,res) => {

  let admin = req.session.admin;
  res.render('admin/add_coupen',{ nav : true , layout : 'admin_layout' , admin });

 });

 router.post('/add_coupens',(req,res) => {

  let admin = req.session.admin;

  console.log(req.body);
  addCoupen(req.body)
    .then((response) => {

    console.log(response);
    res.redirect('/admin/view_coupens');

   })
      .catch((err) => {

        console.log(err);
        res.render('admin/add_coupen',{ nav : true , layout : 'admin_layout' , admin , err });


      });

 });

 router.post('/remove_coupen',(req,res) => {

    console.log(req.body);
    let { id } = req.body;
    removeCoupen(id)
      .then((response) => {

          console.log(response);
          res.json({ success : true });

      }) 
        .catch((err) => {

          console.log(err);
          res.json({ success : false });

        });

 })



/**
 * 
 *  Coupen Management End
 * 
 */


/*

*** Banner management Section

*/


router.get('/view-banners',(req,res) => {

  let admin = req.session.admin;


  findBanner().then((data) => {

    res.render('admin/view_banners',{layout : 'admin_layout',nav : true, data , admin});

  }).catch((err) => console.log(err));
});

router.post('/add-banner',upload_banner.single("offer_banner"),async (req,res) => {
  
  try{

    console.log(req.body);
    console.log(req.file);
    let image = req.file.path;

    let result = await cloudinary.uploader.upload(image);

    let { expiry_date } = req.body; 
    insertBanner(result.url,expiry_date).then((response) => {
      console.log(response);
      res.redirect('/admin/view-banners');
    }).catch((err) => {
      console.log(err);
    })

  }catch(err){

    console.log(err);

  }

  
});

router.post('/remove-banner',(req,res) => {
  console.log(req.body);
  let { id } = req.body;
  removeBanner(id).then((response) => {
    console.log(response);
    res.json({sucess : true});
  }).catch((err) => {
    console.log(err);
    res.json({sucess : false});
  });
});



/*

*** Banner management Section end

*/




/**
 * 
 * * Order Management
 * 
 */


 router.get('/view-orders',(req,res) => {
  let admin = req.session.admin ;

  findAllOrders({},1)
    .then((orderData) => {
      console.log(orderData);
      res.render('admin/view-orders',{ nav : true , layout : 'admin_layout' , admin , orderData});
    
    })
    .catch((err) => {
    
      console.log(err);
    
    })
});

router.post('/orders/cancel-order', (req,res) => {
  // let id = req.params.id;
  let {id} = req.body;
  cancelOrder(id).then((status) => {
    console.log(status);
    // res.redirect('/view-orders');
    res.json({success : true});
  }).catch((err) => {
    console.log(err);
    res.json({success : false});
    // res.redirect('/view-orders');
  })
});

router.post('/update_status',(req,res) => {

   console.log(req.body);
   let { order_id , order_status } = req.body;
    updateDeliveryStatus( order_id , order_status)
      .then((state) => {
          console.log(state);
          res.redirect('/admin/view-orders');

      })
      .catch((err) => {

          console.log(err);
          res.redirect('/admin/view-orders');
        
    });

})

router.get('/filterOrders/:id',(req,res) => {

  let admin = req.session.admin;
  let filter = req.params.id;
  if( filter == "ascending"){

    findAllOrders({ user_id : req.session.user._id },1)
      .then((orderData) => {

      res.render('admin/view-orders',{ nav : true , layout : 'admin_layout' , admin , orderData , o : "Ascending" });        

    })
      .catch((err) => {

        console.log(err);
        res.render('admin/view-orders',{ nav : true , layout : 'admin_layout' , admin });        

      })

  }else{

    findAllOrders({ user_id : req.session.user._id },-1)
    .then((orderData) => {

      res.render('admin/view-orders',{ nav : true , layout : 'admin_layout' , admin , orderData , o : "Descending" });        

  })
    .catch((err) => {

      console.log(err);
      res.render('admin/view-orders',{ nav : true , layout : 'admin_layout' , admin });        


    })

  }

})



/**
 * 
 * * Order Management end
 * 
 */

/**
 * 
 * Chart section start
 * 
 */

router.get('/getGraph/:id',(req,res) => {

  let id = req.params.id;

  if( id == "yearlyOrderGraph" ){

    yearlyOrders()
      .then((data) => {

        console.log(data);
      res.json({ orderCount : data });

    })
      .catch((err) => {

        console.log(err);
        res.json({  });

      })

  }else if( id == "monthlyOrderGraph"){

      monthlyOrders()
        .then((data) => {

          console.log(data);
        res.json({ orderCount : data });

      })
        .catch((err) => {
          
          console.log(err);
          res.json({});


        })

  }else if( id == "monthlyRevenueGraph" ){

        monthlyRevenue()
          .then((data) => {
            
            console.log(data);
            res.json({ revenueData : data });

        })
          .catch((err) => {

            console.log(err);
            res.json({});

          })
  }else if( id == "yearlyRevenueGraph" ){

          yearlyRevenue()
            .then((data) => {

              console.log(data);
              res.json({ revenueData : data });

          })
            .catch((err) => {

              console.log(err);
              res.json({});

            })
  }

})


/**
 * 
 * Chart section end
 * 
 */


/**
 * 
 *   Sales Report start
 * 
 * 
 */

router.get('/salesReport/:from/:to' , (req,res) => {

  let from = req.params.from;
  let to = req.params.to;
  console.log(from , to);
  let admin = req.session.admin;

  salesReport( from , to )
    .then((salesReport) => {

      console.log(salesReport);
      res.render('admin/salesReport' , { layout : 'admin_layout' , nav : true , admin , salesReport });

  })
    .catch((err) => {

      console.log(err);
      res.render('admin/salesReport' , { layout : 'admin_layout' , nav : true });

    });

})


/**
 * 
 *   Sales Report end
 * 
 * 
 */

/*

*** log Out

*/ 

router.get("/logout", (req, res) => {
  delete req.session.admin;
  res.redirect("/admin/login");
});

module.exports = router;
