const express = require("express");
const dbConnect = require("./config/dbConnect");
const authRouter = require("./routes/authRoutes");
const productRouter = require("./routes/productRoutes");
const categoryRouter = require("./routes/productCategoryRoute");
const brandRouter = require("./routes/brandRoutes");
const uploadRouter = require("./routes/uploadRoutes");
const { notFound, errorHandler } = require("./middleware/errorHandler");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

require("dotenv").config();

const PORTS = process.env.PORTES || 5000;
dbConnect();
app.use(morgan("dev"));
app.use(bodyParser.json()); // Use built-in middleware
// app.use(express.urlencoded({ extended: false })); // Use built-in middleware
// Enable CORS for all routes
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false })); // Use built-
app.use(cookieParser());

app.use("/api/user", authRouter);

app.use("/api/product", productRouter);

app.use("/api/category", categoryRouter);

app.use("/api/brand", brandRouter);

app.use("/api/upload", uploadRouter);

app.use(notFound);

app.use(errorHandler);

app.listen(PORTS, () => {
  console.log("Server running on port " + PORTS);
});
