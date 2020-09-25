const Command = require('../../structs/Command');

class Say extends Command {
  constructor({ client, strings }) {
    super();
    this.cmd = 'say';
    this.cat = 'event';
    this.onlyPrivate = false;
    this.client = client;
    this.strings = strings;
    this.accessLevel = 0;
  }

  async run(msg) {
    const eventManagers = ['Taxcy Marsopas1', 'Weats', 'TheNozomi', 'Rodehi'];
    if (!eventManagers.includes(msg.author.username)) return msg.channel.send('No tení permiso para hacer eso!');
    const mainRoom = msg.originalMessage.room.chat.room;
    if(msg.args) mainRoom.send(msg.args);
  }

}

module.exports = Say;