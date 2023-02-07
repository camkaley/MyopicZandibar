const Axios = require("axios");
const Discord = require("discord.js");
const { Configuration, OpenAIApi } = require("openai");
const client = new Discord.Client({
  intents: [
    "GUILDS",
    "GUILD_MESSAGES",
    "GUILD_VOICE_STATES",
    "MESSAGE_CONTENT",
  ],
});
const config = require("./config/config.json");
const apiKeys = require("./config/apiKeys.json");

var target = "ReyneBowKitten#7296";
// var target = "BiscuitMan#8864";

const configuration = new Configuration({
  apiKey: apiKeys.chatGTPKey,
});
const openai = new OpenAIApi(configuration);

client.login(apiKeys.discordToken);
client.once("ready", () => {
  console.log(`Connected to: ${getGuild(client.guilds)}`);
});

client.on("messageCreate", (message) => {
  // //Add vote reactions
  // reactVoteOptions(message);

  // //Roll Insult
  // rollInsult(message);

  // //Roll target change
  // //rollTargetChange(message)

  // //Roll youtube video
  // rollYoutubeVideo(message);

  // //Sick em zandy
  // sickEm(message);

  // //Check if reyne
  // checkReyne(message);

  //Chat GTP
  chatGTP(message);
});

async function chatGTP(message) {
  if (message.content.toLowerCase().startsWith("zandy")) {
    var command = message.content.replace(/[^\s]*/, "");
    openai
      .createCompletion({
        model: "text-davinci-003",
        prompt: command,
        temperature: 0.5,
        max_tokens: 1000,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
      })
      .then((res) => {
        console.log("COMMAND:");
        console.log(command);
        console.log(res.data.choices);
        message.channel.send(res.data.choices[0].text);
      })
      .catch((err) => {
        console.log(err);
        message.channel.send("No");
      });
  }
}

function sickEm(message) {
  if (message.content === "Sick em zandy") {
    message.channel.messages.fetch({ limit: 2 }).then((messages) => {
      var targetAuthor = messages.last().author.toString();
      message.channel.send(
        `${targetAuthor}. ${config.insults[chance(config.insults.length)]}`
      );
    });
  }
}

function checkReyne(message) {
  var comebacks = [
    "Fuck you're funny",
    "Commedy genius over here",
    "Wow the same joke again!",
  ];

  if (getAuthor(message) === target) {
    message.react(getEmoji(message, "Yamba"));
    message.react(getEmoji(message, "reyne"));
    message.react(getEmoji(message, "garry"));
    message.react(getEmoji(message, "drive"));
    message.react(getEmoji(message, "laugh"));
    message.react(getEmoji(message, "wow"));
    message.react(getEmoji(message, "simp"));
    message.react(getEmoji(message, "retard"));
    message.react(getEmoji(message, "eggplant"));
    message.react(getEmoji(message, "WICKED"));

    message.channel.send(comebacks[chance(3)]);
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
  if (
    chance(config.rollChances.rollYoutubeVideoChance) === 0 &&
    getAuthor(message) !== config.botId
  ) {
    getRandomVideo().then((video) => {
      var url = "https://www.youtube.com/watch?v=" + video.id.videoId;
      const newEmbed = new Discord.MessageEmbed()
        .setColor("#ff00fb")
        .setTitle(video.snippet.title)
        .setURL(url)
        .setAuthor(video.snippet.channelTitle)
        .setImage(video.snippet.thumbnails.medium.url);

      message.channel.send(
        config.sarcasticInsults[chance(config.sarcasticInsults.length)]
      );
      message.channel.send({ embeds: [newEmbed] });
    });
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
      resolve(response.data.items[0]);
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
