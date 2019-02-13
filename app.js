const fs = require('fs');
const http = require('http')
const path = require('path')

const mime = require('mime')

// 网站根目录
var rootPath = path.join(__dirname,'www')

// 创建服务器
let server = http.createServer((request,response)=>{
    // response.end('hello world')
    // 生成路径
    var targetPath = path.join(rootPath, request.url);
    // 判断路径是否存在  是否文件夹 文件->渲染  文件夹=>渲染列表
    if(	fs.existsSync(targetPath)){
        
        fs.stat(targetPath, function (err, stats) {
            if(stats.isFile()){ // 是否是文件
                // 设置编码格式
                response.setHeader('content-type', mime.getType(targetPath));
                fs.readFile(targetPath,(err,data)=>{
                    response.end(data)
              })
            }
            if(stats.isDirectory()){
                fs.readdir(targetPath, (err,files)=>{
                    let tem = ``;
                    files.forEach((value,index)=>{
                        tem += `
                        <li>
                            <a href="${request.url}${request.url=='/'?'':'/'}${value}">${value}</a>
                        </li>
                        `
                    })
                    response.end(`<!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <meta http-equiv="X-UA-Compatible" content="ie=edge">
                        <title>Document</title>
                    </head>
                    <body>
                        <ul>
                            ${tem}
                        </ul>
                        
                    </body>
                    </html>`)
                })
            }
        })
    }else{
        // 路径不存在
        // 只能设置头 不能设置状态码
        response.statusCode = 404;
        response.setHeader('content-type','text/html;charset=utf-8')
        response.end(`<!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <meta http-equiv="X-UA-Compatible" content="ie=edge">
                        <title>404 Not Found</title>
                    </head>
                    <body>
                        <h3>
                            你请求的${request.url}不存在哦
                        </h3>
                        
                    </body>
                    </html>`)
    }
})
// 开启监听
server.listen(80,'127.0.0.1',()=>{
    console.log('port:80')
})