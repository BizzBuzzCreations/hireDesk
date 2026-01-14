const Candidate = require("../models/candidate");
const ExpressError = require("../utils/expressError");
const cloudinary = require("cloudinary").v2;

module.exports.index = async (req, res) => {
  try {
    const limit = 10;
    let page = parseInt(req.query.page) || 1;

    const totalCandidates = await Candidate.countDocuments();
    const totalPages = Math.ceil(totalCandidates / limit);

    // Clamp page number
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;

    const skip = (page - 1) * limit;

    //For row indexing
    const currRow = (page - 1) * 10;

    const allCandidates = await Candidate.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.render("candidates/dashboard.ejs", {
      allCandidates,
      totalCandidates,
      page,
      totalPages,
      currRow,
    });
  } catch (err) {
    throw new ExpressError(400, "Something Went Wrong!");
  }
};

module.exports.createCandidate = async (req, res) => {
  let { name, email, contact, bankDetails, jobTitle, department, feedback } =
    req.body;

  let {
    adhar,
    pan,
    highSchool,
    seniorSchool,
    graduation,
    postGrad,
    expLetter,
    relieveLetter,
    salarySlip,
    bankCert,
  } = req.files;

  if (
    !name ||
    !email ||
    !contact ||
    !bankDetails ||
    !jobTitle ||
    !department ||
    !adhar ||
    !pan ||
    !highSchool ||
    !seniorSchool ||
    !graduation ||
    !bankCert
  ) {
    res.cookie("toast", "Invalid input. Please check the form and try again.", {
      httpOnly: true,
      maxAge: 4000, // 4 seconds
    });
    res.redirect("/form");
  }

  try {
    const candidate = new Candidate({
      name,
      email,
      contact,
      bankDetails,
      jobTitle,
      department,
      feedback,
      adhar: adhar?.[0]?.path,
      pan: pan?.[0]?.path,
      highSchool: highSchool?.[0]?.path,
      seniorSchool: seniorSchool?.[0]?.path,
      graduation: graduation?.[0]?.path,
      postGrad: postGrad?.[0]?.path,
      expLetter: expLetter?.[0]?.path,
      relieveLetter: relieveLetter?.[0]?.path,
      salarySlip: salarySlip?.[0]?.path,
      bankCert: bankCert?.[0]?.path,
    });

    await candidate.save();
    res.cookie("toast", "Submitted Successfully!", {
      httpOnly: true,
      maxAge: 4000, // 4 seconds
    });
    res.redirect("/form");
  } catch (err) {
    throw new ExpressError(400, "Fill every details properly");
  }
};

module.exports.destroyCandidate = async (req, res) => {
  const DOC_FIELDS = [
    "adhar",
    "pan",
    "highSchool",
    "seniorSchool",
    "graduation",
    "postGrad",
    "expLetter",
    "relieveLetter",
    "salarySlip",
    "bankCert",
  ];
  function extractPublicId(url) {
    return url
      .split("/upload/")[1]
      .replace(/^v\d+\//, "")
      .replace(/\.\w+$/, "");
  }

  try {
    const { id } = req.params;
    const data = await Candidate.findById(id);
    if (!data) {
      res.cookie("toast", "Candidate not found!", {
        httpOnly: true,
        maxAge: 4000, // 4 seconds
      });
      return res.redirect("/candidates");
    }

    let publicIds = [];
    for (const field of DOC_FIELDS) {
      if (data[field]) {
        publicIds.push(extractPublicId(data[field]));
      }
    }

    //delete from cloudinary
    cloudinary.api.delete_resources(publicIds);

    const candidate = await Candidate.findByIdAndDelete(id);
    if (!candidate) {
      res.cookie("toast", "Candidate not found!", {
        httpOnly: true,
        maxAge: 4000, // 4 seconds
      });
      res.redirect("/candidates");
    }
    res.cookie("toast", "successfully data deleted!", {
      httpOnly: true,
      maxAge: 4000, // 4 seconds
    });
    return res.redirect("/candidates");
  } catch (err) {
    throw new ExpressError(400, "Something Went Wrong!");
  }
};

module.exports.login = async (req, res) => {
  try {
    const { password } = req.body;

    if (password !== process.env.DASHBOARD_PASS) {
      res.cookie("toast", "Password is incorrect!", {
        httpOnly: true,
        maxAge: 4000,
      });
      return res.redirect("/");
    }

    //  auth cookie (flag)
    res.cookie("dashboardAuth", "true", {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
    });

    res.redirect("/candidates");
  } catch (err) {
    throw new ExpressError(400, "Something Went Wrong!");
  }
};
