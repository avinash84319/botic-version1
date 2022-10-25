const express=require("express");
const app = express();


app.use(express.static("public"));   //for sending css
const bodyParser = require("body-parser");  // for using info coming back from website
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs") // to tell browser that ejs is bieng used
const mongoose=require("mongoose");
mongoose.connect("mongodb://localhost:27017/boticdb",{useNewUrlParser:true});

var customer;

const scheme=mongoose.Schema({
    name:String,
    phoneno:Number,
    products:[]
})

var customers=mongoose.model("customers",scheme);


app.get("/", function(req,res){      //sendingg response on home route
    customers.find({},function(err,customers){
        if(err){
          console.log(err);
        }
        else{
          res.render("index", {customers:customers});
        }
      }); //sending array to ejs file
})

app.get("/customerpage", function(req,res){      //sendingg response on home route
    customers.find({phoneno:{$eq:customer}},function(err,customerpage){
        if(err){
          console.log(err);
        }
        else{
          console.log(customerpage[0]);
          res.render("customer", {customer:customerpage[0]});
        }
      });//sending array to ejs file
})


app.post("/",function(req,res){
    const addcustomer=new customers({          // apending new customer to old list
        name:req.body.addcustomer,
        phoneno:req.body.addphone,
        products:[]
    }) 
    addcustomer.save();                                        
    res.redirect("/"); //again sending ejs with new customer list
})

app.post("/customerpage",function(req,res){
    customer=req.body.customerphoneno;
    console.log(req.body.customerphoneno);
    res.redirect("/customerpage");  //goes to personal customer page or customer.ejs
})

app.post("/delete",function(req,res){
    //delete function mongo db
    res.redirect("/");
})


app.listen(3000,function(){
    console.log("server started successfully")
});