const Command = require('../../structs/Command');

class Leave extends Command {
  constructor({ client, strings }) {
    super();
    this.cmd = 'leave';
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
    this.service.patch(msg.author.username, {
      lives: 0
    }).then((result) => {
      msg.channel.send('✅ Has salido del evento.');
    }).catch((err) => {
      msg.channel.send(`❌ Ocurrió un error al intentar removerte del evento: ${err.message}`);
    });
  }

}

module.exports = Leave;