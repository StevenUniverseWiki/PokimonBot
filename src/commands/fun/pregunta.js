const Command = require('../../structs/Command');

const random = require('lodash/sample');

class Pregunta extends Command {
  constructor({ strings }) {
    super();
    this.cmd = 'pregunta';
    this.aliases = ['yesno', '8ball']
    this.cat = 'fun';
    this.onlyPrivate = false;
    this.strings = strings;
    this.accessLevel = 0;
  }

  async run(msg) {
    const pregunta = msg.args;
    if (!pregunta) {
      return msg.channel.send(`@${msg.author.username}: debes escribir lo que deseas preguntar, no puedo leer tu mente aún.`);
    }
    const respuestas = [
      '¡Sí!',
      'Nop.',
      'No lo creo.',
      'No lo sé, tú dime.',
      'No sé, pregúntale a tus amiguitas.',
      'Es posible.',
      'Yo no contaría con eso.',
      'Pregunta más tarde.',
      'Segurísimo.',
      'YES or YES!',
      'YES or YES or YES!',
      '¡Hable más fuerte que tengo una toalla!',
      'Es verdad, lo vi en youtube.',
      'Es mentira, Dalas ya hizo un vídeo desmintiéndolo.',
      `${random(['Parece', 'Todo indica', 'Las estadísticas me dicen'])} que ${random(['sí', 'no'])}.`,
      `Las cartas dicen que ${random(['sí', 'no'])}.`,
      `${random(['Sí', 'No'])}. Fuente: Arial 12.`,
      `Clarín dice que ${random(['sí', 'no'])}, pero Clarín miente.`,
      `Le pregunté a ${this.getRandomUser(msg.channel.users)} y me dijo que ${random(['sí', 'no', 'no chingues'])}.`,
    ]

    msg.channel.send(`${msg.author.username} pregunta: [b]${pregunta}[/b]\n🤔 ${random(respuestas)}`);
  }

  /* This method expects a Collection/Map */
  getRandomUser(users) {
    const user = random([...users.keys()]);
    return user;
  }

}

module.exports = Pregunta;