const Listing = require("../models/listing");

module.exports.index = async (req,res)=>{
    let alldata = await Listing.find();
    res.render("./listings/index.ejs", {alldata});  
}
module.exports.renderNewFrom = (req,res)=>{
    res.render("./listings/new.ejs");
}
module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
    const data = await Listing.findById(id).populate({path:"reviews", populate:{path:"author"}}).populate("owner");
    if(!data){
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listings");
    }
    res.render("./listings/show.ejs", {data});  
}
module.exports.createListing = async (req,res)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    let list = new Listing(req.body.listings);
    list.image = {url, filename}
    list.owner = req.user._id;
    await list.save();
    req.flash("success", "New Listing Created");
    res.redirect("./listings");
}
module.exports.renderEditform = async (req,res)=>{
    let {id} = req.params;
    let data = await Listing.findById(id);
    if(!data){
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listings");
    }
    let originalUrl = data.image.url;
    originalUrl = originalUrl.replace("/upload", "/upload/w_150");
    req.flash("success", "Listing Updated");
    res.render("./listings/edit.ejs", {data, originalUrl});
}
module.exports.updateListing = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listings},{runValidators:true});
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    }

    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
}
module.exports.destroyListing = async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
}