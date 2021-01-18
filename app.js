const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/cabinetPsihologie", {useNewUrlParser: true});

const articleSchema = {
    title: String,
    content: String,
    date: Date,
    author: String
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



app.listen(3000, function(){
    console.log("Server started on port 3000");
});