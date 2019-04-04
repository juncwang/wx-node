const express = require('express')
const router = express.Router()

const User = require('../../models/User')

const jwt = require('jsonwebtoken')
const gravatar = require('gravatar')
const md5 = require('md5')

const Secret = require('../../config/keys').Secret

// $router      GET     api/users/test
// @desc        返回 users 测试接口
// @access      public
router.get('/test', (req, res) => {
    res.json({ mse: 'users interface success' })
})

// $router      POST       api/users/register
// @desc        注册 wx 用户
// @access      public
router.post('/register', (req, res) => {

    User.findOne({ email: req.body.email })
        .then(user => {
            if (user) {
                res.status(400).json({ msg: "用户邮箱已存在" })
            }else{
                avatar = gravatar.url(req.body.email, { s: '200', r: 'pg', d: 'mm' })
                const newUser = new User({
                    username: req.body.username,
                    email: req.body.email,
                    password: md5(req.body.password),
                    avatar: avatar
                })
                newUser.save()
                    .then(user => {
                        res.json(user)
                    })
                    .catch(err => {
                        console.log(err)
                        res.status(400).json({ msg: "注册用户失败" })
                    })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(400).json({ msg: "查询数据库失败" })
        })
})

// $router      POST       api/users/login
// @desc        登录 wx 用户, 返回 token
// @access      public
router.post('/login', (req, res) => {
    User.findOne({email: req.body.email})
        .then(user => {
            if(user){
                if(user.password === md5(req.body.password)){
                    const rule = {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        avatar: user.avatar
                    }
                    jwt.sign(rule,Secret,{expiresIn: 3600}, (err, data) => {
                        if(err){
                            console.log(err)
                            res.status(400).json({msg: "token 生成失败"})
                        }else{
                            res.json({token: data})
                        }
                    })
                }else{
                    res.status(400).json({msg: "密码或账户错误"})
                }
            }else{
                res.status(400).json({msg: "密码或账户错误"})
            }
        })
        .catch(err => {
            console.log(err)
            res.status(400).json({msg: "查询数据库失败"})
        })
})

// $router      GET     api/users/:id
// @desc        通过 token 获取用户数据
// @access      private
router.get('/getUserById/:id', (req,res) => {
    jwt.verify(req.headers.token, Secret, (err, data) => {
        if(err) {
            console.log(err)
            res.status(401).json({msg: 'token 验证失败'})
        }else{
            User.findById(req.params.id)
                .then(user => {
                    if(user){
                        res.json(user)
                    }else{
                        res.status(400).json({msg: "没有查询到数据"})
                    }
                })
                .catch(err => {
                    console.log(err)
                    res.status(400).json({msg: "查询数据库失败"})
                })
        }
    })
})

// $router      GET     api/users/current
// @desc        通过 token 获取用户数据
// @access      private
// router.get('/current', (req, res) => {
//     jwt.verify(req.headers.token, Secret, (err, data) => {
//         if(err) {
//             console.log(err)
//             res.status(401).json({msg: 'token 验证失败'})
//         }else{
//             res.json(data)
//         }
//     })
// })

module.exports = router