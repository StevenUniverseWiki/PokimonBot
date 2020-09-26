const Command = require('../../structs/Command');

class GivePoints extends Command {
  constructor({ client, strings }) {
    super();
    this.cmd = 'givepoints';
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
    const eventManagers = ['Taxcy Marsopas1', 'Weats', 'TheNozomi'];
    if (!eventManagers.includes(msg.author.username)) return;
    const mainRoom = msg.originalMessage.room.chat.room;
    const argsArray = msg.args.split(';');
    if (argsArray.length < 3) return msg.channel.send('❌ faltan argumentos. Uso: !givepoints Usuario;cantidad;descripción');
    const targetUser = argsArray[0],
      points = parseInt(argsArray[1]),
      evtName = argsArray[2];
    this.service.patch(targetUser, {
      $set: {
        [`specialEvents.${evtName}`]: {
          points: points
        }
      }
    }).then((result) => {
      mainRoom.send(`${targetUser} recibió ${points} puntos (${evtName}).`);
    }).catch((err) => {
      msg.channel.send(`❌ Ocurrió un error: ${err.message}`);
    });
  }

}

module.exports = GivePoints;