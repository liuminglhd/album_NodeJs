//程序入口
var express = require("express");
var router = require("./controller");
var app = express();
app.listen(4000);
app.use(express.static("./public"));
app.use(express.static("./uploads"));
app.set("view engine","ejs");
app.get("/",router.showIndex);
app.get("/:album",router.showPhoto);
//app.get("/album/:id",router.showPhoto);
app.get("/uploading",router.showUpload);
app.post("/uploading",router.handlePost);
app.use(function(req,res){
    res.render("err");
});

