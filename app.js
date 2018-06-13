// 
// Base found on expressjs.com - hello world
//

var express 		= require("express"),
    mongoose 		= require("mongoose"),
    passport 		= require("passport"),
    bodyParser 		= require("body-parser"),
    LocalStrategy 	= require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    User 		= require("./models/user"),
    LeadGen		= require("./models/leadgen");

// mongoose.connect("mongodb://localhost/ftm_intranet");
mongoose.connect("mongodb://vince:ftm2018@ds139899.mlab.com:39899/ftm-user");


var port = 80;
var app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(require("express-session")({
  secret: "This is Sparta",
  resave: "false",
  saveUninitialized: "false"
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/* 
ROUTES
*/


app.get("/", function (req, res) {
//  res.render("home");
  res.redirect("/login");
})

app.get("/user", isLoggedIn ,function (req,res) {
  console.log(req.user);
  LeadGen.find({partenaire : req.user.partenaire}, function(err, data){
  console.log(req.leadgen); 
    res.render("user", {currentUser: req.user, leads: data});
}) 
})

app.get("/secret", function (req,res) {
  res.render("secret");
})


app.get("/ejs", function (req, res) {
  res.render("index",{sparta: "THIS IS SPARTA"});
})

app.get("/login-error", function(req,res){
//  res.send("Erreur de login"); 
//  window.alert("erreur de login");
  res.redirect("/*");
});

// Auth routes

// Show things
app.get("/login", function (req,res) {
  res.render("login2");
})

app.get("/signup", function (req, res){
  res.render("signup");

});

app.get("/logout", function (req, res){
  req.logout();
  res.redirect("/login");
});

app.get("/createlead", function (req, res){
  res.render("createlead");
//  (new LeadGen({fullName: "Vince"})).save();
//  res.redirect("/login")
});




//
// Handles Login
//
app.post("/signup", function(req, res){
  req.body.username;
  req.body.password;
  User.register(new User({username: req.body.username, name: req.body.name, role: req.body.role }), req.body.password, function(err, user){
    if(err){
      console.log(err);
      alert("Erreur de creation");
      return res.render('signup');
    }    
    passport.authenticate("local")(req, res, function(){
      res.redirect("/secret");
    });    
  });
});

app.post("/login", passport.authenticate("local", {successRedirect:"/user", failureRedirect:"/login-error"}) ,function(req, res){
});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
    res.redirect("/login");
};

//
// Handles LeadGen
//

app.post("/createlead",function(req,res){

req.body.fullName;



(new LeadGen({fullName: req.body.fullName, phone: req.body.phone, major: req.body.major, school: req.body.school, state:'sent', partner: req.body.partner})).save();
res.redirect("/secret");
//db.leadgen.insert(({fullName: req.body.fullName});

/*
  new LeadGen({fullName: req.body.fullName, phone: req.body.phone, major: req.body.major, school: req.body.school, partner: req.body.partner, state = "Envoyé" }), function(err, user){
    if(err){
      console.log(err);
      alert("Erreur de creation");
      res.redirect("/secret")
    }
*/
});





//
// Handles 404 and port listening
//
app.get("*", function (req, res) {
  res.send("ERROR 404!");
});

app.listen(process.env.PORT || port, function () {
  console.log("FTM intranet is up and running on "+port+"!");
});
