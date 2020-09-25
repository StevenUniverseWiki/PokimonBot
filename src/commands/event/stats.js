const Command = require('../../structs/Command');

class Stats extends Command {
  constructor({ client, strings }) {
    super();
    this.cmd = 'stats';
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
    const username = msg.args ? msg.args.trim() : msg.author.username;
    try {
      const user = await this.service.get(username);
      console.log(user);
      let statsMessage = `[b]Estadísticas de ${user.username}[/b]:
        • [b]🔢 Puntaje básico[/b]: ${user.points}
        • [b]♥️ Vidas restantes[/b]: ${user.lives}/3
      `;
      if (user.specialEvents) {
        statsMessage += '\n[b]✨ Puntos por desafíos especiales ✨[/b]:\n';
        const specialEvts = Object.entries(user.specialEvents);
        specialEvts.forEach((specialEvent) => {
          const eventName = specialEvent[0],
            pointsEarned = specialEvent[1].points;
          statsMessage += `⠀⠀• [b]${eventName}[/b]: ${pointsEarned} puntos\n`;
        });
      }

      msg.channel.send(statsMessage);
    } catch(err) {
      if (err.message.startsWith('No record found')) {
        return msg.channel.send(`No se encontraron estadísticas para ${username}, nombre incorrecto o no está participando del evento.`);
      } else {
        return msg.channel.send(`Algo explotó: ${err.message}`);
      }
    }
  }

}

module.exports = Stats;