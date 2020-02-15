require('dotenv').config();
const { Client } = require('wikichat'),
    consola = require('consola');

const SQLLogger = require('./SQLLogger');

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

const sqlLog = new SQLLogger({
    host: process.env.SQL_HOST,
    port: process.env.SQL_PORT,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    db: process.env.SQL_DB,
    maxConnections: process.env.SQL_MAXCONNECTIONS
});
sqlLog.setup(client);

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

client.on('room.private', room => {
    room.send('¡Hola! Soy un bot, por el momento me dedico solamente a registrar los mensajes del chat, pero pronto podré hacer más cosas.');
});