
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

//To keep API keys private
const dotenv = require("dotenv").config();
const MAPI_KEY = process.env.API_KEY
const MLIST_ID = process.env.LIST_ID

//To make particular files accessible globally
app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
  res.sendFile( __dirname + "/signup.html")
});

app.post("/", function(req, res){

  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us9.api.mailchimp.com/3.0/lists/" + MLIST_ID;

  const option = {
    method: "POST",
    auth: "vedanti:" + MAPI_KEY
  }

  const request = https.request(url , option, function(response){

    if(response.statusCode === 200){
      res.sendFile(__dirname + "/success.html");
    }
    else {
      re.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function(data){
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();

});

app.post("/failure", function(req, res){
  res.redirect("/");
})

// process.env.PORT this is for dynamic port this port can host through server
app.listen(process.env.PORT || 3000 , function(){
  console.log("Server started at port 3000");
});
