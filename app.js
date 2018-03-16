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
  res.render("home");
})

app.get("/userpage", isLoggedIn ,function (req,res) {
  console.log(req.user);
  res.render("userpage", {currentUser: req.user});
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
  res.send("P");
})

app.get("/ejs", function (req, res) {
  res.render("index",{sparta: "THIS IS SPARTA"});
})



// Auth routes

// Show things
app.get("/login", function (req,res) {
  res.render("login");
})

app.get("/signup", function (req, res){
  res.render("signup")

});

app.get("/logout", function (req, res){
  req.logout();
  res.redirect("/login")
});


// handles things
app.post("/signup", function(req, res){
  req.body.username;
  req.body.password;
  User.register(new User({username: req.body.username, name: req.body.name }), req.body.password, function(err, user){
    if(err){
      console.log(err);
      return res.render('signup');
    }    
    passport.authenticate("local")(req, res, function(){
      res.redirect("/secret");
    });    
  });
});

app.post("/login", passport.authenticate("local", {successRedirect:"/userpage", failureRedirect:"/login"}) ,function(req, res){
  

});



app.get("/repeat/:word/:repet", function (req, res) {
  var text = "";
  for(var i =0 ; i<req.params.repet;i++){
    text += (req.params.word).toUpperCase();
    text += "   ";
  }
res.send(text+"   ");
});

app.get("*", function (req, res) {
  res.send("ERROR 404!");
});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
    res.redirect("/login");
};

app.listen(port, function () {
  console.log("FTM intranet is up and running on "+port+"!");
});
