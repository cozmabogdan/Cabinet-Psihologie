const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/cabinetPsihologie", {useNewUrlParser: true});

const articleSchema = {
    title: String,
    content: String
};

const Post = mongoose.model("Post", articleSchema);

app.get("/", function(req, res){
    res.render("home");
});

app.get("/contact", function(req, res){
    res.render("contact");
});

app.get("/admin", function(req, res){
    res.render("admin");
});

app.get("/posts", function(req, res){
    Post.find({}, function(err, posts){
        res.render("posts", {
            posts: posts
        });
    });
});

app.post("/admin", function(req, res){
    const articol = new Post({
        title: req.body.postTitle,
        content: req.body.postBody
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
        res.render("post", {
            title: post.title,
            content: post.content
        });
    });
});



app.listen(3000, function(){
    console.log("Server started on port 3000");
});