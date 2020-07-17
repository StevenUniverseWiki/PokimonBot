require('dotenv').config({
    path: '../.env'
});
const { Client } = require('wikichat'),
    consola = require('consola'),
    path = require('path');

consola.info(`${require('../package.json').name} v${require('../package.json').version}`);

const client = new Client({
    username: process.env.WIKIA_USERNAME,
    password: process.env.WIKIA_PASSWORD,
    chats: [
        {
            name: process.env.WIKI_INTERWIKI,
            lang: process.env.WIKI_LANG
        }
    ]
});

// require bot modules
const YvesClient = require('./modules/YvesClient'),
    DiscordBridge = require('./modules/DiscordBridge'),
    CommandHost = require('./modules/CommandHost');

// create modules instance
const discord = new DiscordBridge();

const commandHost = new CommandHost({
    commandsDir: path.resolve('./commands'),
    prefixes: ['!', '%']
});

// attach modules to client
client.use(discord);
client.use(commandHost);

const logsService = new YvesClient({
    server: process.env.YVES_SERVER,
    username: process.env.YVES_USERNAME,
    password: process.env.YVES_PASSWORD
});
client.use(logsService);

client.on('ready', () => {
    consola.success(`Logged in as ${client.user.name}`);
    consola.info(`Connected to ${client.chats.size} chats: ${
        client.chats.array()
            .map(chat => chat.name)
            .join(', ')
    }`);
});

client.on('join', user => {
    if (user.name === 'LovelySards') user.room.send(`Entró la lesviana de ${user.name}. [c="transparent"]<@!263379785516843018>[/c]`);
});

client.on('kick', (room, victim, killer) => {
    if(victim.name === client.user.name) room.send(`La concha de tu madre ${killer.name}, das asco con tu cara de gil.`);
    //setTimeout(() => room.send('owo'), 500);
});

client.on('room.private', room => {
    room.send('¡Hola! Soy un bot, por el momento me dedico solamente a registrar los mensajes del chat, pero pronto podré hacer más cosas.');
});