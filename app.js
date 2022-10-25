const express=require("express");
const app = express();


app.use(express.static("public"));   //for sending css
const bodyParser = require("body-parser");  // for using info coming back from website
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs") // to tell browser that ejs is bieng used
const mongoose=require("mongoose");
mongoose.connect("mongodb://localhost:27017/boticdb",{useNewUrlParser:true});


var customers=["AVINASH","VAISHU","NANA"];
var addcustomer;
var customer;


app.get("/", function(req,res){      //sendingg response on home route
    res.render("index",{customers:customers}); //sending array to ejs file
})

app.get("/customerpage", function(req,res){      //sendingg response on home route
    res.render("customer",{customer:customer,customers:customers}); //sending array to ejs file
})


app.post("/",function(req,res){
    if(addcustomer!=req.body.addcustomer)
    addcustomer=req.body.addcustomer; 
    customers.push(addcustomer);           // apending new customer to old list
    res.redirect("/"); //again sending ejs with new customer list
})

app.post("/customerpage",function(req,res){
    customer=req.body.customername;
    res.redirect("/customerpage");  //goes to personal customer page or customer.ejs
})

app.post("/delete",function(req,res){
    //delete function mongo db
    res.redirect("/");
})


app.listen(3000,function(){
    console.log("server started successfully")
});