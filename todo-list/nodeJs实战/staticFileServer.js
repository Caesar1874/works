
var http = require("http");
var url = require("url");
var path = require("path");
var fs = require("fs");

// 当前脚本的目录名
var root = __dirname;


var server = http.createServer(function(req, res) {

    // 绝对路径： dirname + url的pathname
    var pahtname = url.parse(req.url).pathname;
    var path = path.join(root, pathname);

    // 检查文件
    fs.stat(path, function(err, stat) {
        if(err) {
            if(err.code === "ENOENT") {
                res.statusCode = 404;
                res.end("Not Found");
            } else {
                res.statusCode = 500;
                res.end("Internal Server Error");
            }
        } else {
            res.setHeader("Content-Type", stat.size);
            // 读取文件
            var stream = fs.createReadStream(path);
            // 响应: response本身是可写流
            stream.pipe(res);
            // 错误处理
            stream.on("error", function(err) {
                res.statusCode = 500;
                res.end("Internal Server Error");
            });
        }
    });




/*    stream.on("data", function(chunk) {
        res.write(chunk);
    });
    stream.end("end", function() {
        res.end();
    })*/

});
server.listen(3000);



