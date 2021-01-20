const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const _ = require("lodash");

//variable for author
let author = "Cozma Maria Dolores";

//empty variable for postId
let requestedPostId = [];

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/cabinetPsihologie", {useNewUrlParser: true});

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

//mongoose model
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
        content: req.body.postBody,
        author: "Cozma Maria Dolores"
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
        console.log("post id:" + requestedPostId);
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
        console.log(requestedPostId, post.title, post.content);
        res.redirect("modify");
    });
});

//delete one document from DB
app.get("/delete/:postId", function(req, res){
    const requesteId = req.params.postId;
    Post.deleteOne({_id: requesteId}, function(err, post){
        res.redirect("/modify");
    });
});



app.listen(3000, function(){
    console.log("Server started on port 3000");
});