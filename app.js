const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const _ = require("lodash");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
require("dotenv/config");

//variable for author
let author = "Cozma Maria Dolores";

//empty variable for postId
let requestedPostId = [];

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));

//initialise session
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.DB_NAME, {useNewUrlParser: true});
mongoose.set("useCreateIndex", true);

//mongoose db scheme
const articleSchema = {
    title: String,
    content: String,
    postedAt: {
        type: Date,
        default: Date.now
    },
    author: String
};

const adminSchema = new mongoose.Schema({
    username: String,
    password: String
});

adminSchema.plugin(passportLocalMongoose);

//mongoose model
const Post = mongoose.model("Post", articleSchema);
const Admin = new mongoose.model("Admin", adminSchema);

passport.use(Admin.createStrategy());

passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser());

//render the last 3 documents on the home page
app.get("/", function(req, res){
    Post.find({}, function(err, posts){
        res.render("home", {
            posts: posts,
            author: author
        });
    }).sort({postedAt: -1}).limit(3)
});

app.get("/contact", function(req, res){
    res.render("contact");
});

app.get("/admin", function(req, res){
    if( req.isAuthenticated()){
        res.render("admin");
    } else {
        res.redirect("/login");
    }
});

app.get("/posts", function(req, res){
    Post.find({}, function(err, posts){
        res.render("posts", {
            posts: posts,
            author: author
        });
    });
});

app.post("/admin", function(req, res){
    const articol = new Post({
        title: req.body.postTitle,
        content: req.body.postBody,
        author: author
    });
    
    articol.save(function(err){
        if(!err){
            res.redirect("/");
        } else {
            console.log(err);
        };
    });
});

app.get("/post/:postId", function(req, res){
    const requestedPostId = req.params.postId;
    Post.findOne({_id: requestedPostId}, function(err, post){
        let newLine = post.content.replace(/(\r\n)/gm, '<br><br>');
        res.render("post", {
            title: post.title,
            content: newLine,
            postedAt: post.postedAt,
            author: author
        });
    });
});

app.get("/modify", function(req, res){
    Post.find({}, function(err, posts){
        res.render("modify", {
            posts: posts
        });
    });
});

app.get("/edit/:postId", function(req, res){
    const articleId = req.params.postId;
    requestedPostId.push(articleId);
    Post.findOne({_id: requestedPostId}, function(err, post){
        let newLine = post.content.replace(/(\r\n)/gm, '<br><br>');
        res.render("edit", {
            title: post.title,
            content: newLine,
            postedAt: post.postedAt,
            author: author
        });
    });
});

//replace one document in the DB
app.post("/edit", function(req, res){
    
    Post.replaceOne({_id: requestedPostId}, {title: req.body.editTitle, content: req.body.editBody}, function(err, post){
        requestedPostId.splice(0, 1);
        res.redirect("modify");
    });
});

app.get("/login", function(req, res){
    res.render("login");
});

app.post("/login", function(req, res){
    const admin = new Admin({
        username: req.body.username,
        password: req.body.password
    });
    console.log(req.body.username, req.body.password);
    req.login(admin, function(err){
        if(err){
            console.log(err);
        } else {
            passport.authenticate("local")(req, res, function(){
                res.redirect("/admin");
            })
        }
    });
});

//delete one document from DB
app.get("/delete/:postId", function(req, res){
    const requesteId = req.params.postId;
    Post.deleteOne({_id: requesteId}, function(err, post){
        res.redirect("/modify");
    });
});

app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res){
    Admin.register({username: req.body.username}, req.body.password, function(err, user){
        if(err) {
            console.log(err);
            res.redirect("/register");
        } else {
            passport.authenticate("local")(req, res, function(){
                res.redirect("/admin");
            });
        }
    });
})

let port = process.env.PORT;
if(port == null || port == "") {
    port = 3000;
}

app.listen(port, function(){
    console.log("Server has started");
});

