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

        form.parse(req, function(err, fields, files) {

            res.writeHead(200, {'content-type': 'text/plain'});
            //res.write('received upload:\n\n');
            res.end(util.inspect({fields: fields, files: files}));

            //fs.rename 类似于 move
            fs.rename(files.file.path, 'public/upload/' + files.file.name, function(err) {
                if (err) throw err;
            });
        });
        return;
    },
};