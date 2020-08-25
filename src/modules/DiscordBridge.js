const consola = require('consola'),
  Discord = require('discord.js'),
  humanizeDuration = require('humanize-duration'),
  TextFormatting = require('../util/TextFormatting');

class DiscordBridge {
	constructor(config) {
    this.discord = new Discord.Client();
    this.discord.once('ready', () => {
      consola.info(`[Discord] Logged in as ${this.discord.user.tag}!`);
      this.discord.user.setActivity('el vacío', {
        type: 'WATCHING'
      });
      this.discordChannel = this.discord.guilds.resolve(process.env.DISCORD_GUILD).channels.resolve(process.env.DISCORD_CHANNEL);

      if (process.env.DISCORD_BRIDGE == 1) {
        // wikia chat listeners
        this.chatClient.on('message', this.sendWikiaToDiscord.bind(this));
        this.chatClient.on('join', this.logUserJoin.bind(this));
        this.chatClient.on('leave', this.logUserLeave.bind(this));
        this.chatClient.on('kick', this.logKick.bind(this));
        this.chatClient.on('ban', this.logBan.bind(this));
        this.chatClient.on('unban', this.logUnban.bind(this));

        // discord listeners
        this.discord.on('message', message => {
          if (message.author.id === this.discord.user.id) return;
          if (message.channel.id == process.env.DISCORD_CHANNEL) {
            this.sendDiscordToWikia(message);
          }
        });       
      }
    });
	}

  logUserJoin(user) {
    if (user.room.isPrivate) return; //ignore private rooms
    this.discordChannel.send(`**~ ${user.name} ha entrado al chat. ~**`);
  }

  logUserLeave(user) {
    if (user.room.isPrivate) return; //ignore private rooms
    this.discordChannel.send(`**~ ${user.name} ha salido del chat. ~**`);
  }

  logKick(room, kickedUser, moderator) {
    if (room.isPrivate) return; //ignore private rooms
    this.discordChannel.send(`**~ ${kickedUser.name} ha sido expulsado por ${moderator.name}. ~**`);
  }

  logBan(room, evt) {
    if (room.isPrivate) return; //ignore private rooms
    this.discordChannel.send(`**~ ${evt.bannedUser.name} ha sido baneado ${this.formatBanTime(evt.banLength)} por ${evt.moderator.name} (razón: ${evt.reason}). ~**`);
  }

  logUnban(room, evt) {
    if (room.isPrivate) return; //ignore private rooms
    this.discordChannel.send(`**~ ${evt.unbannedUserName} ha sido desbaneado por ${evt.moderator.name} (razón: ${evt.reason}). ~**`);
  }

  formatBanTime(seconds) {
    if (seconds >= 2147483647) {
      return 'para siempre';
    } else {
      return 'durante ' + humanizeDuration(seconds * 1000, {
        language: 'es'
      });
    }
  }

  sendWikiaToDiscord(message) {
    if (message.room.isPrivate) return; //ignore private messages
    if (message.self && message.text.startsWith('[b]<')) return; //prevent double relay
    message.text = TextFormatting.wikiaToDiscord(message.text);
    if (message.text.startsWith('/me ')) {
      this.discordChannel.send(`**<${message.user.name}>** *${message.text.replace(/^\/me/g, message.user.name)}*`);
    } else {
      this.discordChannel.send(`**<${message.user.name}>** ${message.text}`);
    }
  }

  sendDiscordToWikia(message) {
    let wikiaChat = this.chatClient.chats.get(`${process.env.WIKI_LANG}.${process.env.WIKI_INTERWIKI}`);
    let messageText = `[b]<${message.guild.members.resolve(message.author.id).displayName}>[/b] ${TextFormatting.discordToWikia(message.content)}`;
    if (message.attachments) {
      message.attachments.forEach((attachment) => {
        messageText+= `\n[b][${attachment.name}][/b]: ${attachment.url}`;
      });
    }

    wikiaChat.room.send(messageText);
  }

	setup(client) {
    this.chatClient = client;
    this.discord.login(process.env.DISCORD_TOKEN);
	}

}

module.exports = DiscordBridge;