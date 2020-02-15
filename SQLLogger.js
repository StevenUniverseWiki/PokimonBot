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

    this.sql.query('SELECT 1', function (error, results, fields) {
      if (error) throw error;
      consola.info('[SQLLogger] Successfully initialized.');
    });

	}

	logMessage(message) {
    if (message.room.isPrivate) return; //ignore privat messages
    if (message.text.startsWith('/me ')) {
      this.sql.execute('INSERT INTO `logs` (timestamp, user, log_line, event, user_count) VALUES(NOW(), ?, ?, ?, ?)',
        [message.user.name, message.text.replace(/^\/me /g, ''), 'ME', message.room.users.size],
        (err, results, fields) => {
          if (err) throw err;
      });
    } else {
      this.sql.execute('INSERT INTO `logs` (timestamp, user, log_line, user_count) VALUES(NOW(), ?, ?, ?)',
        [message.user.name, message.text, message.room.users.size],
        (err, results, fields) => {
          if (err) throw err;
      });
    }
	}

  logUserJoin(user) {
    this.sql.execute('INSERT INTO `logs` (timestamp, user, event) VALUES(NOW(), ?, ?)',
      [user.name, 'JOIN'],
      (err, results, fields) => {
        if (err) throw err;
    });
  }

  logUserLeave(user) {
    this.sql.execute('INSERT INTO `logs` (timestamp, user, event) VALUES(NOW(), ?, ?)',
      [user.name, 'PART'],
      (err, results, fields) => {
        if (err) throw err;
    });
  }

  logKick(room, kickedUser, moderator) {
    this.sql.execute('INSERT INTO `logs` (timestamp, user, target, event, user_count) VALUES(NOW(), ?, ?, ?, ?)',
      [moderator.name, kickedUser.name, 'KICK', room.users.size],
      (err, results, fields) => {
        if (err) throw err;
    });
  }

  logBan(room, evt) {
    this.sql.execute('INSERT INTO `logs` (timestamp, user, target, ban_reason, ban_time, event, user_count) VALUES(NOW(), ?, ?, ?, ?, ?, ?)',
      [evt.moderator.name, evt.bannedUser.name, evt.reason, evt.banLength, 'BAN', room.users.size],
      (err, results, fields) => {
        if (err) throw err;
    });
  }

  logUnban(room, evt) {
    this.sql.execute('INSERT INTO `logs` (timestamp, user, target, ban_reason, event, user_count) VALUES(NOW(), ?, ?, ?, ?, ?)',
      [evt.moderator.name, evt.unbannedUserName, evt.reason, 'UNBAN', room.users.size],
      (err, results, fields) => {
        if (err) throw err;
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