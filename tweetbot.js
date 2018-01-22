const generator = require('./generator');
const Twitter = require('twitter');
const tw_config = require('./config/twitter');

var client = new Twitter(tw_config);
var params = {screen_name: 'driftlineebooks'};

var log_all = function() {
    client.get('statuses/user_timeline', params, function(err, tweets, res) {
        if (!err) {
            console.log(tweets);
        }
    });
};

var post_tweet = function(phrase) {
    client.post('statuses/update', {status: phrase}, function(err, tweet, res) {
        if (err) throw err;
        console.log(res);
    });
};

post_tweet(generator(24));
