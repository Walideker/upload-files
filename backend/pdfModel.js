const mongoose = require('mongoose');

const pdfSchema = mongoose.Schema({
    title: String,
    pdf: String,
});

const pdfModel = mongoose.model('pdf', pdfSchema, 'files');

module.exports = pdfModel;
