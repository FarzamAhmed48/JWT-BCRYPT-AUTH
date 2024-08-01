const express=require("express")
const app =express();
const cookieParser = require("cookie-parser");
const path=require("path")
const userModel=require("./models/user")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken");
const user = require("./models/user");

app.set("view engine","ejs")
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")))
app.use(cookieParser());


app.get("/",function(req,res){
    res.render("index")
})

app.post("/create",function(req,res){
    let {username,email,password,age}=req.body
    bcrypt.genSalt(10,function(err,salt){
        bcrypt.hash(password,salt,async function(err,hash){
            
            let createdUser=await userModel.create({
                username: username,
                email: email,
                password: hash,
                age: age
            })
            let token=jwt.sign({email},"shhhhh")
            res.cookie("token",token)
            res.send(createdUser)
        })
    })
})

app.get("/logout",function(req,res){
    res.cookie("token","")
    res.redirect("/")
})

app.get("/login",function(req,res){
    res.render("login")
})

app.post("/login",async function(req,res){
    let user=await userModel.findOne({
        email:req.body.email
    })
    if(!user){
        return res.send("Something went wrong")
    }
    bcrypt.compare(req.body.password,user.password,function(err,result){
        if(result) {
            console.log("You can Login")
            let token=jwt.sign({email:user.email},"shhhhh")
            res.cookie("token",token)
            res.send("You have logged INlet token=jwt.sign({email},"shhhhh")
            res.cookie("token",token)")
        }
            
        else res.send("Something went Wrong")
        
    })
    // console.log(user.password,req.body.password)
})
app.listen(3000)