const mongoose = require('mongoose');
const cheerio = require('cheerio');
const db = require('./config/mongoose')();
const request = require('request');

var Mail = mongoose.model('Mail');

var stagger = 0;
var interval = 250;

Mail
    .find(function (err, mail) {
        mail.forEach(function(email) {
            stagger += interval;
            console.log(email.link);
            setTimeout(request, stagger, email.link, function (err, res, body) {
                if (err) {
                    console.log(err);
                } else {
                    var $ = cheerio.load(body);
                    var raw = /<\/font>([\s\S]+)_{10,}/.exec($('.text').html());
                    var body;
                    if (raw) body = raw[1]
                        else body = '';
                    Mail.findOneAndUpdate({_id: email._id}, {body: body}, function(err, doc) {
                    if (doc) {
                        console.log(doc._id);
                    }
                });
            }
            });
        });
    });
        
