const mongoose = require('mongoose');

mongoose.Promise = require('bluebird');

var Schema = mongoose.Schema;

const MailSchema = new Schema({
    link: {
        type: String,
        unique: true
    },
    date: String,
    sender: {
        type: String,
        trim: true
    },
    subject: String,
    body: String
}, {
    autoIndex: false
});

module.exports = function () {
    const db = mongoose.connect('mongodb://localhost/driftline');
    mongoose.model('Mail', MailSchema)
        .on('index', (err) => {
            console.log('indexing error: ' + err.message);
        });
    return db;
};
