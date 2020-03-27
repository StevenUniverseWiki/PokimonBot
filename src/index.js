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
const SQLLogger = require('./modules/SQLLogger'),
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

if (process.env.NODE_ENV === 'production') {
    const sqlLog = new SQLLogger({
        host: process.env.SQL_HOST,
        port: process.env.SQL_PORT,
        user: process.env.SQL_USER,
        password: process.env.SQL_PASSWORD,
        db: process.env.SQL_DB,
        maxConnections: process.env.SQL_MAXCONNECTIONS
    });
    client.use(sqlLog);
}

client.on('ready', () => {
    consola.success(`Logged in as ${client.user.name}`);
    consola.info(`Connected to ${client.chats.size} chats: ${
        client.chats.array()
            .map(chat => chat.name)
            .join(', ')
    }`);
});

client.on('kick', (room, victim, killer) => {
    if(victim.name === client.user.name) room.send(`La concha de tu madre ${killer.name}, das asco con tu cara de gil.`);
    //setTimeout(() => room.send('owo'), 500);
});

client.on('room.private', room => {
    room.send('¡Hola! Soy un bot, por el momento me dedico solamente a registrar los mensajes del chat, pero pronto podré hacer más cosas.');
});