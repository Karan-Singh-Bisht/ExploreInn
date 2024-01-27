const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding'); //geocoding links
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

//Index Route
module.exports.index = async(req,res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
};

//New Route
module.exports.renderNewForm = (req,res) =>{
    res.render("listings/new.ejs");
};

//Show Route
module.exports.showListing = async(req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner"); //Important
    if(!listing){
        req.flash("error","Listing does not exist!");
        res.redirect("/listing");
    }
    res.render("listings/show.ejs", { listing });
};

//Create Route
module.exports.createListing = async(req,res,next) => {
    let response = await geocodingClient.forwardGeocode({  /**Code for Geocoding */
        query: req.body.listing.location,
        limit: 1,
      })
        .send();                                    /**Till here */

    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);  //Final Form of error handling
    newListing.owner = req.user._id;
    newListing.image = {url,filename}; 

    newListing.geometry = response.body.features[0].geometry;

    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listing");
};

//Edit Route
module.exports.renderEditForm = async(req,res)=> {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing does not exist!");
        res.redirect("/listing");
    }
    let originalImageURL = listing.image.url;
    let newImageURL = originalImageURL.replace("/upload","/upload/w_250"); //Blurring Image on edit form
    res.render("listings/edit.ejs",{listing,newImageURL});
};

//Update Route
module.exports.updateListing = async(req,res)=>{
    let{id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});  //deconstructing

    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename};
        await listing.save();
    }

    req.flash("success","Listing Updated!");
    res.redirect(`/listing/${id}`);
};

//Delete Route
module.exports.destroyListing = async(req,res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted!");
    res.redirect("/listing");
};