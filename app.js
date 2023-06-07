const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const mongoose = require("mongoose");
const { log } = require("console");
const e = require("express");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");
var flag1 = false;
var ma = 0;
var client_name = "";
var available_stores = [];
var search_button = 0;
var flag2 = false;
var name2= "";
var text2="";
var available_stores = [];
var search_button = 0;
var meditems1=[];
var meditems2=[];
var meditems3=[];
var meditems4=[];
var Alloitems=[];
var Ayuritems=[];
var Homeoitems=[];
var vititems=[];
var logid2="";
var pushed_med=0;




mongoose.connect("mongodb://localhost:27017/MiniProjectDB");


const pharmacistSchema = new mongoose.Schema({
    store_name: String,
    timings: String,
    pharmacist_name: String,
    email_id: {
      type: String,
      unique: true,
    },
    phone_no: String,
    login_id: {
      type: String,
      unique: true,
    },
  
    password: String,
    open_close: Boolean,
    medicines_available: [
      {
        name: {
          type: String,
        },
        available: {
          type: String,
        },
        brand: {
          type: String,
        },
      },
    ],
  });
  
  const clientSchema = new mongoose.Schema({
    clientName: String,
    address: String,
    email_id: {
      type: String,
      unique: true,
    },
    login_id: {
      type: String,
      unique: true,
    },
    password: String,
    review: String,
  });
  
  const Client = mongoose.model("Client", clientSchema);
  const Pharmacist = mongoose.model("Pharmacist", pharmacistSchema);
  
var medstores1;


var text1 = "";
var name1 = "";

app.get("/", function (req, res) {
    res.render("twosignups");
  });
app.post("/",function(req,res){
    var n=req.body;
    console.log(n);
    if(n["button"]==="pharma")
    {
        res.redirect("/pharmacist");
    }
    else
    {
        res.redirect("/client");
    }
});



app.get("/client",function(req,res){
    res.render("login_client",{ loginerror: text1});
})
app.post("/client", function (req, res) {
  const logid1 = req.body.login_id;
  name1 = logid1;

  const pass = req.body.password;
  Client.find({ login_id: logid1 }, function (err, docs) {
    if (err) {
      console.log("There was an error");
    } else {
        console.log("Stopped");
      if (docs.length == 0) {
        text1 = "The login id doesn't exist..please signup or try again";
        res.redirect("/client");
      } else {
          console.log("else");
        if (pass == docs[0].password) {
          flag1 = true;
          console.log("yes");
          client_name = docs[0].clientName;
          res.redirect("/after_login1");
        } else {
          text1 = "You entered wrong password";
          res.redirect("/client");
        }
      }
    }
  });
});

app.get("/after_login1", function (req, res) {
  if (flag1) {
    res.render("index", { Name: client_name });
  } else {
    res.redirect("/client");
  }
});

app.post("/after_login1", function (req, res) {
  if (flag1) {
    res.render("index", { Name: client_name });
  } else {
    res.redirect("/client");
  }
});

app.get("/search", function (req, res) {
  res.send("<h1>" + req.body.medicine_name + "</h1>");
});
app.post("/search", function (req, res) {
  
  var medicine_name = req.body.medicine_name;
  if (search_button === 0) {
      
    console.log(search_button);
    search_button = 1;
    console.log("got in");

    var medstores = JSON.parse(req.body.submit);
    medstores1 = medstores;
    
    medstores.forEach(function (j) {
        ma=0;
        Pharmacist.find(function (err, result) {
        result.forEach(function (i) {
          if (i.login_id == j.id) {
            i.medicines_available.forEach(function (k) {
              if (k.name == medicine_name && k.available == "1") {
                ma = 1;

                available_stores.push(j);
              }
            });
          }
        });
      });
     
      
    });
    setTimeout(() => {
      if (ma == 1) {
        // console.log("yes "+JSON.stringify(available_stores));
        tempstores = available_stores;
        available_stores = [];

        ma = 0;
        res.render("deleteafter", {
          htmlstores: tempstores,
          Name: client_name,
        });
      }
    }, 2000);
  } else {
    console.log(search_button);
    medstores1.forEach(function (j) {
      ma = 0;
      Pharmacist.find(function (err, result) {
        result.forEach(function (i) {
          if (i.login_id == j.id) {
            i.medicines_available.forEach(function (k) {
              if (k.name == medicine_name && k.available == "1") {
                ma = 1;

                available_stores.push(j);
              }
            });
          }
        });
      });

      setTimeout(() => {
        if (ma == 1) {
          tempstores = available_stores;
          available_stores = [];
          ma=0;
          res.render("deleteafter", {
            htmlstores: tempstores,
            Name: client_name,
          });
        }
      }, 2000);
    });
  }

 
});

