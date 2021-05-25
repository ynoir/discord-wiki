export class Model {

    constructor() {
        this.wikiName = 'Wiki Of Peculiar Things'
        this.webhook = ''
        this.serverId = ''
        this.channelId = ''
        this.thumbnailUrl = ''
        this.wikiEntries = []
        this.wikiEntryEditIndex = undefined
        this.wikiIndexMessageId = undefined
    }

}

// wikiEntry: messageId, title, content, imageUrl, dirty
