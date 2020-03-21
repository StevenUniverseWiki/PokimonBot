require('dotenv').config();
const { Client } = require('wikichat'),
    consola = require('consola');

consola.info(`${require('./package.json').name} v${require('./package.json').version}`);

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
    DiscordBridge = require('./modules/DiscordBridge');

// create modules instance
const sqlLog = new SQLLogger({
    host: process.env.SQL_HOST,
    port: process.env.SQL_PORT,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    db: process.env.SQL_DB,
    maxConnections: process.env.SQL_MAXCONNECTIONS
});

const discord = new DiscordBridge();

// attach modules to client
if (process.env.NODE_ENV === 'production') client.use(sqlLog);
client.use(discord);

client.on('ready', () => {
    consola.success(`Logged in as ${client.user.name}`);
    consola.info(`Connected to ${client.chats.size} chats: ${
        client.chats.array()
            .map(chat => chat.name)
            .join(', ')
    }`);
});

client.on('message', message => {
    if (message.self) return; // Sent from our account; ignore

    if (message.text.startsWith('!eval') && message.user.name === 'TheNozomi') {
        try {
            let js = message.text.substr(6);
            let evaled = eval(js);
            return message.room.send((`\`\`\`javascript\n${evaled}\n\`\`\``));  
        } catch(err) {
            return message.room.send(`Error:\n\`\`\`javascript\n${err}\n\`\`\``);
        }
    }

    if (message.text === '!ping') {
        message.room.send('Pong!');
    }

    if (message.text === '!logs') {
        message.room.send(`Puedes ver los registros de este chat en ${process.env.CHATLOGS_FRONTEND_URL}`);
    }

});

client.on('kick', (room, victim, killer) => {
    if(victim.name === client.user.name) room.send(`La concha de tu madre ${killer.name}, das asco con tu cara de gil.`);
    //setTimeout(() => room.send('owo'), 500);
});

client.on('room.private', room => {
    room.send('¡Hola! Soy un bot, por el momento me dedico solamente a registrar los mensajes del chat, pero pronto podré hacer más cosas.');
});