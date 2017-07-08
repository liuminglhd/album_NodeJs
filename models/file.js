//model层文件读取
var fs = require("fs");
//由于异步读取文件,controller层填充模板在读取结果前
//所以填充模板没有数据,通过回调函数解决
exports.getDirNames = function(callback){
    //读取文件夹下所有内容
    fs.readdir("./uploads",function(err,data){
        var dirNames = [];
        //判断是否为文件夹fs.stat异步,通过迭代器解决异步问题
        (function iterator(i){
            if(i == data.length){
                callback(dirNames);
                return;
            }
            //判断是否为文件夹
            fs.stat("./uploads/"+data[i],function(err,stats){
                if(stats.isDirectory()) dirNames.push(data[i]);
                //在异步完成后再处理下一个,所以迭代位置在异步判断内
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
        //判断是否为文件
        (function iteration(i){
            if(i == data.length){
                //这里的null就是router.js回调函数的实参中err
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
