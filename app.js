const URL = 'https://sheets.googleapis.com/v4/spreadsheets/145tlw2Ke55loXVjo9CfjHaCeZM1b5cISBoB9ZVvGu6U/values/A2%3AC70?key=AIzaSyDeFJrnQQBOteknFzXurUyicAATOtvpoaQ';
var menu = [];

const express     = require("express");
const app         = express();
const request     = require('request');
const bodyParser    = require("body-parser");  


app.use(express.static("public"));              // allows use of static .css files
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");                  // allows including .ejs without suffix

//=================================================
//================== TEST CODE ===================
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const googlReadAndUpdate = require('./googleAPI/credentials')
// googlReadAndUpdate.readandupdate();
//=================================================
//=================================================

// ==========UPDATES OUR MENU ON STARTUP===============
request(URL, function(error, response, body){
        if(error){
            console.log("Something went wrong!" + error);
        } else {
            if(response.statusCode ==200){
                menu =JSON.parse(body).values;
            }
        }
    });

app.get("/", function(req,res){
    res.render("home");
});

app.get("/about", function(req,res){
    res.render("about");
});

app.get("/menu", function(req,res){
    res.render("menu",{menu:menu});
});

app.get("/menu/update" ,function(req,res){
    request(URL, function(error, response, body){
        if(error){
            console.log("Something went wrong!" + error);
        } else {
            if(response.statusCode ==200){
                menu =JSON.parse(body).values;
                res.redirect("/menu");
            }
        }
    });
});

app.get("/menu", function(req,res){
    
});

app.get("/contact", function(req,res){
    res.render("contact");
});

//starting server
app.listen(8080,function(){
    console.log("Shoestring Cafe has been started!");

});

