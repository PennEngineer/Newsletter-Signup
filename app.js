const express = require("express");
const bodyParser= require("body-parser");
const request = require("request");
const https = require("https");
const { response } = require("express");
const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));



app.listen(process.env.PORT || 3000, ()=>{
    console.log("Our app is running on port " + process.env.PORT);
})

app.get("/",(req,res)=>{
    res.sendFile(__dirname + "/signup.html");
})

app.post("/",(req,res)=>{
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.email;
    var data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };
    const jsonData = JSON.stringify(data);
    //enter list ID after lists/
    const url = 'https://us14.api.mailchimp.com/3.0/lists/';
    const options = {
        method: "POST",
        //fill in any string username in anystring and add your api in API field
        auth: "anystring:api"
    }
    const request = https.request(url, options, (response)=>{
        if(response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        }
        else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", (data)=> {
            console.log(JSON.parse(data));
        })
    })
    request.write(jsonData);
    request.end();
});