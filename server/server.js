require("dotenv").config();

var express = require("express");
var app = express();
var port = process.env.PORT || 3000;

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get("/", function (req, res) {
  res.send("OK");
});

console.log(`Starting up`);

app.listen(port);
