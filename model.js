export class Model {

    constructor() {
        this.wikiName = 'Wiki Of Peculiar Things'
        this.indexTitle = 'Index'
        this.indexLinkName = 'Back to Index'
        this.webhook = ''
        this.serverId = ''
        this.channelId = undefined
        this.thumbnailUrl = ''
        this.wikiEntries = []
        this.wikiEntryEditIndex = undefined
        this.wikiIndexMessageId = undefined
    }

}

// wikiEntry: messageId, title, content, imageUrl, dirty
