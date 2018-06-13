var mongoose = require("mongoose");

var leadGenSchema = new mongoose.Schema({
  fullName: String,
  phone: String,
  major: String,
  school: String,
  state: String,
  partner: String
}) ;

module.exports = mongoose.model("LeadGen", leadGenSchema);


