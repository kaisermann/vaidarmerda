var TwitterPackage = require('twitter');

var secret = require("./secret");

var arrOfMagicSayings = [
  "PUTA MERDA COM CERTEZA VAI DAR MERDA",
  "Vai dar merda.",
  "Não sei se vai dar merda não.",
  "Porra, vai dar merda total.",
  "Até que não vai dar merda não.",
  "Acabei de ver aqui que vai dar merda sim.",
  "Nhé, até que talvez nem dê merda.",
  "Pensa direitinho se vai dar merda mesmo.",
  "VISH MAINHA VAI DAR MERDA LEGAL.",
  "Hello darkeness my old friend... Vai dar merda.",
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

var Twitter = new TwitterPackage(secret);

Twitter.stream('statuses/filter', {track: '#VaiDarMerda'}, function(stream) {

  stream.on('data', function(tweet) {

    console.log(tweet.text);

    var randomIndex = Math.round(Math.random() * arrOfMagicSayings.length);

    var reply = "@" + tweet.user.screen_name + ' ' + arrOfMagicSayings[randomIndex];

    Twitter.post('statuses/update', {status: reply},  function(error, tweetReply, response){

      if(error){
        console.log(error);
      }

      console.log(tweetReply.text);
    });
  });

  stream.on('error', function(error) {
    console.log(error);
  });
});
