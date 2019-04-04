const express = require('express')
const router = express.Router()

const multiparty = require('connect-multiparty')
const multipartyMiddeware = multiparty()

const fs = require('fs');

// app.use('/api/files', router)
// app.use(multiparty({uploadDir: './updata/'}))


router.get('/test', (req, res) => {
    res.json({ msg: 'heoo' })
})

router.post('/upload', multipartyMiddeware, (req, res) => {
    

    let filesData = req.files.file.path.split('\\')
    let outPath = filesData[filesData.length - 1]

    var source = fs.createReadStream(req.files.file.path);
    var dest = fs.createWriteStream('./updata/' + outPath);

    source.pipe(dest)

    source.on('end', function () { fs.unlinkSync(req.files.file.path); });   //delete
    source.on('error', function (err) { });

    res.json({uri: 'http://192.168.78.113:5000/api/files/img/' + outPath})
})

router.get('/downdata/:fileName', (req, res) => {
    res.download('./updata/' + req.params.fileName)
    // res.json({msg: 'hello world'})
})

router.get('/img/:fileName', (req, res) => {
    const rs = fs.createReadStream('./updata/' + req.params.fileName);//获取图片的文件名
    rs.pipe(res);
})

module.exports = router