app.get("/signupclient", function (req, res) {
  res.render("signup");
});

app.post("/signupclient", function (req, res) {
  res.render("signup");
});

app.post("/signup1", function (req, res) {
  const firstName = req.body.firstname;
  const lastName = req.body.lastname;
  const email = req.body.email;
  const loginid = req.body.login_id;
  const client = new Client({
    clientName: firstName + " " + lastName,
    address: req.body.address,
    email_id: req.body.email,
    password: req.body.psw,
    login_id: req.body.login_id,
    review: req.body.review,
  });

  client.save();
  res.redirect("/client");
});

app.get("/logout1", function (req, res) {
  flag1 = false;
  res.redirect("/client");
});

app.get("/pharmacist",function(req,res){
    flag2=false;
    meditems1=[];
    meditems2=[];
    meditems3=[];
    meditems4=[];
    Alloitems=[];
    Ayuritems=[];
    Homeoitems=[];
    vititems=[];
    logid2="";
    pushed_med=0;
    res.render("login_pharmacist",{loginerror:text2});
    
});

app.post("/pharmacist",function(req,res){
    logid2=req.body.login_id;
    // Pharmacist.find({login_id:logid2},function(err,docs)
    // {
    //     if(err)
    //     {

    //     }
    //     name2=docs[0].pharmacist_name;
    // })
    const pass=req.body.psw;
    Pharmacist.find({login_id:logid2},function(err,docs){
        if(err){
           console.log("There was an error");
        }
        else{
            console.log(docs);
            if(docs.length==0){
                text2="The login id doesn't exist..please signup or try again";
                res.redirect("/pharmacist");
            }
            else{
               if(pass==docs[0].password){
                   flag2=true;
                   name2=docs[0].pharmacist_name;
                   res.redirect("/after_login2");
               }
               else{
                   text2="You entered wrong password";
                   res.redirect("/pharmacist");
               }
            }
        }
    });
    
});

app.get("/after_login2", function(req,res){
    if(flag2){
        
        Pharmacist.find({login_id:logid2},function(err,result)
        {
            console.log(logid2);
            if(err){
            console.log(err);}
            else{
              console.log("medicine available");
              // console.log(result);
              //   console.log(result[0].medicines_available);
                for(var i=0;i<result[0].medicines_available.length;i++)
                {
                 
                    if(String(result[0].medicines_available[i].brand)=="Allopathy" && pushed_med==0)
                    {
                        // meditems1.push(result[0].medicines_available[i].name);
                        Alloitems.push(result[0].medicines_available[i].name);
                    }
                    else if(String(result[0].medicines_available[i].brand)=="Homeopathy" && pushed_med==0)
                    {
                        // meditems3.push(result[0].medicines_available[i].name);
                        Homeoitems.push(result[0].medicines_available[i].name);
                    }
                    else if(String(result[0].medicines_available[i].brand)=="Ayurveda" && pushed_med==0)
                    {
                        // meditems2.push(result[0].medicines_available[i].name);
                        Ayuritems.push(result[0].medicines_available[i].name);
                    }
                    else if(result[0].medicines_available[i].brand=="Vitamins and Supplements" && pushed_med==0)
                    {
                        // meditems4.push(result[0].medicines_available[i].name);
                        vititems.push(result[0].medicines_available[i].name);
                    }
                }
                // console.log(result[0].medicines_available[10].name);
            }
                pushed_med=1;
                res.render("pharmacist",{Name:name2,med1:Alloitems,med2:Ayuritems,med3:Homeoitems,med4:vititems,addmed1:meditems1,addmed2:meditems2,addmed3:meditems3,addmed4:meditems4});
            
           
        });
    }
    else
    {
        res.redirect("/pharmacist");
    }
});

