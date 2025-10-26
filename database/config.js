var MongoDb=require("mongoose");
module.exports.connection=()=>{
    MongoDb.connect("mongodb+srv://karthikganiga461:Karthik90711@karthik.4vhiagc.mongodb.net/Login_database?retryWrites=true&w=majority&appName=karthik")
    .then(()=>{
        console.log("MongoDb connected");
    })
    .catch(()=>{
        console.log("Cannot establish the connection");
    })
}
