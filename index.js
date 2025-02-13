const express = require("express");
const sequelize = require("./config/connection");
const authentication = require("./routes/authentication");
const category = require("./routes/category");
const product = require("./routes/product");
const order = require("./routes/order");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
app.use(express.json());
app.use("/api/auth", authentication);
app.use("/api/category", category);
app.use("/api/product", product);
app.use("/api/order", order);

sequelize
  .sync({ force: false })
  .then(() => console.log("Database synced successfully"))
  .catch((error) => console.error("Error syncing database:", error));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
