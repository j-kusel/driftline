markov = require('./output.json');

module.exports = function(count) {
    var node = 'the';
    var phrase = [];
    while (count--) {
        if (markov[node].next.length) {
            var target = Math.floor(Math.random() * markov[node].next.length);
            var current = markov[node].next[target];
            phrase.push(current);
            node = current;
        } else {
            count = 0;
        }
    };
    return combine(phrase);
};

var combine = function(phrase) {
    var last = phrase[0];
    var tweet = '';
    phrase.forEach(function (word) {
        if (last != word) {
            if (!(word == '.' || word == ',')) {
                tweet = tweet.concat(last).concat(' ');
            } else {
                tweet = tweet.concat(last);
            }
        }
        last = word;
    });
    tweet = tweet.concat(last);
    tweet = tweet.concat('.');
    return tweet;
}
