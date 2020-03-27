/* @class AbstractMessage
	a Message object not tied to any platform
*/
class AbstractMessage {
	constructor(attrs) {
		this.platform = attrs.platform;
		this.content = attrs.content;
		this.command = attrs.command;
		this.args = attrs.args;
		this.author = {
			id: attrs.author.id,
			username: attrs.author.username,
			avatar: attrs.author.avatar
		};
		this.channel = attrs.channel;
		this.originalMessage = attrs.originalMessage;
	}
	
}

module.exports = AbstractMessage;