const Command = require('../../structs/Command');
const random = require('lodash/sample');

class Elegir extends Command {
  constructor({ strings }) {
    super();
    this.cmd = 'elegir';
    this.aliases = ['choose'];
    this.cat = 'fun';
    this.onlyPrivate = false;
    this.strings = strings;
    this.accessLevel = 0;
  }

  async run(msg) {
    if (!msg.args) {
      return msg.channel.send(`${msg.author.username}, debes darme opciones entre las que elegir.`);
    }
    const opciones = msg.args.split(';');
    if (opciones.length < 2) {
      return msg.channel.send(`${msg.author.username}, debes darme más de una opción.`);
    }
    const respuestas = [
      'elijo',
      'creo que elegiré',
      'me decanto por',
      'mi elección es',
      'prefiero',
      'voy a elegir',
      'yo digo que',
      `${this.getRandomUser(msg.channel.users)} me dijo que elija`
    ];

    msg.channel.send(`🤔 ${msg.author.username}, ${random(respuestas)}: ${random(opciones)}`);
  }

  /* This method expects a Collection/Map */
  getRandomUser(users) {
    const user = random([...users.keys()]);
    return user;
  }

}

module.exports = Elegir;