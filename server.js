// 创建服务器
const express = require('express')
const app = express()

// 上传文件
// const multiparty = require('connect-multiparty')
// 定义上传的路径
// app.use(multiparty({uploadDir: './updata/'}))

// 使用 body 解析器, 用于解析 body
const bodyParser = require('body-parser')
// 最大传多大的文件 limit:'100mb'
app.use(bodyParser.urlencoded({ limit:'100mb',extended: false}))
app.use(bodyParser.json({limit:'100mb'}))

// 链接 mongoDB 数据库
const MongoURI = require('./config/keys').MongoURI
const mongoose = require('mongoose')
mongoose.connect(MongoURI, {useNewUrlParser: true})
    .then(res => {
        console.log('MongoDB connect success')
    })
    .catch(err => {
        console.log(err)
    })

//设置允许跨域访问该服务.
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*')
//     //Access-Control-Allow-Headers ,可根据浏览器的F12查看,把对应的粘贴在这里就行
//     res.header('Access-Control-Allow-Headers', 'Content-Type')
//     res.header('Access-Control-Allow-Methods', '*')
//     next();
//   })

// 使用自定义路由
const users = require('./routes/api/users')
const moments = require('./routes/api/moments')
const files = require('./routes/api/files')
app.use('/api/users', users)
app.use('/api/moments', moments)
app.use('/api/files', files)

// 开启服务器监听器
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server Running On Port ${port}`)
})

module.exports = app