const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const Listing = require("../Zariya/models/listing.js");
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync.js');
const ExpressError = require('./utils/ExpressError.js');
const {listingSchema} = require('./schema.js');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


main()
    .then(console.log("connected to DB"))
    .catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/Zariya');
};

app.get("/", (req, res) => {
  res.send("Hi, I'm root");
});

// index route
app.get("/listings", wrapAsync(async (req, res) => {
    let allListings = await Listing.find({});
    res.render("listing/index.ejs", {allListings});
}));

// add route
app.get("/listings/new", (req, res) => {
  res.render("listing/new.ejs");
});

// create route
app.post("/listings", wrapAsync(async (req, res, next) => {
  let result = listingSchema.validate(req.body);
  console.log(result);

  if(result.error){
    throw new ExpressError(400, result.error);
  }
  
  let newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
}));

// edit route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
  let {id} = req.params;
  let listing = await Listing.findById(id);
  res.render("listing/edit.ejs", {listing});
}));

// update route
app.put("/listings/:id", wrapAsync(async (req, res) => {
  let {id} = req.params;
  await Listing.findByIdAndUpdate(id, {...req.body.listing});
  res.redirect(`/listings/${id}`);
}));

// delete route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
  let {id} = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
}));

// show route
app.get("/listings/:id", wrapAsync(async (req, res) => {
  let {id} = req.params;
  let listing = await Listing.findById(id);
  res.render("listing/show.ejs", {listing});
}));

// sample testing
// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "Mehmaan",
//     description: "By the Beach",
//     price: 120000,
//     location: "Baga Beach",
//     country: "India"
//   });
//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("Successful!")
// });

app.use((req, res, next) => {
  next(new ExpressError(404, "Page not found :("));
})

// custom error handler for handling db errors
app.use((err, req, res, next) => {
  let {statusCode = 500, message = "Something went wrong!"} = err;
  res.render("error.ejs", {message})
})

app.listen(port, () => {
  console.log(`listening to port ${port}`);
});
