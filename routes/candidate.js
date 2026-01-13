const express = require("express");
const { protectDashboard } = require("../middlewares");
const multer = require("multer");
const { storage } = require("../cloudConfig");
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const router = express.Router();
const {
  index,
  createCandidate,
  destroyCandidate,
  login,
} = require("../controllers/candidate");

//login for dashboard
router.post("/login", login);

//show all candidates
router.get("/", protectDashboard, index);

//create candidate
router.post(
  "/",
  upload.fields([
    { name: "adhar", maxCount: 1 },
    { name: "pan", maxCount: 1 },
    { name: "highSchool", maxCount: 1 },
    { name: "seniorSchool", maxCount: 1 },
    { name: "graduation", maxCount: 1 },
    { name: "postGrad", maxCount: 1 },
    { name: "expLetter", maxCount: 1 },
    { name: "relieveLetter", maxCount: 1 },
    { name: "salarySlip", maxCount: 1 },
    { name: "bankCert", maxCount: 1 },
  ]),
  createCandidate
);

//delete candidate
router.delete("/:id", destroyCandidate);

module.exports = router;
