// 
// Base found on expressjs.com - hello world
//

var express 		= require("express"),
    mongoose 		= require("mongoose"),
    passport 		= require("passport"),
    bodyParser 		= require("body-parser"),
    LocalStrategy 	= require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    User 		= require("./models/user");
mongoose.connect("mongodb://localhost/ftm_intranet");

var port = 80;
var app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(require("express-session")({
  secret: "This is Sparta",
  resave: "false",
  saveUninitialized: "false"
}));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get("/", function (req, res) {
  res.render("home");
})

app.get("/login", function (req,res) {
  res.render("login");
})

app.get("/secret", function (req,res) {
  res.render("secret");
})

app.get("/speak/:animal", function (req, res) {
  res.send("The "+(req.params.animal).toUpperCase()+" says something");
})

app.get("/dog", function (req, res) {
  res.send("Doggies");
})

app.get("/cat", function (req, res) {
  res.send("Pussies");
})

app.get("/ejs", function (req, res) {
  res.render("index",{sparta: "THIS IS SPARTA"});
})

app.get("/repeat/:word/:repet", function (req, res) {
  var text = "";
  for(var i =0 ; i<req.params.repet;i++){
    text += (req.params.word).toUpperCase();
    text += "   ";
  }
res.send(text+"   ");
})

app.get("*", function (req, res) {
  res.send("ERROR 404!");
})

app.listen(port, function () {
  console.log("FTM intranet is up and running on "+port+"!");
});
