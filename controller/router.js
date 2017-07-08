//作为处理url地址的js文件,这是进入主页的主文件main
//数据的读取属于model层
var file = require("../models/file.js");
//处理文件用formidable
var fs = require("fs");
var path = require("path");
var formidable = require("formidable");
var date = require("silly-datetime");
//---------------------------------------------------------------------------------------
//显示首页
exports.showIndex = function(req,res){
    //填充index.ejs模板
    //由于异步读取文件,controller层填充模板在读取结果前
    //所以填充模板没有数据,通过回调函数解决
    file.getDirNames(function(dirs){
        res.render("index",{"name":dirs});
    });
};
//---------------------------------------------------------------------------------------
//显示图片
exports.showPhoto = function(req,res,next){
    //获取相册名称
    //这里是app.js判断路由,album是app.js中的/:album
    var album = req.params.album;
    //根据相册名称读取对应路径下的内容
    file.getPhotosByAlbum(album,function(err,photo){
        if(err){
            next();
            return;
        }
        res.render("detail",{"album":album,"photo":photo});
    });
};
//---------------------------------------------------------------------------------------
//上传图片
exports.showUpload = function(req,res){
    file.getDirNames(function(dirs){
        res.render("uploading",{"name":dirs});
    });
};
//---------------------------------------------------------------------------------------
//处理上传图片
exports.handlePost = function(req,res){
    var form = new formidable.IncomingForm();
    form.multiples = true;
    //保留后缀
    //keepExtensions = true;
    //文件大小
    //form.maxFieldsSize = 2*1024*1024;
    form.uploadDir = "./uploads";
    //多文件上传由于单文件不以数组形式放入files参数中,需要通过文件读取方法写入数组中
    //这样在处理时遍历文件数组,单文件不会出现问题
    var ff=[];
     form.on("file",function (name,file) {
         ff.push(file);
     });
    form.parse(req,function(err,fields,files) {
        (function iterator(i) {
            if (i == ff.length) {
                res.redirect(fields.dirs);
                return;
            }
            // 按时间命名
            var time = date.format(new Date, "YYYYMMDD");
            var random = parseInt(Math.random() * 99999 + 100000);
            var suffix = path.extname(ff[i].name);
            var newpath = "uploads/" + fields.dirs + "/" + time + random + suffix;
            fs.rename(ff[i].path, newpath, function (err, data) {
                if (err) {
                    res.send("改名失败");
                    return;
                }
                iterator(i + 1);
            });
        })(0);
    });
};

