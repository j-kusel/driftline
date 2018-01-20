var request = require('request-promise');
var cheerio = require('cheerio');
var Regex = require('regex');
var mongoose = require('mongoose');
var db = require('./config/mongoose')();


var Mail = mongoose.model('Mail');

var regexs = {
    page: /[a-zA-Z\-]+\.[0-9]+/,
    body_filter: /<\/font>([\s\S]+)_{10,}/
};

var crawl = {
    indices: function (body) {
            var dg_index = [];
            var $ = cheerio.load(body);
            $('a').each(function(index) {
                var link = $(this);
                if (regexs.page.test(link.text())) {
                    dg_index.push(link.attr('href'));
                }
            });
            return dg_index;
        },
    emails: function (body) {
            var $ = cheerio.load(body);
            var dg_emails = [];
            $('table tr').each(function(index) {
                var cols = $(this).find('td');
                var mail = {
                    link: $(cols[0]).find('a').attr('href'),
                    date: $(cols[1]).text(),
                    sender: $(cols[2]).text(),
                    subject: $(cols[3]).text()
                }
                dg_emails.push(mail);
            });
            return dg_emails;
        },
    bodies: function (body) {
            if (body) {
                var $ = cheerio.load(body);
                var regmatch = regexs.body_filter.exec($('.text').html());
                if (regmatch.length > 1) return regmatch[1];
                return '';

            } else {
                console.log('no body');
                return '';
            }
        }
}

var all_emails = [];

request(
    'http://www.driftline.org/cgi-bin/archive/archive.cgi?list=deleuze-guattari')
    .then(crawl.indices)
    .then((indices) => {
        indices.forEach((index) => {
            request(index)
                .then(crawl.emails)
                .then((emails) => {
                    if (emails.length) {
                        emails.forEach((email, index) => {
                            const mail = new Mail(email);
                            mail.save((err) => {
                                console.log(err);
                            });
                            /* request(email.link)
                                .then(crawl.bodies)
                                .then((mailbody) => {
                                    emails[index].body = mailbody;
                                    const mail = new Mail(emails[index]);
                                    mail.save((err) => {
                                        // console.log(err);
                                    });
                                })
                                .catch((err)=>{console.log(err)}); */
                        });
                    }
                })
                .catch((err)=>{console.log(err)});
        })
    })
    .catch((err)=>{console.log(err)});
    
//console.log(dg_index);

/*dg_index.forEach(function (href) {
    console.log(href);
    request(href,     });
});*/



        

