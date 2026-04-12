const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const Listing = require("../Zariya/models/listing.js");
const path = require('path');

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));


main()
    .then(console.log("connected to DB"))
    .catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/Zariya');
}

app.get("/", (req, res) => {
  res.send("Hi, I'm root");
});

// index route
app.get("/listings", async (req, res) => {
  let allListings = await Listing.find({});
  res.render("listing/index.ejs", {allListings});
})

// add route
app.get("/listings/new", (req, res) => {
  res.render("listing/new.ejs");
})

// create route
app.post("/listings", async (req, res) => {
  let newListing = await new Listing(req.body.listing);
  newListing.save();
  res.redirect("/listings");
})

// show route
app.get("/listings/:id", async (req, res) => {
  let {id} = req.params;
  let listing = await Listing.findById(id);
  res.render("listing/show.ejs", {listing})
})

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

app.listen(port, () => {
  console.log(`listening to port ${port}`);
});
