module.exports = {
	discordToWikia: (text) => {
		return text
			.replace(/`(.*?)`/, '[code]$1[/code]')
			.replace(/~~(.*?)~~/, '[s]$1[/s]')
			.replace(/__(.*?)__/, '[u]$1[/u]')
			.replace(/_(.*?)_/, '[i]$1[/i]')
			.replace(/\*\*\*(.*?)\*\*\*/, '[b][i]$1[/i][/b]')
			.replace(/\*\*(.*?)\*\*/, '[b]$1[/b]')
			.replace(/\*(.*?)\*/, '[i]$1[/i]');
	},

	wikiaToDiscord: (text) => {
		return text
			.replace(/\[b\](.*?)\[\/b\]/, '**$1**')
			.replace(/\[i\](.*?)\[\/i\]/, '*$1*')
			.replace(/\[u\](.*?)\[\/u\]/, '__$1__')
			.replace(/\[s\](.*?)\[\/s\]/, '~~$1~~')
			.replace(/\[code\](.*?)\[\/code\]/, '`$1`');
	}

}