const fs = require('fs');
// require the discord.js module
const Discord = require('discord.js');
const { prefix } = require('./config.json');
const { token } = require('./auth.json');


// create a new Discord client
const client = new Discord.Client();

// init command collection structure
client.commands = new Discord.Collection();

// set command library
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// dynamic command allocation
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}

// when the client is ready, run this code
// this event will trigger whenever your bot:
// - finishes logging in
// - reconnects after disconnecting

client.on('ready', () => {
	console.log('Ready!');
	console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);


	// Example of changing the bot's playing game to something useful. `client.user` is what the
	// docs refer to as the "ClientUser".

	client.user.setActivity(`Serving ${client.guilds.size} servers`);

	// Send a message
	channel.sendMessage('hello!')
	 .then(message => console.log(`Sent message: ${message.content}`))
	 .catch(console.error);


});

// HERE IS COMMAND CONTENT
//
//			now including args true variable protection
//			args=true results in errors if no args provided
//			see formatting.rm for formatting
//
client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	if (!client.commands.has(commandName)) return;

	const command = client.commands.get(commandName);
	// args variable error start
	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;

		if (command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply);
	}
	// args
	try {
		command.execute(message, args);
	}
	catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});

client.login(token);
