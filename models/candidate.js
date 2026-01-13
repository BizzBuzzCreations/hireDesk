const mongoose = require("mongoose");

const candidateSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    contact: {
      type: Number,
      required: true,
    },
    bankDetails: {
      type: String,
      required: true,
    },
    jobTitle: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    adhar: {
      type: String,
      required: true,
    },
    pan: {
      type: String,
      required: true,
    },
    highSchool: {
      type: String,
      required: true,
    },
    seniorSchool: {
      type: String,
      required: true,
    },
    graduation: {
      type: String,
      required: true,
    },
    postGrad: {
      type: String,
    },
    expLetter: {
      type: String,
    },
    relieveLetter: {
      type: String,
    },
    salarySlip: {
      type: String,
    },
    bankCert: {
      type: String,
      required: true,
    },
    feedback: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Candidate", candidateSchema);
