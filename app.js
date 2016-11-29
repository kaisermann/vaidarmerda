const fs = require('fs');
const TwitterPackage = require('twitter');
const secret = JSON.parse(fs.readFileSync("./secret.json"));
const phrases = JSON.parse(fs.readFileSync("./phrases.json"));
const Twitter = new TwitterPackage(secret);

Twitter.stream('statuses/filter', {
  track: '#VaiDarMerda'
}, stream => {

  stream.on('data', tweet => {

    const randomIndex = Math.round(Math.random() * phrases.length);
    const replyObj = {
      in_reply_to_status_id: tweet.id_str,
      status: `@${tweet.user.screen_name} ${phrases[randomIndex]}`
    };
    const replyCallback = (error, tweetReply) => {
      console.log(`${error ? error : `[Reply] '${tweetReply.text}'`}`);
    };

    console.log(`[Incoming] '@${tweet.user.screen_name} ${tweet.text}'`);
    Twitter.post('statuses/update', replyObj, replyCallback);
  });
  stream.on('error', error => console.log(error));
});
