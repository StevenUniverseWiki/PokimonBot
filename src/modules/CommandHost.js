const consola = require('consola'),
  readdir = require('recursive-readdir');

const AbstractMessage = require('../structs/AbstractMessage');

class CommandHost {
	constructor(config) {
    this.commands = {};
    this.aliases = {};
    this.prefixes = config.prefixes;
    readdir(config.commandsDir).then((files) => {
      files.forEach((file) => {
        if (!file.endsWith('.js')) return;
        try {
          const command = require(file);
          const cmd = new command({
            strings: {'hello': 'world'}
          });
          this.commands[cmd.cmd] = cmd;
          consola.info(`[CommandHost] Command loaded: ${cmd.cmd}`);
          if (cmd.aliases && cmd.aliases.length > 0) {
            cmd.aliases.forEach((alias) => {
              this.aliases[alias] = cmd.cmd;
            })
          }
        } catch(err) {
          consola.error(`Could not load ${file}: ${err}`);
        }
      });
    }, (err) => {
      console.error('Something exploded: ' + err);
    });
    this.prefixes = this.prefixes.map((prefix) => {
      return prefix.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
    });
    this.commandRegex = new RegExp(`(?<prefix>${this.prefixes.join('|')})(?<cmd>[^\\s]+)(?<args>.*)`);
    console.log(this.prefixes);
	}

  onWikiaMessage(msg) {
    if (msg.self) return; // Sent from our account; ignore
    const match = msg.text.match(this.commandRegex);
    if (match) {
      const data = match.groups;
      console.log(data);
      let command = this.commands[data.cmd];

      if (!command) {
        if (this.aliases[data.cmd]) command = this.commands[this.aliases[data.cmd]];
      }

      if (!command) {
        console.log(`Nonexistent command: ${data.cmd}`);
        return;
      }

      const msgObj = new AbstractMessage({
        platform: 'wikia',
        content: msg.text,
        command: data.cmd,
        args: data.args.trim(),
        author: {
          id: msg.user.userId,
          username: msg.user.name,
          avatar: msg.user.avatar
        },
        channel: msg.room,
        originalMessage: msg
      });

      // console.log(msgObj);

      command.run(msgObj);
    }

  }

	setup(client) {
    //this.chatClient = client;
    client.on('message', this.onWikiaMessage.bind(this));
	}

}

module.exports = CommandHost;