const express = require('express')
const router = express.Router()

const Moment = require('../../models/Moment')

const jwt = require('jsonwebtoken')

const Secret = require('../../config/keys').Secret

// $router      GET     api/moments/test
// @desc        返回 moments 测试接口
// @access      public
router.post('/test', (req, res) => {
    res.json({ msg: 'moments interface success' })
})

// $router      POST     api/moments/add
// @desc        创建朋友圈
// @access      private
router.post('/add', (req, res) => {
    jwt.verify(req.headers.token, Secret, (err, data) => {
        if (err) {
            console.log(err)
            res.status(401).json({ msg: "token 验证失败" })
        } else {
            const MomentFields = {}
            if (data.id) MomentFields.userid = data.id
            if (req.body.text) MomentFields.text = req.body.text

            if (req.body.imgs) {
                MomentFields.imgs = req.body.imgs.split("|")
            }

            new Moment(MomentFields).save()
                .then(moment => {
                    res.json(moment)
                })
                .catch(err => {
                    console.log(err)
                    res.status(400).json({ msg: "保存数据失败" })
                })
        }
    })
})

// $router      GET      api/moments/latest
// @desc        下拉刷新
// @access      private
router.get('/latest', (req, res) => {
    jwt.verify(req.headers.token, Secret, (err, data) => {
        if (err) {
            console.log(err)
            res.status(401).json({ msg: 'token 验证失败' })
        } else {
            Moment.find().sort({ date: -1 })
                .then(moments => {
                    if (moments) {
                        let newMoments = []
                        for (let i = 0; i < 3; i++) {
                            if (moments[i] != null) {
                                newMoments.push(moments[i])
                            }
                        }
                        res.json(newMoments)
                    } else {
                        res.status(404).json({ msg: '没有任何消息' })
                    }
                })
                .catch(err => {
                    console.log(err)
                    res.status(400).json({ msg: '查询数据库失败' })
                })
        }
    })
})

// $router      GET      api/moments/:page/:size
// @desc        上拉加载
// @access      private
// 下拉刷新(请求)3条 上拉加载(请求)3条
router.get('/:page/:size', (req, res) => {
    console.log("pullup")
    jwt.verify(req.headers.token, Secret, (err, data) => {
        if (err) {
            console.log(err)
            res.status(401).json({ msg: 'token 验证失败' })
        } else {
            Moment.find().sort({ date: -1 })
                .then(moments => {
                    if(moments){
                        let size = req.params.size
                        let page = req.params.page
                        let index = size * (page - 1)
                        let newProfiles = []
                        for(let i = index; i < size * page; i++){
                            if(moments[i] != null){
                                newProfiles.unshift(moments[i])
                            }
                        }
                        res.json(newProfiles)
                    }else{
                        res.status(404).json({msg: '没有查询到任何数据'})
                    }
                })
                .catch(err => {
                    console.log(err)
                    res.status(404).json({ msg: "数据查询失败" })
                })
        }
    })
})


module.exports = router