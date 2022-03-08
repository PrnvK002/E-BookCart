const express = require("express");
const dotenv = require("dotenv");
const hbs = require("express-handlebars");
const bodyParser = require("body-parser");
const session = require("express-session");
const logger = require("morgan");
const passport = require("passport");
var path = require("path");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");

// Database Connection integration
const connectDB = require("./config/connection");

//load config
dotenv.config({ path: "./config/config.env" });

//database connection establishing
connectDB();

const userRouter = require("./routes/user");
const adminRouter = require("./routes/admin");

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//setting up logger
app.use(logger("dev"));

//view engine setting
app.engine(
  "hbs",
  hbs.engine({
    extname: "hbs",
    defaultLayout: "layout",
    layoutsDir: __dirname + "/views/layouts/",
    partialsDir: __dirname + "/views/partials/",
  })
);
app.set("layout", "./layouts/layout");
app.set("view engine", ".hbs");
app.set("views", "./views");

//setting default static folder as public folder
app.use(express.static(path.join(__dirname, "public")));

//sessions
app.use(
  session({
    secret: "top secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  })
);

// Adding passport middleware and session
app.use(passport.initialize());
app.use(passport.session());

//cache controller
// setting no cache
app.use((req, response, next) => {
  response.set("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
  next();
});
//route setting
app.use("/", userRouter);
app.use("/admin", adminRouter);

//=================== Error handling middleware ====================
app.use((req, res, next) => {
  res.statusCode = 404;
  throw new Error("Not Found");
  next();
});
app.use((err, req, res, next)=> {
  // set locals, only providing error in development
  res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};
  // console.log(err);
  // render the error page
  // console.log(er);
  // console.log("error status", err.code);
  // console.log(res.statusCode);
  res.statusCode = res.statusCode || 500;
  res.render("error", { layout: "user_layout" , nav : true });
  
});

const PORT = process.env.PORT || 5000;
app.listen(
  PORT,
  console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
