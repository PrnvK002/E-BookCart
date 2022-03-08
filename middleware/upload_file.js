const multer = require("multer");

//setting up multer
const product_storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images/products");
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split("/")[1];
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}.${ext}`);
  },
});

const product_fileFilter = (req, file, cb) => {
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

const upload_product = multer({ storage: product_storage, fileFilter: product_fileFilter });


//setting up multer
const banner_storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images/offers");
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split("/")[1];
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}.${ext}`);
  },
});

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


const upload_banner = multer({ storage : banner_storage, fileFilter : banner_fileFilter });


module.exports = { upload_product , upload_banner};
