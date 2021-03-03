const Axios = require("axios");
const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config/config.json");

var target = null;

client.login(config.token);
client.once("ready", () => {
  console.log(`Connected to: ${getGuild(client.guilds)}`);
});

client.on("message", (message) => {
  //Add vote reactions
  reactVoteOptions(message);
  //Roll Insult
  rollInsult(message);
  //Roll target change
  //   rollTargetChange(message)
  //Roll youtube video
  rollYoutubeVideo(message);
});

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
  if (chance(1) === 0 && getAuthor(message) !== config.botId) {
    getRandomVideo().then(video => {
      console.log(video.snippet.thumbnails)
      const newEmbed = new Discord.MessageEmbed()
      .setColor("#ff00fb")
      .setTitle(video.snippet.title)
      .setURL("https://www.youtube.com/watch?v=" + video.id.videoId)
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
      config.googleAPIKey +
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