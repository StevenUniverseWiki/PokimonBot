const consola = require('consola'),
	mysql = require('mysql2');

class SQLLogger {
	constructor(config) {
		this.sql = mysql.createPool({
		  host: config.host,
      port: config.port,
		  user: config.user,
      password: config.password,
		  database: config.db,
		  waitForConnections: true,
		  connectionLimit: config.maxConnections || 10,
		  queueLimit: 0
    });

    this.sql.query('SELECT 1', function (err, results, fields) {
      if (err) consola.error(err);
      consola.info('[SQLLogger] Successfully initialized.');
    });

	}

	logMessage(message) {
    if (message.room.isPrivate) return; //ignore private messages
    if (message.text.startsWith('/me ')) {
      this.sql.execute('INSERT INTO `logs` (timestamp, user, log_line, event, user_count) VALUES(NOW(), ?, ?, ?, ?)',
        [message.user.name, message.text.replace(/^\/me /g, ''), 'ME', message.room.users.size],
        (err, results, fields) => {
          if (err) consola.error(err);
      });
    } else {
      this.sql.execute('INSERT INTO `logs` (timestamp, user, log_line, user_count) VALUES(NOW(), ?, ?, ?)',
        [message.user.name, message.text, message.room.users.size],
        (err, results, fields) => {
          if (err) consola.error(err);
      });
    }
	}

  logUserJoin(user) {
    if (user.room.isPrivate) return; //ignore private rooms
    this.sql.execute('INSERT INTO `logs` (timestamp, user, event, user_count) VALUES(NOW(), ?, ?, ?)',
      [user.name, 'JOIN', user.chat.room.users.size],
      (err, results, fields) => {
        if (err) consola.error(err);
    });
  }

  logUserLeave(user) {
    if (user.room.isPrivate) return; //ignore private rooms
    this.sql.execute('INSERT INTO `logs` (timestamp, user, event, user_count) VALUES(NOW(), ?, ?, ?)',
      [user.name, 'PART', user.chat.room.users.size],
      (err, results, fields) => {
        if (err) consola.error(err);
    });
  }

  logKick(room, kickedUser, moderator) {
    if (room.isPrivate) return; //ignore private rooms
    this.sql.execute('INSERT INTO `logs` (timestamp, user, target, event, user_count) VALUES(NOW(), ?, ?, ?, ?)',
      [moderator.name, kickedUser.name, 'KICK', room.users.size],
      (err, results, fields) => {
        if (err) consola.error(err);
    });
  }

  logBan(room, evt) {
    if (room.isPrivate) return; //ignore private rooms
    this.sql.execute('INSERT INTO `logs` (timestamp, user, target, ban_reason, ban_time, event, user_count) VALUES(NOW(), ?, ?, ?, ?, ?, ?)',
      [evt.moderator.name, evt.bannedUser.name, evt.reason, evt.banLength, 'BAN', room.users.size],
      (err, results, fields) => {
        if (err) consola.error(err);
    });
  }

  logUnban(room, evt) {
    if (room.isPrivate) return; //ignore private rooms
    this.sql.execute('INSERT INTO `logs` (timestamp, user, target, ban_reason, event, user_count) VALUES(NOW(), ?, ?, ?, ?, ?)',
      [evt.moderator.name, evt.unbannedUserName, evt.reason, 'UNBAN', room.users.size],
      (err, results, fields) => {
        if (err) consola.error(err);
    });
  }

	setup(client) {
		client.on('message', this.logMessage.bind(this));
    client.on('join', this.logUserJoin.bind(this));
    client.on('leave', this.logUserLeave.bind(this));
		client.on('kick', this.logKick.bind(this));
		client.on('ban', this.logBan.bind(this));
		client.on('unban', this.logUnban.bind(this));
	}

}

module.exports = SQLLogger;