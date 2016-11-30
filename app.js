const fs = require('fs');
const j = require('path').join;
const gm = require('gm');
const md5 = require('md5');
const phantom = require('phantom');
const secret = JSON.parse(fs.readFileSync('./secret.json', 'utf8'));
const htmlTemplate = fs.readFileSync("./template.html", 'utf8');
const T = new require('twitter')(secret);

const bgs = fs.readdirSync('./assets/bgs');
const phrases = JSON.parse(fs.readFileSync('./phrases.json', 'utf8'));

const trackedTerms = [
  'eu sabia que'
];

const paths = {
  bgs: j(__dirname, 'assets/bgs'),
  tmp: j(__dirname, '.tmp')
};

const random = (max) => Math.round(Math.random() * max);
const replaceAll = (string, mapObj) =>
  string.replace(new RegExp(Object.keys(mapObj).join('|'), 'gi'),
    (matched) => mapObj[matched.toLowerCase()]);

const uploadMediaAndReply = (imgPath, tweet) => {

  const imgBinary = fs.readFileSync(imgPath);

  T.post('media/upload', {
    media: imgBinary
  }, (err, imgData) => {

    const params = {
      media_ids: imgData.media_id_string,
      in_reply_to_status_id: tweet.id_str,
      status: `@${tweet.user.screen_name}`
    };

    T.post('statuses/update', params, (err, tweetData) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log(`[Reply] ${tweetData.text}`);
    });
  });
};

const tweetTracked = tweet => {

  tweet = tweet || {
    text: 'testando sabia que sei algo',
    user: {
      screen_name: 'vtrpldn'
    }
  };
  
  let currentTrackedTerm;
  trackedTerms.every(str => {
    if(tweet.text.indexOf(str) !== -1) {
      currentTrackedTerm = str;
      return false;
    }
    return true;
  });
  
  console.log(`[Incoming] '@${tweet.user.screen_name} ${tweet.text}'`);
  console.log(`[Tracked term] ${currentTrackedTerm}`);

  const randomImageIndex = random(bgs.length - 1);
  const randomImagePath = j(paths.bgs, bgs[randomImageIndex]);

  const randomPhraseIndex = random(phrases.length - 1);
  let randomPhrase = phrases[randomPhraseIndex]
    .replace('{name}', `@${tweet.user.screen_name}`);

  const tmpImgName = md5(`${new Date().getTime()}-${random(99999)}`);
  const tmpImgPath = j(paths.tmp, `${tmpImgName}.jpg`);

  gm(randomImagePath)
    .size(function (err, size) {
      let ph = null;
      let pg = null;

      phantom.create()
        .then(instance => {
          ph = instance;
          return instance.createPage();
        })
        .then(page => {
          pg = page;
          pg.property('viewportSize', size);
        })
        .then(() => {
          const html = replaceAll(htmlTemplate, {
            '{image}': randomImagePath,
            '{phrase}': randomPhrase
          });
          pg.property('content', html);
          fs.writeFileSync('test.html', html);
        })
        .then(() => pg.render(tmpImgPath))
        .then(() => {
          uploadMediaAndReply(tmpImgPath, tweet);
          pg.close();
          ph.exit();
        })
        .catch(error => {
          console.log(error);
          ph.exit();
        });
      return;
    });
};

//tweetTracked();

const stream = T.stream('statuses/filter', {
  track: trackedTerms.join(',')
});

stream.on('data', tweetTracked);
stream.on('error', error => console.log(error));

console.log('[READY]');
