const express = require("express");
const app = express();
const dotenv = require("dotenv");
const userRoute = require("./users/user");
const productRoute = require("./products/product");
const cartRoute = require("./cart/cart");
const sequelize = require("./db/database");
const userAuth = require("./routes/auth");

dotenv.config();

app.use(express.json());
app.use("/api/users", userRoute);
app.use("/api/auth", userAuth);
app.use("/api/products", productRoute);
app.use("/api/cart", cartRoute);

sequelize.sync().then(() => {
  console.log("Database Initialized!!");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running on port 3000");
});
