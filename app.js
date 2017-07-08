//程序入口
//一般只作为入口，其他功能在相应的MVC层实现
var express = require("express");
//设置依赖的模块,controller作为一个依赖模块文件夹口
var router = require("./controller");
var app = express();
app.listen(4000);
//设置静态文件(静态伺服能力)
app.use(express.static("./public"));
app.use(express.static("./uploads"));
//设置视图模板引擎(需要ejs)
app.set("view engine","ejs");
//进入主页
app.get("/",router.showIndex);
//显示相册/
app.get("/:album",router.showPhoto);
//app.get("/album/:id",router.showPhoto);
//上传
app.get("/uploading",router.showUpload);
app.post("/uploading",router.handlePost);
//处理错误页面——当前面请求路径都不符合就进入404页面,这时候使用中间件
//判断范围由精确到模糊
app.use(function(req,res){
    res.render("err");
});