app.post("/after_login2",function(req,res){
    if(flag2){
    if(req.body.button=="add1")
    {
       meditems1.push(req.body.medtext1);
       res.redirect("/after_login2");
    }
    if(req.body.button=="add2")
    {
       meditems2.push(req.body.medtext2);
       res.redirect("/after_login2");
    }
    if(req.body.button=="add3")
    {
       meditems3.push(req.body.medtext3);
       res.redirect("/after_login2");
    }
    if(req.body.button=="add4")
    {
       meditems4.push(req.body.medtext4);
       res.redirect("/after_login2");
    }
    if(req.body.button=='submit')
    {
        Pharmacist.updateOne({login_id:logid2},{"$set":{medicines_available:[]}},function(err){
            if(err){
                console.log(err);
            }
            else{
                console.log("deleted");
            }
        });
        var request=req.body;
        var result = Object.keys(request).map((key) => [(key), request[key]]);
        result.forEach(function(i){
            if(i[1]=='1' || i[1]=='0')
            {
                var bran="";
                if(meditems1.includes(i[0])|| Alloitems.includes(i[0]))
                {
                    bran="Allopathy";
                }
                else if(meditems2.includes(i[0]) || Ayuritems.includes(i[0]))
                {
                    bran="Ayurveda";
                }
                else if(meditems3.includes(i[0]) || Homeoitems.includes(i[0]))
                {
                    bran="Homeopathy";
                }
                else if(meditems4.includes(i[0]) || vititems.includes(i[0]))
                {
                    bran="Vitamins and Supplements";
                }
                var med={"name":i[0],"available":i[1],"brand":bran};
                console.log("reaching pharma side");
            Pharmacist.updateOne({login_id:logid2},{"$push":{medicines_available:med}},function(err){
            if(err){
                console.log(err);
            }
            else{
                meditems1=[];
                meditems2=[];
                meditems3=[];
                meditems4=[];
                pushed_med=0;
                Alloitems=[];
                Homeoitems=[];
                vititems=[];
                Ayuritems=[];
                console.log("updated");
            }
        });
                       
            }
        }); 
    console.log(req.body);
    res.redirect("/after_login2");
     }
    }
    else
    {
        res.redirect("/pharmacist");
    }
});
app.get("/signup",function(req,res){
    res.render("signupstore");
});

app.post("/signup",function(req,res){
    res.render("signupstore");
});

app.post("/signup2",function(req,res){
    const firstName=req.body.firstname;
    const lastName=req.body.lastname;
    const email=req.body.email;
    const loginid=req.body.login_id;
    const pharmacist=new Pharmacist({
        pharmacist_name:firstName+" "+lastName,
        email_id:req.body.email,
        password:req.body.psw,
        login_id:req.body.login_id,
        phone_no:req.body.phoneno,
        store_name:req.body.medstrname,
        timings:"",
        open_close:true,
        medicines_available:[],
    });
    pharmacist.save();
    res.redirect("/pharmacist");
});

app.get("/logout2",function(req,res){
    flag2=false;
    res.redirect("/pharmacist");
});


app.listen(3000, function () {
  console.log("Server is running!!");
});

  