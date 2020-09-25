const Command = require('../../structs/Command');

class Leaderboard extends Command {
  constructor({ client, strings }) {
    super();
    this.cmd = 'leaderboard';
    this.aliases = ['top'];
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
    if (!this.service) return msg.channel.send(`No se puede conectar con el back-end. Probablemente esto sea un bug. TheNozomi pls fix kthxbye.`);
    try {
      const query = await this.service.find({
        query: {
          "$sort": {
            "points": -1
          }          
        }
      });
      let reply = `[b]Tabla de clasificación[/b]:\n`;
      if (query.data) {
        query.data.forEach((user) => {
          reply += `⠀• ${user.username}: ${user.points} puntos\n`;
        });
        msg.channel.send(reply);
      } else {
        return msg.channel.send(`La consulta no devolvió ningún dato qué está pasando AAAAA.`);
      }
    } catch(err) {
      return msg.channel.send(`Algo explotó: ${err.message}`);
    }
  }

}

module.exports = Leaderboard;