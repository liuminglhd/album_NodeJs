var file = require("../models/file.js");
var fs = require("fs");
var path = require("path");
var formidable = require("formidable");
var date = require("silly-datetime");

//显示首页
exports.showIndex = function(req,res){
    file.getDirNames(function(dirs){
        res.render("index",{"name":dirs});
    });
};

//显示图片
exports.showPhoto = function(req,res,next){
    var album = req.params.album;
    file.getPhotosByAlbum(album,function(err,photo){
        if(err){
            next();
            return;
        }
        res.render("detail",{"album":album,"photo":photo});
    });
};

//上传图片
exports.showUpload = function(req,res){
    file.getDirNames(function(dirs){
        res.render("uploading",{"name":dirs});
    });
};

//处理上传图片
exports.handlePost = function(req,res){
    var form = new formidable.IncomingForm();
    form.multiples = true;
    form.uploadDir = "./uploads";
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

