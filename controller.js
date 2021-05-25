import { TopPanel } from './topPanel.js'
import { WikiEntryPanel } from './wikiEntryPanel.js'
import { DiscordService } from './discordService.js'
import { Model } from './model.js'
import { showOverlay, hideOverlay } from './components.js'

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

    modelChanged() {
        this.wikiEntryPanel.render()
        localStorage.setItem('discordWiki', JSON.stringify(this.model));
    }

    import(event) {
        var reader = new FileReader();
        reader.onload = () => {
            this.model = JSON.parse(reader.result)
            this.topPanel.model = this.model
            this.wikiEntryPanel.model = this.model
            this.modelChanged()
        }
        reader.readAsText(event.target.files[0]);
    }

    export() {
        const hiddenElement = document.createElement('a')
        const modelString = JSON.stringify(this.model, null, 4)
        hiddenElement.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(modelString)
        hiddenElement.download = 'discordWiki.json'
        hiddenElement.click()
    }

    setWebhook(webhook) {
        this.model.webhook = webhook
        this.modelChanged()
    }

    setServerId(serverId) {
        this.model.serverId = serverId
        this.modelChanged()
    }

    setThumbnailUrl(thumbnailUrl) {
        this.model.thumbnailUrl = thumbnailUrl
        this.model.wikiEntries.forEach((wikiEntry) => {
            wikiEntry.dirty = true
        })
        this.modelChanged()
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
        this.modelChanged()
    }

    deleteWikiEntry() {
        this.model.wikiEntries.splice(this.model.wikiEntryEditIndex, 1)
        this.model.wikiEntryEditIndex = undefined
        if (this.model.wikiEntries.length > 0) {
            this.model.wikiEntryEditIndex = 0
        }
        this.modelChanged()
    }

    updateTitle(title) {
        const wikiEntry = this.model.wikiEntries[this.model.wikiEntryEditIndex]
        wikiEntry.title = title
        wikiEntry.dirty = true
        this.modelChanged()
    }

    updateContent(content) {
        const wikiEntry = this.model.wikiEntries[this.model.wikiEntryEditIndex]
        wikiEntry.content = content
        wikiEntry.dirty = true
        this.modelChanged()
    }

    updateImageUrl(imageUrl) {
        const wikiEntry = this.model.wikiEntries[this.model.wikiEntryEditIndex]
        wikiEntry.imageUrl = imageUrl
        wikiEntry.dirty = true
        this.modelChanged()
    }

    sync() {
        showOverlay({
            text: 'Publishing...'
        })
        this.ensureIndex().then(() => {
            this.syncWikiEnties().then(() => {
                this.updateIndex().then(() => {
                    hideOverlay()
                })
            })
        })
    }

    queueSync(wikiEntities) {
        return new Promise((resolve) => {
            if (wikiEntities.length == 0) {
                resolve()
            } else {
                this.syncWikiEntry(wikiEntities.shift()).then(() => {
                    this.queueSync(wikiEntities).then(() => resolve())
                })
            }
        })
    }

    syncWikiEnties() {
        return new Promise((resolve) => {
            const dirtyEntries = this.model.wikiEntries.filter((wikiEntry) => wikiEntry.dirty)
            this.queueSync(dirtyEntries).then(() => resolve())
        })
    }

    syncWikiEntry(wikiEntry) {
        return new Promise((resolve) => {
            if (wikiEntry.dirty) {
                const indexLink = 'https://discord.com/channels/' + this.model.serverId + '/' + this.model.channelId + '/' + this.model.wikiIndexMessageId
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
                    this.discordService.patch(this.model.webhook, wikiEntry.messageId, hookData).then(() => {
                        wikiEntry.dirty = false
                        this.modelChanged()
                        resolve()
                    })
                } else {
                    this.discordService.post(this.model.webhook, hookData).then((response) => {
                        wikiEntry.messageId = response.id
                        wikiEntry.dirty = false
                        this.modelChanged()
                        resolve()
                    })
                }
            } else {
                resolve()
            }
        })
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
                this.model.channelId = response.channel_id
                this.modelChanged()
            })
        }
        return Promise.resolve()
    }

    updateIndex() {
        let indexEmdedDescriptions = []
        let indexEmdedDescription = ''
        this.model.wikiEntries.forEach((wikiEntry) => {
            const messageLink = 'https://discord.com/channels/' + this.model.serverId + '/' + this.model.channelId + '/' + wikiEntry.messageId
            const entryLink = '[' + wikiEntry.title + '](' + messageLink + ')'
            if (indexEmdedDescription.length + entryLink.length >= 1998) {
                indexEmdedDescriptions.push(indexEmdedDescription)
                indexEmdedDescription = ''
            }
            indexEmdedDescription += entryLink + '\n'
        });
        indexEmdedDescriptions.push(indexEmdedDescription)
        let first = true
        const embeds = indexEmdedDescriptions.map((indexEmdedDescription) => {
            const embed = {
                description: indexEmdedDescription,
                color: 5814783
            }
            if (first) {
                first = false
                embed.title = 'Inhaltsverzeichnis der Wiki-Einträge',
                embed.thumbnail = { url: this.model.thumbnailUrl }
            }
            return embed
        })
        const hookData = {
            embeds: embeds
        }
        return this.discordService.patch(this.model.webhook, this.model.wikiIndexMessageId, hookData)
    }
}
