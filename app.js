const express = require("express");
const globalErrorHandler = require("./controllers/errorControllers");
const itemRoutes = require("./routes/ItemRoutes");
const userRoutes = require("./routes/userRoutes");
const viewRoutes = require("./routes/viewsRoutes");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
app.use(cors());

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

app.use((req, res, next) => {
  req.requestedTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

app.use("/", viewRoutes);
app.use("/user", userRoutes);
app.use("/item", itemRoutes);

// If not handled by any other middleware then it dosent exist handler
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// implementing the global err handler
app.use(globalErrorHandler);

module.exports = app;
