const TwitterPackage = require('twitter');
const secret = require("./secret.json");
const Twitter = new TwitterPackage(secret);

const phrases = [
  "PUTA MERDA COM CERTEZA VAI DAR MERDA",
  "Vai dar merda.",
  "Não sei se vai dar merda não.",
  "Porra, vai dar merda total.",
  "Até que não vai dar merda não.",
  "Acabei de ver aqui que vai dar merda sim.",
  "Nhé, até que talvez nem dê merda.",
  "Pensa direitinho se vai dar merda mesmo.",
  "VISH MAINHA VAI DAR MERDA LEGAL.",
  "Hello darkness my old friend... Vai dar merda.",
  "Já deu merda e tu nem percebeu.",
  "Minhas fontes dizem que não, não vai dar merda.",
  "Sim - vai dar merda com certeza.",
  "Pode dar merda, pode não dar, a gente nunca sabe.",
  "Não estou nem sentindo o cheiro da merda.",
  "Deu merda.",
  "Talvez dê merda, talvez não.",
  "Não vai dar merda.",
  "Fica tranquilho que hoje não vai dar merda. Hoje.",
  "Meeeerda merda talvez não, no máximo um peidinho."
];

Twitter.stream('statuses/filter', {
  track: '#VaiDarMerda'
}, stream => {

  stream.on('data', tweet => {

    const randomIndex = Math.round(Math.random() * phrases.length);
    const replyObj = {
      status: `@${tweet.user.screen_name} ${phrases[randomIndex]}`
    };
    const replyCallback = (error, tweetReply, response) => {
      console.log(`${error ? error : `[Reply] '${tweetReply.text}'`}`);
    };

    console.log(`[Incoming] '@${tweet.user.screen_name} ${tweet.text}'`);
    Twitter.post('statuses/update', replyObj, replyCallback);
  });
  stream.on('error', error => console.log(error));
});
