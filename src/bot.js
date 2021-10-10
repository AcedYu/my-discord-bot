// require from node
require('dotenv').config();
const fetch = require("node-fetch");
const Discord = require('discord.js');
const discordTTS = require("discord-tts");

// define client
const client = new Discord.Client();
// Command prefix will be _
const PREFIX = "_";

// Command List object defining available commands.
const commandList = {
  hello: (message) => cmdHello(message),
  type: (message, args) => cmdType(message, ...args),
  weather: (message, city) => cmdWeather(message, ...city),
  say: (message, args) => cmdSay(message, ...args)
};

// Ready message on start
client.on('ready', () => {
  console.log(`Starting up: ${client.user.username}`);
});

client.on('message', (message) => {
  // ignore bot messages
  if (message.author.bot) return;
  // if message contains prefix
  if (message.content.startsWith(PREFIX)) {
    var [cmd, ...args] = message.content
      .trim()
      .substring(PREFIX.length)
      .split(/\s+/);

    // makes command string lowercase
    cmd = cmd.toLowerCase();

    if (!commandList[cmd]) {
      message.channel.send("You have summoned me. Unfortunately, that command doesn't exist yet. I don't have many at the moment.");
    } else {
      commandList[cmd](message, args);
    }
  }
});

// Command functions
const cmdHello = (message) => message.channel.send("Hello there, I am Phones's Bot. Nice to meet you.");
const cmdType = (message, ...args) => message.channel.send(args.join(' '));

// Get Weather function
const cmdWeather = (message, ...city) => {
  city = city.join(' ');
  var weatherApi = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_API_KEY}&units=imperial`;

  // fetch function
  fetch(weatherApi)
    .then(function (response) {
      if (response.ok) {
        response.json().then((data) => {
          // launch renderWeatherEmbed
          renderWeatherEmbed(message, data);
        });
      } else {
        message.channel.send("Invalid city for Weather command.");
      }
    });
}

// function renderWeatherEmbed
const renderWeatherEmbed = (message, data) => {
  var newEmbed = new Discord.MessageEmbed()
  .setTitle(`Here is the current weather in ${data.name}`)
  .setImage(`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`)
  .setDescription(`Temperature: ${data.main.temp} °F\nHumidity: ${data.main.humidity}%\nWind Speed: ${data.wind.speed} MPH`);

  message.channel.send(newEmbed);
}

const cmdSay = async (message, ...args) => {
  let botmessage = args.join(' ');
  let broadcast = await client.voice.createBroadcast();
  let chID = await message.member.voice.channelID;
  let channel = await client.channels.cache.get(chID);
  channel.join().then(connection => {
    broadcast.play(discordTTS.getVoiceStream(botmessage));
    let dispatcher = connection.play(broadcast);
  });
}

// Bot invoke log in
client.login(process.env.DISCORD_BOT_TOKEN);