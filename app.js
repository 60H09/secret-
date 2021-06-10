require('dotenv').config()
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
mongoose.connect("mongodb://localhost:27017/userDB", { useUnifiedTopology: true , useNewUrlParser: true }) //mongoose connecting
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set('view engine', 'ejs')

const userSchema =new mongoose.Schema({username:String,name:String,password:String});

//const secret = process.env.SECRET
const secret = "thisismysecrethehe"
userSchema.plugin(encrypt,{secret:secret ,encryptedFields:["password"]})

const User = mongoose.model("User",userSchema);


app.get("/", (req, res) => {
    res.render("home")
})
 
app.get("/registered", (req, res) => {
   res.render("registered")
})

app.get("/login", (req, res) => {
 res.render("login")
})
app.get("/register", (req, res) => {
    res.render("register")
})

app.post(("/register"),function(req,res){
    var username = req.body.username;
    var password = req.body.password;
    var name = req.body.name;
  User.findOne({username:username},function(err, result){
   if(result){
       console.log('already exist');
       var content= "already exist try again"
       res.render("duh",{content:content})
   }
   else{
    var user = new User({username:username,password:password,name:name})
    user.save();
    res.redirect("/registered")
   }

  })
 
})      


app.post("/login",function(req, res){
    var username = req.body.username;
    var password = req.body.password;
    User.findOne({username:username},function(err, result){
        if(!result){
            res.render("duh",{content:"email not found"})
        }
        else{
            if(password===result.password){
                res.render("Secrets",{name:result.name})
            }
            else{
                res.render("duh",{content:'something fishy wrong credentials'})
                console.log("wrong password")
            }
        }
    })  
})


app.listen(3000, function(){
    console.log("listening")
})