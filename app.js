const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const Listing = require("../Zariya/models/listing.js")


main()
    .then(console.log("connected to DB"))
    .catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/Zariya');
}

app.get("/", (req, res) => {
  res.send("Hi, I'm root");
});

// sample testing
app.get("/testListing", async (req, res) => {
  let sampleListing = new Listing({
    title: "Mehmaan",
    description: "By the Beach",
    price: 120000,
    location: "Baga Beach",
    country: "India"
  });
  await sampleListing.save();
  console.log("sample was saved");
  res.send("Successful!")
});

app.listen(port, () => {
  console.log(`listening to port ${port}`);
});
