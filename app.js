const express = require("express");
const request = require("request");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.use(express.static("public"));
app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded({extended: true}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email =req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME : firstName,
          LNAME : lastName
        }
      }
    ]
  };
  const jsonData = JSON.stringify(data);

 const url =  "https://us6.api.mailchimp.com/3.0/lists/2d8775132d";
 const options = {
   method: "POST",
   auth: "renzell:61eaf12839d0db23c078bf4e55031f5b-us6"
 }
   const request = https.request(url, options, function(response) {

     if (response.statusCode === 200) {

         res.sendFile(__dirname + "/success.html");
         console.log(response.StatusCode);
     } else
      {
         res.sendFile(__dirname + "/failure.html");
         console.log(response.StatusCode);
      }


    response.on("data", function(data) {
      console.log(JSON.parse(data));
    })
})
request.write(jsonData);
request.end();
})

app.post("/failure", function(req, res) {
  res.redirect("/");
})
app.listen(process.env.PORT || 3000, function(){
  console.log("Server is runnin on port 3000.");
});

//Api key 61eaf12839d0db23c078bf4e55031f5b-us6
//list id 2d8775132d
