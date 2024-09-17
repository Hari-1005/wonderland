if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}
const express = require('express');
const app = express();
const mongoose = require('mongoose');
// const Listing = require("./models/listing.js");
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
// const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
// const {listingSchema, reviewSchema} = require("./schema.js");
// const Review = require("./models/review.js");
const session = require('express-session'); //express-session
const flash = require('connect-flash'); // connect-flash
const User = require("./models/user.js"); // user model
const passport = require("passport");
const LocalStrategy = require("passport-local");
const MongoStore = require('connect-mongo');

const listingRouter = require("./routers/listing.js");
const reviewRouter = require("./routers/review.js");
const userRouter = require("./routers/user.js");

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, 'public')));

const dbUrl = process.env.ATLASDB_URL;

main()
.then(()=>{
    console.log("connected to DB");
    })
.catch((err)=>{
    console.log(err);
    });

async function main(){
    await mongoose.connect(dbUrl);
}

// mongo-session
const store = MongoStore.create({
    mongoUrl : dbUrl,
    crypto: {
        secret: process.env.SECRET
      },
      touchAfter: 24 * 3600,
});

store.on("error", ()=>{
    console.log("ERROR in MONGO SESSION STORE", error);
});

// session-options
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}



app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.curUser = req.user;
    next();
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// all routes
app.all("*", (req,res,next) =>{
    next(new ExpressError(404, "Page Not Found"));
})

// error handling middleware
app.use((err,req,res,next) => {
    let {status = 500, message = "something is wrong"} = err;
    res.status(status).render("./listings/error.ejs",{message});
})
// server running at given PORT
app.listen(8080, ()=>{
    console.log("server connected at 8080");
});