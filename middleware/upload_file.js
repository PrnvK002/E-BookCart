const multer = require("multer");

//setting up multer
// const product_storage = multer.diskStorage({
 
//   filename: function (req, file, cb) {
//     const ext = file.mimetype.split("/")[1];
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, `${file.fieldname}-${uniqueSuffix}.${ext}`);
//   },
// });

const product_fileFilter = (req, file, cb) => {
  console.log(file);
  if (
    file.mimetype.split("/")[1] === "jpg" ||
    file.mimetype.split("/")[1] === "png" ||
    file.mimetype.split("/")[1] === "jpeg"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Not a png/jpg/jpeg"), false);
  }
};

const upload_product = multer({ storage: multer.diskStorage({}),fileFilter: product_fileFilter });




const banner_fileFilter = (req, file, cb) => {
  if (
    file.mimetype.split("/")[1] === "jpg" ||
    file.mimetype.split("/")[1] === "png" ||
    file.mimetype.split("/")[1] === "jpeg"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Not a png/jpg/jpeg"), false);
  }
};


const upload_banner = multer({ storage : multer.diskStorage({}), fileFilter : banner_fileFilter });




module.exports = { upload_product , upload_banner};
