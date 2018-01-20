const mongoose = require('mongoose');

const db = require('./config/mongoose')();

const Mail = mongoose.model('Mail');

var markov = {};

var regexps = {
    tokenize: /([\w'-]+)|(\.)|(\,)/g,
    period: /\.$/,
    comma: /,$/
}

var banned = {
    gt: 1,
    quot: 1,
    AT: 1,
    cgi: 1,
    apos: 1,
    listinfo: 1,
    amp: 1,
    org: 1,
    com: 1,
    fastmail: 1,
    blogspot: 1,
    listserv: 1,
    ISBN: 1,
    'deleuze-guattari-driftline': 1,
    'deleuze-guattari-AT-driftline': 1,
    yahoo: 1,
    'E-Mail-Modul': 1,
    'http': 1,
    '_______________________________________________': 1
};

var walk = function(chain, count) {
    var node = 'the';
    var tweet = [];
    while (count--) {
        if (chain[node].next.length) {
            var target = Math.floor(Math.random() * chain[node].next.length);
            var current = chain[node].next[target];
            tweet.push(current);
            node = current;
        } else {
            count = 0;
        }
    };
    return tweet;
};

var follows = function(token, last) {
    if (!(token in banned) && (banned[token] === 1)) {
        console.log(banned[token]);
        return false;
    }
    if (last in banned) {
        console.log(last);
        if (token in banned[last]) {
            return false;
        }
    }
    return true;
};
    

var clean = function(token, last) {
    if ((token != last) &&
        (!(token in banned))) {
            return true;
        }
    return false;
}

var populate = function() {
            
    Mail
        .find({}, function (err, mail) {
            mail.forEach(function (email) {
                var match = {};
                if (email.body) {
                    match = email.body.match(regexps.tokenize);
                    var last = '';
                    match.forEach((token) => {
                        if (last) {
                            if (!(last in markov)) {
                                markov[last] = {
                                    frequency: 0,
                                    next: []
                                }
                            }
            
                            if (clean(token, last)) {
                                markov[last].frequency++;
                                markov[last].next.push(token);
                            }
                        }
                        last = token;
                    });
                }
            }); 
            console.log(walk(markov, 24));
        });
};

var test = function (phrase) {
    var match = {};
    var markov = {};
    match = phrase.match(regexps.tokenize);
    var last = '';
    match.forEach((token) => {
        if (last) {
            if (!(last in markov)) {
                markov[last] = {
                    frequency: 0,
                    next: []
                }
            }
            
            markov[last].frequency++;
            markov[last].next.push(token);
        }
        last = token;
    });
    console.log(markov);
};
    
// test('this is a sentence. and this is another one, here are a few more.');
populate();

