const express = require('express')
const router = express.Router()
const app = require('../../server')

const multiparty = require('connect-multiparty')
const multipartyMiddeware = multiparty()

const fs = require('fs');

// app.use('/api/files', router)
// app.use(multiparty({uploadDir: './updata/'}))

router.get('/test', (req, res) => {
    res.json({msg: 'heoo'})
})

router.post('/upload', multipartyMiddeware, (req, res) => {
    console.log(req.files)

    let filesData = req.files.file.path.split('\\')
    let outPath = filesData[filesData.length - 1]

    var source = fs.createReadStream(req.files.file.path);
    var dest = fs.createWriteStream('./updata/' + outPath);

    source.pipe(dest)

    source.on('end', function() { fs.unlinkSync(req.files.file.path);});   //delete
    source.on('error', function(err) {  });

    res.json({msg: 'success'})
})

module.exports = router