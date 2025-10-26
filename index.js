var express=require("express");
var app=express();
var cors=require("cors");
var bodyparser=require("body-parser");

app.use(cors());
app.use(bodyparser.json());
app.use(express.json()); // parses JSON body
app.use(express.urlencoded({ extended: true })); // parses URL-encoded body


var database=require("./database/config");
database.connection();

app.use(require("./routes/newUserData"));



app.listen(4000,()=>{console.log("Server is running in the http://localhost:4000")})