const Command = require('../../structs/Command');

class Logs extends Command {
  constructor({ strings }) {
    super();
    this.cmd = 'logs';
    this.aliases = ['registros']
    this.cat = 'util';
    this.onlyPrivate = false;
    this.strings = strings;
    this.accessLevel = 0;
  }

  async run(msg) {
    msg.channel.send(`Puedes ver los registros de este chat en ${process.env.CHATLOGS_FRONTEND_URL}`);
    // this.emit('run');
    //const content = msg.content.split(' ').splice(1).join(' ').trim();
  }

}

module.exports = Logs;
