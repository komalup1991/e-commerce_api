const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const userRoute = require("./users/user");
const productRoute = require("./products/product");
const cartRoute = require("./cart/cart");
const orderRoute = require("./orders/order");
const sequelize = require("./db/database");
const userAuth = require("./routes/auth");
const review = require("./review/review");
const analytics = require("./analytics/analytics");
const stripeRoute = require("./payment/stripe");
const flickrRoute = require("./flickr/flickr");
const cors = require("cors");

app.use(
  cors({
    // credentials: true,
    // origin: process.env.FRONTEND_URL,
  }),
);

// app.use(express.static("public"));
app.use(express.json());
app.use("/api/users", userRoute);
app.use("/api/auth", userAuth);
app.use("/api/products", productRoute);
app.use("/api/cart", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api/review", review);
app.use("/api/analytics", analytics);
app.use("/api/checkout", stripeRoute);
app.use("/api/flickr", flickrRoute);

sequelize.sync().then(() => {
  console.log("Database and tables created!");
});

app.listen(process.env.PORT || 4000, () => {
  console.log("Server is running on port 4000");
});
