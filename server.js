// 创建服务器
const express = require('express')
const app = express()

// 使用 body 解析器, 用于解析 body
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())

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

// 使用自定义路由
const users = require('./routes/api/users')
const moments = require('./routes/api/moments')
app.use('/api/users', users)
app.use('/api/moments', moments)

// 开启服务器监听器
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server Running On Port ${port}`)
})