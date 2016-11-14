var express = require("express");
var fs = require("fs");
var app = express();

app.get("/", function(req, res) {
 fs.createReadStream("./todoList.html").pipe(res);
 // res.send()
 });

app.use("/static", express.static("public"))
app.listen(3000, function() {
    console.log("listening...");
});

