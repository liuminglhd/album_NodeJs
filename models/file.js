//model层
var fs = require("fs");
exports.getDirNames = function(callback){
    fs.readdir("./uploads",function(err,data){
        var dirNames = [];
        //判断是否为文件夹fs.stat异步,通过迭代器解决异步问题
        (function iterator(i){
            if(i == data.length){
                callback(dirNames);
                return;
            }
            fs.stat("./uploads/"+data[i],function(err,stats){
                if(stats.isDirectory()) dirNames.push(data[i]);
                iterator(i+1);
            });
        })(0);
    });
};
//----------------------------------------------------------------------
exports.getPhotosByAlbum = function(album,callback){
    fs.readdir("./uploads/"+ album,function(err,data){
        if(err){
            callback("没有找到该路径下的文件夹",null);
            return;
        }
        var files = [];
        (function iteration(i){
            if(i == data.length){
                callback(null,files);
                return;
            }
            fs.stat("./uploads/"+ album + "/" +data[i],function(err,stats){
                if(err){
                    callback("该文件不存在："+data[i],null);
                    return;
                }
                if(stats.isFile()) files.push(data[i]);
                iteration(i+1);
            })
        })(0);
    });
};
