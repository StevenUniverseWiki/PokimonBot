const Command = require('../../structs/Command');

class Slay extends Command {
  constructor({ client, strings }) {
    super();
    this.cmd = 'slay';
    this.aliases = ['funa'];
    this.cat = 'event';
    this.onlyPrivate = false;
    this.client = client;
    this.strings = strings;
    this.accessLevel = 0;
    this.client.on('yvesReady', () => {
      this.service = client.yves.service('event-stats');
    });
  }

  async run(msg) {
    const eventManagers = ['Taxcy Marsopas1', 'Weats', 'TheNozomi', 'Rodehi'];
    if (!eventManagers.includes(msg.author.username)) return msg.channel.send('No tení permiso para hacer eso!');
    const mainRoom = msg.originalMessage.room.chat.room;
    if (!msg.args.trim()) return msg.channel.send('❌ faltan argumentos. Uso: !slay Usuario');
    const targetUser = msg.args.trim();
    this.service.patch(targetUser, {
      $inc: {
        lives: -1
      }
    }).then((result) => {
      mainRoom.send(`¡${targetUser} perdió una vida! (${result.lives} restantes)`);
    }).catch((err) => {
      msg.channel.send(`❌ Ocurrió un error: ${err.message}`);
    });
  }

}

module.exports = Slay;