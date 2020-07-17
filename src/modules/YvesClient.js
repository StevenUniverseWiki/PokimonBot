const consola = require('consola');
const io = require('socket.io-client');
const axios = require('axios');
const feathers = require('@feathersjs/feathers');
const socketio = require('@feathersjs/socketio-client');

class YvesClient {
	constructor(config) {
    this.server = config.server;
    this.username = config.username;
    this.password = config.password;
    this.firstConnection = true;
	}

	logMessage(message) {
    if (message.room.isPrivate) return; //ignore private messages
    if (message.text.startsWith('/me ')) {
    this.messageService.create({
        event: 'ME',
        user: message.user.name,
        text: message.text.replace(/^\/me /g, ''),
        userCount: message.room.users.size
      });
    } else {
    this.messageService.create({
        event: 'MESSAGE',
        user: message.user.name,
        text: message.text,
        userCount: message.room.users.size
      });
    }
	}

  logUserJoin(user) {
    if (user.room.isPrivate) return; //ignore private rooms
    this.messageService.create({
      event: 'JOIN',
      user: user.name,
      userCount: user.chat.room.users.size
    });
  }

  logUserLeave(user) {
    if (user.room.isPrivate) return; //ignore private rooms
    this.messageService.create({
      event: 'PART',
      user: user.name,
      userCount: user.chat.room.users.size
    });
  }

  logKick(room, kickedUser, moderator) {
    if (room.isPrivate) return; //ignore private rooms
    this.messageService.create({
      event: 'KICK',
      user: moderator.name,
      targetUser: kickedUser.name,
      userCount: room.users.size
    });
  }

  logBan(room, evt) {
    if (room.isPrivate) return; //ignore private rooms
    this.messageService.create({
      event: 'BAN',
      user: evt.moderator.name,
      targetUser: evt.bannedUser.name,
      banLength: evt.banLength,
      banReason: evt.reason,
      userCount: room.users.size
    });
  }

  logUnban(room, evt) {
    if (room.isPrivate) return; //ignore private rooms
    this.messageService.create({
      event: 'UNBAN',
      user: evt.moderator.name,
      targetUser: evt.unbannedUserName,
      banReason: evt.reason,
      userCount: room.users.size
    });
  }

	async setup(client) {
    client.yves = feathers();
    const authResult = await axios.post(`${this.server}/authentication`, {
      strategy: 'local',
      email: this.username,
      password: this.password
    }).catch(function (error) {
      consola.error(`[YvesClient] Auth: ${error.message}`);
    });
    if (!authResult) return;

    this.yvesToken = authResult.data.accessToken;
    consola.info('[YvesClient] Authenticated.')
    client.yves.socket = io(this.server, {
        extraHeaders: {
          Authorization: `Bearer ${this.yvesToken}`
        }
    });
    client.yves.configure(socketio(client.yves.socket));

    client.yves.socket.on('connect', () => {
      consola.info('[YvesClient] ' + (this.firstConnection ? 'Connected': 'Reconnected') + ' to WebSocket.');
      if (this.firstConnection) {
        client.emit('yvesReady', client.yves);
        this.firstConnection = false;
        this.messageService = client.yves.service('api/entries');

        client.on('message', this.logMessage.bind(this));
        client.on('join', this.logUserJoin.bind(this));
        client.on('leave', this.logUserLeave.bind(this));
        client.on('kick', this.logKick.bind(this));
        client.on('ban', this.logBan.bind(this));
        client.on('unban', this.logUnban.bind(this));
      }
    });
    this.yves = client.yves;
	}

}

module.exports = YvesClient;