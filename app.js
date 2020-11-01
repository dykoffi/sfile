const express = require('express');
const app = express();
const Files = require('./bd')
const createError = require('http-errors');
const logger = require('morgan');
const cookieparser = require('cookie-parser')
const path = require('path')
const multer = require('multer')
const cors = require('cors')
const storage = multer.diskStorage({
  destination: function (req, file, cb) { cb(null, `public/uploads/${req.params.object}`) },
  filename: function (req, file, cb) { cb(null, file.originalname) },
});
const upload = multer({ storage: storage }).array('fichier');
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieparser());
app.post('/upload/:object', (req, res) => {
  upload(req, res, function (err) {
    if (err) {
      return res.end("Error uploading file.");
    } else {
      console.log("1 fichier");
    }
    const fichiers = req.files.map(file => ({
      name: file.filename,
      size: file.size,
      type: file.mimetype.split('.').pop(),
      ext: file.filename.split('.').pop(),
      path: file.path.replace('public', ''),
    }))
    Files.bulkCreate(fichiers).then(() => {
      res.json(fichiers);
    }).catch((err) => {
      res.json({});
      console.log(err)
    })
  });
})
app.get('/list/files', (req, res) => {
  Files.findAll({
    order: [
      ['createdAt', 'DESC']
    ],
  }).then((data) => {
    res.json(data)
  }).catch((err) => {
    console.log(err);
  })
})
app.get('/download/:file', (req, res) => {
  res.download(`./public/uploads/cours/${req.params.file}`)
})
app.get('/*', (req, res) => {
  console.log("NOT FOUND : " + req.url);
})
app.use(function (req, res, next) { next(createError(404)); });
app.use(function (err, req, res, next) { console.log(err.message) });
module.exports = app;