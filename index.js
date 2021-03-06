const Axios = require("axios");
const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config/config.json");
const apiKeys = require("./config/apiKeys.json")

var target = null;

client.login(apiKeys.discordToken);
client.once("ready", () => {
  console.log(`Connected to: ${getGuild(client.guilds)}`);
});

client.on("message", (message) => {
  //Add vote reactions
  reactVoteOptions(message);

  //Roll Insult
  rollInsult(message);

  //Roll target change
  //rollTargetChange(message)

  //Roll youtube video
  rollYoutubeVideo(message);

  //Sick em zandy
  sickEm(message);
});

function sickEm(message) {
  if(message.content === "Sick em zandy"){
    message.channel.messages.fetch({limit: 2}).then(messages => {
      var targetAuthor = messages.last().author.toString()
      message.channel.send(`${targetAuthor}. ${config.insults[chance(config.insults.length)]}`)
    })
  }
}

function reactVoteOptions(message) {
  //Define react emojis
  var upArrow = getEmoji(message, "UpArrow");
  var downArrow = getEmoji(message, "DownArrow");
  //Check if message has attachments
  if (message.attachments.size) {
    message.react(upArrow);
    message.react(downArrow);
  } else {
    if (Math.random() < 1 / config.rollChances.randomReactChance) {
      message.react(
        getEmoji(
          message,
          config.emojis[Math.floor(Math.random() * config.emojis.length)]
        )
      );
    }
  }
}

function rollInsult(message) {
  if (getAuthor(message) !== config.botId) {
    if (chance(config.rollChances.rollInsultChanceNonTarget) === 0) {
      message.channel.send(config.insults[chance(config.insults.length)]);
    }
  }
}

function rollYoutubeVideo(message) {
  if (chance(config.rollChances.rollYoutubeVideoChance) === 0 && getAuthor(message) !== config.botId) {
    getRandomVideo().then(video => {
      var url = "https://www.youtube.com/watch?v=" + video.id.videoId
      const newEmbed = new Discord.MessageEmbed()
      .setColor("#ff00fb")
      .setTitle(video.snippet.title)
      .setURL(url)
      .setAuthor(video.snippet.channelTitle)
      .setImage(video.snippet.thumbnails.medium.url)
      
      message.channel.send(config.sarcasticInsults[chance(config.sarcasticInsults.length)])
      message.channel.send(newEmbed)
    })
  }
}

function getRandomVideo() {
  return new Promise((resolve) => {
    var url =
      "https://www.googleapis.com/youtube/v3/search?key=" +
      apiKeys.googleAPIKey +
      "&maxResults=" +
      1 +
      "&part=snippet&type=video&q=" +
      generateString(3);

    Axios.get(url).then((response) => {
      resolve(response.data.items[0])
    });
  });
}

function getAuthor(message) {
  return message.author.username + "#" + message.author.discriminator;
}

function getEmoji(message, name) {
  return message.guild.emojis.cache.find((emoji) => emoji.name === name);
}

function getGuild(guilds) {
  var newGuild = null;
  guilds.cache.map((guild) => {
    if (guild.id === config.serverId) {
      newGuild = guild;
    }
  });
  return newGuild;
}

function chance(odds) {
  return Math.floor(Math.random() * odds);
}

function generateString(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
