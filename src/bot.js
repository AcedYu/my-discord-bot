// Load up the token from our environment variable
require('dotenv').config();

const { Client } = require('discord.js');
const client = new Client();
const PREFIX = "+";

const commandList = [
  "hello",
  "kevenny"
];

client.on('ready', () => {
  console.log(`Starting up: ${client.user.username}`);
});

client.on('message', (message) => {
  // ignore bot messages
  if (message.author.bot) return;

  // if message contains prefix
  if (message.content.startsWith(PREFIX)) {
    const [cmd, ...args] = message.content
      .trim()
      .substring(PREFIX.length)
      .split(/\s+/);
    if (cmd === 'hello') {
      message.channel.send("Hello there, I am Phones's bot. Nice to meet you.")
    } else if (cmd === 'kevenny') {
      message.channel.send("Who? :smirk:");
    } else {
      message.channel.send("You have summoned me. Unfortunately, that command doesn't exist yet. I don't have many at the moment.");
    }
  }
});



client.login(process.env.DISCORD_BOT_TOKEN);