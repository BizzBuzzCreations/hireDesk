const ExpressError = require("./utils/expressError");

module.exports.protectDashboard = (req, res, next) => {
  if (req.cookies.dashboardAuth !== "true") {
    res.cookie("toast", "Please login to continue", {
      httpOnly: true,
      maxAge: 4000,
    });
    return res.redirect("/");
  }

  next();
};
