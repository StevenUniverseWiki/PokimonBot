const Command = require('../../structs/Command');

class Ping extends Command {
  constructor({ strings }) {
    super();
    this.cmd = 'ping';
    this.aliases = ['pong']
    this.cat = 'util';
    this.onlyPrivate = false;
    this.strings = strings;
    this.accessLevel = 0;
  }

  async run(msg) {
    msg.channel.send('Pong!');
    // this.emit('run');
    //const content = msg.content.split(' ').splice(1).join(' ').trim();
  }

}

module.exports = Ping;