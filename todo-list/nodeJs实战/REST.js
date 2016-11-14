
var http = require("http");
var url = require("url");
var path = require("path");
var fs = require("fs");

var items = [];
var server = http.createServer(function(req, res) {
    switch(req.method){
        // POST请求创建资源
        case "POST":
            postHandler(req, res);
            break;
        // GET请求获取资源
        case "GET":
            getHandler(req, res);
            break;
        // DELETE请求移除资源
        case "DELETE":
            delteHandler(req, res);
            break;
        default:
            console.log("不支持的方法");
    }
});

server.listen("8000", "localhost", function() {
    console.log("开始监听。。。");
})


function postHandler(req, res) {
    var item = "";
    req.setEncoding("utf8");
    console.log("response", req.response);
    req.on("data", function(chunk) {
        item += chunk;
    });
    req.on("end", function() {
        items.push(item);
        // 应将数据写入文件？
        res.end("OK/n");
        console.log("end ", item);
    });
}

function getHandler(req, res) {
    var pathname = pathnameHandler(req);

    // 如何处理多个get
    fs.exists(pathname, function(exists) {
        if(exists) {
            responseSuccess(res, pathname)
        } else {
            response404(res);
        }
    });

/*    var body = items.map(function(item, index) {
        return `${index}) ${item}`;
    }).join("\n");
    res.setHeader("Content-Length", Buffer.byteLength(body));
    res.setHeader("Content-Type", "text/plain; chatset = 'utf8'");
    res.end(body);*/
}

function pathnameHandler(req) {
    var pathname = __dirname + url.parse(req.url).pathname;
    console.log(pathname);
    // 获取扩展名
    if(path.extname(pathname) === "") {
        pathname += "/";
    }
    if(pathname.charAt(pathname.length - 1) === "/") {
        pathname += "index.html";
    }

    return pathname;
}

function response404 (res) {
    res.writeHead(404, {"Content-Type": "text/html"});
    res.end("<h1>404 Not Found</h1>");
}

function contentTypeHandler(pahtname) {
    var extname = path.extname(pahtname);
    return contentType = `text/${extname.slice(1)}`;

}

function responseSuccess(res, pathname) {
    var contentType = contentTypeHandler(pathname);
    res.writeHead(200, {"Content-Type": contentType});
    fs.readFile(pathname, "utf8", function(err, data) {
        if(err) {
            throw err;
        } else {
            res.end(data);
        }
    });
}

//




function delteHandler(req, res) {
    var pathname = url.parse(req.url).pathname;
    var index = Number(pathname.slice(1));

    if(isNaN(index)) {
        res.statusCode = 400;
        res.end("Invalid item id");
    } else if(!items) {
        res.statusCode = 404;
        res.end("Item not found");
    }else {
        items.splice(index, 1);
        res.end("OK\n");
    }
}