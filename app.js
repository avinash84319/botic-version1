const express=require("express");
const app = express();


app.use(express.static("public"));   //for sending css
const bodyParser = require("body-parser");  // for using info coming back from website
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs") // to tell browser that ejs is bieng used

var username
var password

app.get("/",function(req,res){
  res.render("login");
});

app.post("/",function(req,res){
  username=req.body.username;
  password=req.body.password;
  if(username=="avinash"&&password=="jssavi22")
  res.redirect("/home");
});



const mongoose=require("mongoose");
mongoose.connect('mongodb+srv://avinash:jssavi22@botic.vluhzuc.mongodb.net/boticdb?retryWrites=true&w=majority',{useNewUrlParser:true});

var customer;
var product;
var undoproduct;
var undocustomer;
var dumb;
var f;
var deleteprodcust;

const scheme=mongoose.Schema({     //schema for customers object in customer collection
    name:String,
    phoneno:Number,
    products:[]
})

var customers=mongoose.model("customers",scheme);  //created the collection customers


app.get("/home", function(req,res){      //sendingg response on home route
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
          var price=0;
          for(var i=0;i<customerpage[0].products.length;i++){             //calculating total price for a customer
            price=price+customerpage[0].products[i].price;
          }
          res.render("customer", {customer:customerpage[0],price:price}); //sending price and selected customer object
        }
      });
})


app.post("/home",function(req,res){
  console.log("coming to home route");
  if(req.body.addcustomer){
    const addcustomer=new customers({          // apending new customer to old list
        name:req.body.addcustomer,
        phoneno:req.body.addphone,
        products:[]
    }) 
    addcustomer.save();  
    res.redirect("/home");              //again sending ejs with new customer list
  }
  else{                                   
    res.redirect("/home");                //else for go back button in customer page
  }
})

app.post("/customerpage",function(req,res){  //going to customer page
    customer=req.body.customerphoneno;
    console.log(req.body.customerphoneno);
    res.redirect("/customerpage");  //goes to personal customer page or customer.ejs
})

app.post("/delete",function(req,res){    //delete customer

  customer=req.body.customerphoneno;                              //store the phoneno of customer to be deleted

  customers.find({phoneno:customer},function(err,dash){
    if(err){
      console.log(err);
    }
    else{
      console.log(dash);
      undocustomer=dash[0];
      console.log(undocustomer);
    }
  })
  
    customers.deleteOne( {phoneno:{$eq:customer}},function(err){     //deleting function annd redirecting to home route
      if(err){
        console.log(err);
      }
      else{
        res.redirect("/home");
      }
    });
})

app.post("/addproduct",function(req,res){  //adding product
  customer=req.body.phoneno;
  console.log(customer,"start");           //recognising which customer to add product
  var nid;
customers.find({phoneno:customer},function(err,hash){ 
      if(err)
      {
        console.log(err);
      }
      else
      {
        console.log(hash[0].products.length);
        nid=hash[0].products.length+1;             //getting no of products to add id
        var ndate=new Date();
        console.log(ndate);
        var addproduct={                          //object product adding to products array
          id:nid,
          name:req.body.addproduct,
          work:req.body.addstage,
          price:parseInt(req.body.addprice),
          date:ndate.getDate() +"/"+ndate.getMonth()+"/"+ndate.getFullYear()
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
      }
    });

})

app.post("/deleteproduct",function(req,res){   //deleting product with checkbox
  deleteprodcust=customer;                                   //savind product deleted customer no for undo delete
  product=parseInt(req.body.deleteproduct);
  console.log(product);
    customers.find({phoneno:customer},function(err,dash){
      if(err){
        console.log(err);
      }
      else{
        console.log(dash);
        undoproduct=dash[0].products.filter(function(d){
            return d.id=product;
          })
      }
    })
    customers.updateOne({phoneno:customer},{$pull:{products:{id:product}}},function(err){  //mathing for customer from previous customer vaiable
      if(err){                                               //matching id with id of product
        console.log(err);                                         //pull deletes the object from array product
      }
      else{
        res.redirect("/customerpage")
      }
    })
});

app.post("/undoproductdelete", function (req, res) {            //creatinf undo for product delete

  if (req.body.undobutton = deleteprodcust) {                      //checking in which customer product was deleted

    customers.find({ phoneno: customer }, function (err, f) {           //getting the customer object
      if (err) {
        console.log(err);
      }
      else {
        if (f[0].products.filter(function (d) { return d.id = undoproduct[0].id; }).length) { //checking for mutiple undo program by comparing with datbase
          res.redirect("/customerpage");
        }
        else {
          customers.updateOne({ phoneno: customer }, {
            $push:  //pushing new object into prouct array if not multiple undo
              { products: undoproduct[0] }
          }, function (err) {                           //error function always to coded to mongodb to work
            if (err) {
              console.log(err);
            }
            else {
              res.redirect("/customerpage");
            }
          });
        }
      }
    });
  }

  else {
    res.redirect("/customerpage");                        // if in different customer undo is used just redirect no undo 
  }

}
);

app.post("/undocustomerdelete",function(req,res){
  console.log(undocustomer);
if(undocustomer){
  customers.find({phoneno:undocustomer.phoneno},function(err,f){
    if(f.length){ 
     res.redirect("/home");
   }
   else{
    const addcustomer=new customers({          // apending new customer to old list
      name:undocustomer.name,
      phoneno:undocustomer.phoneno,
      products:undocustomer.products
  })
  addcustomer.save(); 
   res.redirect("/home")
   }

  })
 }
 else{
  res.redirect("/home");
 }
})

 app.post("/searchcustomer",function(req,res){
  customer=req.body.addphone;
  customers.find({phoneno:customer},function(err,f){
    if(f.length){ 
     res.redirect("/customerpage");
   }
   else{
     res.redirect("/home");
   }
  
 })
})
  

app.listen(process.env.PORT||3000,function(){
    console.log("server started successfully");
})

