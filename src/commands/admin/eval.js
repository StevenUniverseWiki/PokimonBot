const Command = require('../../structs/Command');

class Eval extends Command {
  constructor({ strings }) {
    super();
    this.cmd = 'eval';
    this.aliases = ['js']
    this.cat = 'admin';
    this.onlyPrivate = false;
    this.strings = strings;
    this.accessLevel = 0;
  }

  async run(msg) {
  	if (msg.author.username == 'TheNozomi') {
      try {
        let evaled = eval(msg.args);
        return msg.channel.send((`\`\`\`javascript\n${evaled}\n\`\`\``));  
      } catch(err) {
        return msg.channel.send(`Error:\n\`\`\`javascript\n${err}\n\`\`\``);
      }
    }
  }

}

module.exports = Eval;
