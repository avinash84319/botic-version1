const express=require("express");
const app = express();


app.use(express.static("public"));   //for sending css
const bodyParser = require("body-parser");  // for using info coming back from website
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs") // to tell browser that ejs is bieng used
const mongoose=require("mongoose");
mongoose.connect("mongodb://localhost:27017/boticdb",{useNewUrlParser:true});

var customer;
var product;

const scheme=mongoose.Schema({     //schema for customers object in customer collection
    name:String,
    phoneno:Number,
    products:[]
})

var customers=mongoose.model("customers",scheme);  //created the collection customers


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

app.post("/customerpage",function(req,res){  //going to customer page
    customer=req.body.customerphoneno;
    console.log(req.body.customerphoneno);
    res.redirect("/customerpage");  //goes to personal customer page or customer.ejs
})

app.post("/delete",function(req,res){    //delete customer
    customer=req.body.customerphoneno;                              //store the phoneno of customer to be deleted
    console.log(customer);
    customers.deleteOne( {phoneno:{$eq:customer}},function(err){     //deleting function annd redirecting to home route
      if(err){
        console.log(err);
      }
      else{
        res.redirect("/");
      }
    });
})

app.post("/addproduct",function(req,res){  //adding product
  customer=req.body.phoneno;
  console.log(req.body.phoneno);   //recognising which customer to add product
   var addproduct={                          //object product adding to products array
    name:req.body.addproduct,
    work:req.body.addstage,
    price:req.body.addprice
  };
  customers.updateOne({phoneno:customer},{$push:  //pushing new object into prouct array
  {products:addproduct}},function(err){                           //error function always to coded to mongodb to work
    if(err){
      console.log(err);
    }
    else{
      res.redirect("/customerpage");
    }
  });

})

app.post("/deleteproduct",function(req,res){   //deleting product with checkbox
    product=req.body.deleteproduct;
    customers.updateOne({phoneno:customer},{$pull:{products:{name:product}}},function(err){  //mathing for customer from previous customer vaiable
      if(err){                                               //matching name with name of product
        console.log(err);                                         //pull deletes the object from array product
      }
      else{
        res.redirect("/customerpage")
      }
    })
})


app.listen(3000,function(){
    console.log("server started successfully")
});

