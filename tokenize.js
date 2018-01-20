const mongoose = require('mongoose');

const db = require('./config/mongoose')();

const Mail = mongoose.model('Mail');

markov = {};

var regexps = {
    tokenize: /(\S)+/g,
    period: /\.$/,
    comma: /,$/
}

var walk = function(chain, count) {
    var node = 'the';
    while (count--) {
        if (chain[node].next.length) {
            var target = Math.floor(Math.random() * chain[node].next.length);
            var current = chain[node].next[target];
            console.log(current);
            node = current;
        } else {
            count = 0;
        }
    };
};

            
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
                                comma: 0,
                                period: 0,
                                next: []
                            }
                        }
        
                        markov[last].frequency++;
                        markov[last].next.push(token);
    
                    }
                    last = token;
                });
            }
        });
        walk(markov, 12);
    });


