if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/expressError");
const candidateRouter = require("./routes/candidate");
const cookieParser = require("cookie-parser");

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
}

app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  res.locals.toast = req.cookies.toast || null;

  if (req.cookies.toast) {
    res.clearCookie("toast");
  }

  next();
});

app.get("/", (req, res) => {
  res.render("candidates/login");
});

app.get("/form", (req, res) => {
  res.render("candidates/form");
});

app.use("/candidates", candidateRouter);

// app.all("*", (req, res, next) => {
//   next(new ExpressError(404, "Page Not Found!"));
// });

app.use((err, req, res, next) => {
  console.log(err);
  let { status = 500, message = "SOME ERROR" } = err;
  res.status(status).render("error", { message, status });
});

app.listen(8080, () => {
  console.log("Server running on port 8080");
});
