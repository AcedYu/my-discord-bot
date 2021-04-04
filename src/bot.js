// Load up the token from our environment variable
require('dotenv').config();
const fetch = require("node-fetch");

const { Client } = require('discord.js');
const client = new Client();
// Command prefix will be +
const PREFIX = "_";

// Command List object defining available commands.
const commandList = {
  hello: (message) => cmdHello(message),
  kevenny: (message) => cmdKevenny(message),
  retard: (message) => cmdRetard(message),
  weather: (message, city) => cmdWeather(message, ...city)
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
var cmdHello = (message) => message.channel.send("Hello there, I am Phones's bot. Nice to meet you.");
var cmdKevenny = (message) => message.channel.send("Who? :smirk:");
var cmdRetard = (message) => message.channel.send("I don't have a Kevenny friendly command like that :rage:");

// Get Weather function
var cmdWeather = (message, ...city) => {
  city = city.join(' ');
  var weatherApi = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=caf23bfda5d554d1a104091b1f51e063&units=imperial`;

  // fetch function
  fetch(weatherApi)
    .then(function (response) {
      if (response.ok) {
        response.json().then((data) => {
          // Send Message
          message.channel.send(
          `Here is the current weather in ${data.name} :\nTemperature: ${data.main.temp} °F\nHumidity: ${data.main.humidity}%\nWind Speed: ${data.wind.speed} MPH`);
        });
      } else {
        message.channel.send("Invalid city for Weather command.");
      }
    });
}

// Bot invoke log in
client.login(process.env.DISCORD_BOT_TOKEN);