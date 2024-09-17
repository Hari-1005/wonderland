const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validatelisting } = require("../middleware.js");
const listingController = require("../controllers/listings.js");

const multer  = require('multer')
const {storage} = require("../cloudinaryConfig.js")
const upload = multer({ storage })

router
    .route("/")
    // index route
    .get(wrapAsync(listingController.index))
    // create route
    .post(isLoggedIn, upload.single('listings[image]'), validatelisting, wrapAsync(listingController.createListing));

// new route
router.get("/new",isLoggedIn, listingController.renderNewFrom);

router
    .route("/:id")
    // show route
    .get(wrapAsync(listingController.showListing))
    // update route
    .put(isLoggedIn,isOwner,upload.single('listings[image]'), validatelisting, wrapAsync(listingController.updateListing))
    // Delete route
    .delete(isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));



// edit route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.renderEditform));

module.exports = router;