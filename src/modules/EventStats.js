const consola = require('consola');

class EventStats {
    constructor(config) {
      this.userStore = {};
      this.initialPoints = 0;
      this.initialLives = 3;
      this.throttleInterval = 10000; // ms
    }

    async onMessage(msg) {
      if (msg.room.isPrivate) return; // ignore private messages
      if (msg.self) return; // bot should not earn points
      try {
        if (!this.userStore[msg.user.name]) {
          this.userStore[msg.user.name] = await this.service.get(msg.user.name);
          this.userStore[msg.user.name].throttled = false;
        }
        if (this.userStore[msg.user.name].throttled === true)
          return console.log(`Ignoring ${msg.user.name}, currently throttled.`);
        if (this.userStore[msg.user.name].lives <= 0)
          return console.log(`Ignoring ${msg.user.name}, no lives left.`);
        this.userStore[msg.user.name].throttled = true;
        setTimeout(function() {
          this.userStore[msg.user.name].throttled = false;
          consola.info(`${msg.user.name} is no longer throttled`);
        }.bind(this), this.throttleInterval);
        const addPoints = this.randomInt(2, 4);
        this.service.patch(msg.user.name, {
          $inc: {
            points: addPoints
          }
        }).then((result) => {
          this.userStore[msg.user.name] = {...this.userStore[msg.user.name], ...result};

          consola.success(`Added ${addPoints} points to ${msg.user.name}.`);
        }).catch((err) => {
          consola.error(`Could not add ${addPoints} points to ${msg.user.name}`, err);
        });
      } catch(err) {
        if (err.message.startsWith('No record found')) {
          consola.info(`No entry found for user ${msg.user.name}, creating one...`);
          this.service.create({
            username: msg.user.name,
            points: this.initialPoints,
            lives: this.initialLives
          }).then((user) => {
            this.userStore[msg.user.name] = user;
            consola.success(`Entry for ${msg.user.name} created.`);
          }).catch((err) => {
            consola.error('Something exploded: ', err);
          });
        } else {
          consola.error('Something exploded: ', err);
        }
      }
    }

    /** Utility method: randomInt
      Generates a random integer between min (inclusive) and max (inclusive)
      @param {Number} a
      @param {Number} b
      @returns {Number}
    **/
    randomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    async setup(client) {
      client.on('yvesReady', () => {
        this.service = client.yves.service('event-stats');
        client.on('message', this.onMessage.bind(this));
      });
    }

}

module.exports = EventStats;