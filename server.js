const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const formData = require("express-form-data");
const { stream } = require("./utils/logger");
dotenv.config();

const app = express();

// Import Routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const linkRoutes = require("./routes/link");
const typeRoutes = require("./routes/type");
const mediaRoutes = require("./routes/media");
const levelRoutes = require("./routes/level");

// Database
const DB_OPTIONS = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};

mongoose
  .connect(process.env.DATABASE_CLOUD, DB_OPTIONS)
  .then(() => console.log("DB Connected!"))
  .catch((err) => console.log(err));

app.use(express.json({ limit: "5mb", type: "application/json" }));
app.use(express.urlencoded({ extended: false }));
// app.use(formData.parse());
// req.cookies에 붙여줌
app.use(cookieParser());

app.use(morgan("dev", { stream }));
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

// middlewares
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", linkRoutes);
app.use("/api", typeRoutes);
app.use("/api", mediaRoutes);
app.use("/api", levelRoutes);

app.use(function (error, req, res, next) {
  if (error.name === "UnauthorizedError") {
    res.status(401).send("Invalid Token...");
  }
});

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`API is running on port ${port}`));
