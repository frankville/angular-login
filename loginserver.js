var express = require("express"); 
var passport = require("passport");
var bodyParser = require("body-parser");
//var multer = require("multer");
var cookieParser = require("cookie-parser");
var expressSession = require("express-session");
var LocalStrategy = require("passport-local").Strategy;
var mongoose = require("mongoose");
var MongoStore = require("connect-mongo")(expressSession);
var http = require("http");

mongoose.connect('mongodb://localhost/users');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  // yay!
});

var UserSchema = mongoose.Schema({
    username: String,
    password: String
});

var User = mongoose.model('User', UserSchema);

var app = express();


passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username, password: password }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username or password' });
      }
      return done(null, user);
    });
  }
));


passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});


  app.use(express.static(__dirname) );
  app.use(cookieParser() );
  //app.use(multer());
  app.use(bodyParser.json()); // get information from html forms
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(expressSession({
    store: new MongoStore({
      db: "sessions"
    }),
  	secret: "somethingcrazy",
  	resave: true,
  	saveUninitialized: true
  }));
  app.use(passport.initialize() );
  app.use(passport.session() );


function isAuthenticated(req, res, next) {

  // do any checks you want to in here

  // CHECK THE USER STORED IN SESSION FOR A CUSTOM VARIABLE
  // you can do this however you want with whatever variables you set up
  if (req.user)
    return next();

  // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
    res.status(401).end();
;
}

app.use(function(req,res,next){
   return next();
})

app.get('/',function(req,res){


});


app.get("/saveUsers",function(req,res,next){
  var user1 = new User({ username: "a", password: "a" });
  user1.save(function (err, user1) {
    if (err) return console.error(err);
    console.log("user1 guardado");
  }); 
  var user2 = new User({ username: "b", password: "b" });
  user2.save(function (err, user2) {
    if (err) return console.error(err);
    console.log("user2 guardado");
  }); 
  res.status(200).end()
});

app.get("/userInfo",isAuthenticated,function(req,res){
  res.json(req.user);
});

app.post('/login',
  passport.authenticate('local'), function(req,res){
  res.status(200).end();
  }
);

app.get("/logout",isAuthenticated, function(req,res){
  req.session.destroy(function(err){
    if(err){ throw err}
  });
  res.status(200).end()

});

server = http.createServer(app);
server.listen(2011, function () {
    console.log('server escuchando en http://devcloud.dnsdynamic.com:2011/');
});