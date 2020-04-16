const Command = require('../../structs/Command');
const {VM} = require('vm2');

class Eval extends Command {
  constructor({ strings }) {
    super();
    this.cmd = 'eval';
    this.aliases = ['js']
    this.cat = 'util';
    this.onlyPrivate = false;
    this.strings = strings;
    this.accessLevel = 0;
  }

  async run(msg) {
    const js = msg.args;
    if (msg.author.username === 'TheNozome') {
      try {
        const result = eval(js);
        return msg.channel.send((`\`\`\`javascript\n${result}\n\`\`\``)); 
      } catch(err) {
        return msg.channel.send(`Error:\n\`\`\`javascript\n${err}\n\`\`\``);
      }
    } else {
      const send = (message) => {
        msg.channel.send(message);
      }
      const vm = new VM({
        timeout: 1000,
        sandbox: {
          msg: {
            channel: {
              send: send
            }
          }
        }
      });
      try {
        const result = vm.run(js);
        return msg.channel.send((`\`\`\`javascript\n${result}\n\`\`\``)); 
      } catch(err) {
        return msg.channel.send(`Error:\n\`\`\`javascript\n${err}\n\`\`\``);
      }      
    }
  }

}

module.exports = Eval;
