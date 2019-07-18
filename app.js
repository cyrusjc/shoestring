// initializing Express
var express     = require("express");
var app         = express();
app.use(express.static("public"));              // allows use of static .css files
app.set("view engine", "ejs");                  // allows including .ejs without suffix

// bodyParser for requests since they come back in string file.
var bodyParser  = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req,res){
    res.render("home")
});

app.get("/menu", function(req,res){
    res.render("menu")
});

app.get("/contact", function(req,res){
    res.render("contact")
});

//starting server
app.listen(8080,function(){
    console.log("Shoestring Cafe has been started!");
})

