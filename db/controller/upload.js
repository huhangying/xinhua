/**
 * Created by harry on 16/12/2.
 */
var formidable = require('formidable'),
    util = require('util'),
    fs = require('fs');

module.exports = {

    receiveFile: function(req, res){
        // parse a file upload
        var form = new formidable.IncomingForm();
        form.encoding = 'utf-8';
        //form.keepExtensions = true;
        //form.uploadDir = "/home/wwwroot/product.geiliyou.com/ciwen/upload";

        form.parse(req, function (err, fields, files) {

            res.writeHead(200, {'content-type': files.file.type});
            // res.writeHead(200, {'content-type': 'multipart/form-data'});
            //res.write('received upload:\n\n');
            res.end(util.inspect({fields: fields, files: files}));

            //fs.rename 类似于 move
            var relativeDir = '';
            if (req.params && req.params.dir) {
                relativeDir = req.params.dir + '/';
            }
            fs.rename(files.file.path, 'public/upload/' + relativeDir + files.file.name, function (err) {
                if (err) throw err;
            });
        });
        return;
    },

    getFolderImageList: function(req, res){
        var baseImageServer = 'http://139.224.68.92:81/';

        if (req.params && req.params.dir) { // params.id is WeChat ID
            var dir = 'public/upload/' + req.params.dir;
            fs.realpath(dir, function(err, path) {
                if (err) {
                    res.json({return: "没有该目录"});
                }

                if (!fs.existsSync(dir)){
                    fs.mkdirSync(dir);
                }

                // console.log('Path is : ' + dir);
            });
            fs.readdir(dir, function(err, files) {
                if (err) return;
                var fileNameList = [], i, ext;
                var path = baseImageServer + req.params.dir + '/';
                files.forEach(function(filename) {
                    i = filename.lastIndexOf('.');
                    if (i > 0) {
                        ext = filename.substr(i).toLowerCase();
                        if (ext === '.jpg' || ext === '.jpeg') {
                            fileNameList.push(path + filename);
                        }
                    }
                });
                return res.json(fileNameList);
            });
        }

    },
};