const Command = require('../../structs/Command');
const random = require('lodash/sample');

class Quienlachupa extends Command {
  constructor({ strings }) {
    super();
    this.cmd = 'quienlachupa';
    this.cat = 'fun';
    this.onlyPrivate = false;
    this.strings = strings;
    this.accessLevel = 0;
  }

  async run(msg) {
    msg.channel.send(`${this.getRandomUser(msg.channel.users)} la chupa.`);
  }

  /* This method expects a Collection/Map */
  getRandomUser(users) {
    const user = random([...users.keys()]);
    return user;
  }

}

module.exports = Quienlachupa;