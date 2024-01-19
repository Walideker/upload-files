const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const multer = require('multer');
const pdfModel = require('./pdfModel')

app.use(express.json());
app.use('/uploaded-files', express.static('files', {
    setHeaders: (res, path, stat) => {
        res.set('Content-Type', 'application/pdf');
    },
}));
app.use(cors());
app.options('/upload-files', cors());
mongoose.connect('mongodb://127.0.0.1:27017/dragfiles')
    .then(() => {
        console.log('database connected');
    })
    .catch((err) => {
        console.log(err);
    });

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './files');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        cb(null, uniqueSuffix + file.originalname);
    }
});

const upload = multer({ storage: storage });
//
app.post('/upload-files', upload.single('file'), async (req, res) => {
    console.log(req.file);
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const title = req.body.title;
    const fileName = req.file.filename;

    try {
        await pdfModel.create({ title, pdf: fileName });
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});


app.get('/get-files', async (req, res) => {
    try {
        pdfModel.find({})
            .then((data) => {
                res.send({ status: 'ok', data: data })
            })
    } catch (error) {

    }
})


app.use('/uploaded-files', express.static('files'));

app.listen(3000, () => {
    console.log('server is live');
});
