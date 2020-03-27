/**
 * The base command class
 *
 */
class Command {
  constructor() {
    this.aliases = [];
  }

  /**
     * The main function of the command
     * @param {Object} msg
     */
  async run(msg) {

  }
}
module.exports = Command;