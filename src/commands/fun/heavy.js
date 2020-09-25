const Command = require('../../structs/Command');

class Heavy extends Command {
  constructor({ strings }) {
    super();
    this.cmd = 'heavy';
    this.cat = 'fun';
    this.onlyPrivate = false;
    this.strings = strings;
    this.accessLevel = 0;
  }

  async run(msg) {
    msg.channel.send('https://i.redd.it/x80uusmnwio51.png');
  }

}

module.exports = Heavy;