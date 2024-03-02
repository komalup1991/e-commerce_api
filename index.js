const express = require("express");
const app = express();
const dotenv = require("dotenv");
const userRoute = require("./routes/user");
const sequelize = require("./db/database");

dotenv.config();

app.use(express.json());
app.use("/api/users", userRoute);

sequelize.sync().then(() => {
  console.log("Database Initialized!!");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running on port 3000");
});
