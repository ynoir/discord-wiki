import { TopPanel } from './topPanel.js'
import { WikiEntryPanel } from './wikiEntryPanel.js'
import { DiscordService } from './discordService.js'
import { Model } from './model.js'

export class Controller {

    constructor(topPanelContainer, wikiEntryPanelContainer) {
        this.discordService = new DiscordService()
        const storedModel = localStorage.getItem('discordWiki')
        this.model = storedModel ? JSON.parse(storedModel) : new Model()
        this.topPanelContainer = topPanelContainer
        this.wikiEntryPanelContainer = wikiEntryPanelContainer
        this.topPanel = new TopPanel(this, this.model, this.topPanelContainer)
        this.wikiEntryPanel = new WikiEntryPanel(this, this.model, this.wikiEntryPanelContainer)
        this.topPanel.render()
        this.wikiEntryPanel.render()
    }

    storeModel() {
        localStorage.setItem('discordWiki', JSON.stringify(this.model));
    }

    setWebhook(webhook) {
        this.model.webhook = webhook
        this.storeModel()
    }

    setServerId(serverId) {
        this.model.serverId = serverId
        this.storeModel()
    }

    setThumbnailUrl(thumbnailUrl) {
        this.model.thumbnailUrl = thumbnailUrl
        this.storeModel()
    }

    newWikiEntry() {
        this.model.wikiEntries.push({
            messageId: undefined,
            title: '',
            content: '',
            imageUrl: '',
            dirty: true,
        })
        this.editWikiEntry(this.model.wikiEntries.length - 1)
    }

    editWikiEntry(index) {
        this.model.wikiEntryEditIndex = index
        this.topPanel.render()
        this.wikiEntryPanel.render()
        this.storeModel()
    }

    deleteWikiEntry() {
        this.model.wikiEntries.splice(this.model.wikiEntryEditIndex, 1)
        this.model.wikiEntryEditIndex = undefined
        if (this.model.wikiEntries.length == 1) {
            this.model.wikiEntryEditIndex = 0
        }
        this.storeModel()
        this.topPanel.render()
        this.wikiEntryPanel.render()
    }

    updateTitle(title) {
        const wikiEntry = this.model.wikiEntries[this.model.wikiEntryEditIndex]
        wikiEntry.title = title
        wikiEntry.dirty = true
        this.topPanel.render()
        this.storeModel()
    }

    updateContent(content) {
        const wikiEntry = this.model.wikiEntries[this.model.wikiEntryEditIndex]
        wikiEntry.content = content
        wikiEntry.dirty = true
        this.storeModel()
    }

    updateImageUrl(imageUrl) {
        const wikiEntry = this.model.wikiEntries[this.model.wikiEntryEditIndex]
        wikiEntry.imageUrl = imageUrl
        wikiEntry.dirty = true
        this.storeModel()
    }

    sync() {
        this.ensureIndex().then(() => {
            this.syncWikiEnties().then(() => {
                this.updateIndex()
            })
        })
    }

    syncWikiEnties() {
        let promise = this.syncWikiEntry(this.model.wikiEntries[0])
        for (var i = 1; i < this.model.wikiEntries.length; i++) {
            const wikiEntry = this.model.wikiEntries[i]
            promise = promise.then(() => this.syncWikiEntry(wikiEntry));
        }
        return promise
    }

    syncWikiEntry(wikiEntry) {
        if (wikiEntry.dirty) {
            const indexLink = 'https://discord.com/channels/' + this.model.serverId + '/' + wikiEntry.channelId + '/' + this.model.wikiIndexMessageId
            const hookData = {
                embeds: [
                    {
                        title: wikiEntry.title,
                        thumbnail: { url : this.model.thumbnailUrl },
                        image: { url : wikiEntry.imageUrl },
                        description: wikiEntry.content,
                        color: 5814783,
                    },
                    {
                        description: '[Zurück zum Inhaltsverzeichnis](' + indexLink + ')'
                    }
                ]
            }
            if (wikiEntry.messageId) {
                return this.discordService.patch(this.model.webhook, wikiEntry.messageId, hookData).then((response) => {
                    wikiEntry.dirty = false
                    this.storeModel()
                })
            } else {
                return this.discordService.post(this.model.webhook, hookData).then((response) => {
                    wikiEntry.messageId = response.id
                    wikiEntry.channelId = response.channel_id
                    wikiEntry.dirty = false
                    this.storeModel()
                })
            }
        }
        return Promise.resolve()
    }

    ensureIndex() {
        if (!this.model.wikiIndexMessageId) {
            const hookData = {
                embeds: [
                    {
                        title: 'Inhaltsverzeichnis der Wiki-Einträge',
                        thumbnail: { url : this.model.thumbnailUrl },
                        description: '',
                        color: 5814783
                    }
                ]
            }
            return this.discordService.post(this.model.webhook, hookData).then((response) => {
                this.model.wikiIndexMessageId = response.id
                this.storeModel()
            })
        }
        return Promise.resolve()
    }

    updateIndex() {
        const links = this.model.wikiEntries.map((wikiEntry) => {
            const messageLink = 'https://discord.com/channels/' + this.model.serverId + '/' + wikiEntry.channelId + '/' + wikiEntry.messageId
            return '[' + wikiEntry.title + '](' + messageLink + ')'
        });
        const description = links.join('\n')
        const hookData = {
            embeds: [
                {
                    title: 'Inhaltsverzeichnis der Wiki-Einträge',
                    thumbnail: { url : this.model.thumbnailUrl },
                    description: description,
                    color: 5814783
                }
            ]
        }
        return this.discordService.patch(this.model.webhook, this.model.wikiIndexMessageId, hookData).then((response) => {
        })
    }

}
