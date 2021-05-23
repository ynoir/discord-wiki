import { inputField, select } from './components.js'

// TODO add thumbnail image url
export class TopPanel {

    constructor(controller, model, container) {
        this.controller = controller
        this.model = model
        this.container = container
    }

    render() {
        this.container.innerHTML = ''

        const webhookField = inputField({
            label: 'Webhook',
            value: this.model.webhook,
            onchange: (webhook) => {
                this.controller.setWebhook(webhook)
            },
            button: {
                label: 'Sync',
                action: () => this.controller.sync()
            }
        })

        const serverIdField = inputField({
            label: 'Server ID',
            value: this.model.serverId,
            onchange: (serverId) => {
                this.controller.setServerId(serverId)
            }
        })

        const thumbnailUrlField = inputField({
            label: 'Thumbnail URL',
            value: this.model.thumbnailUrl,
            onchange: (thumbnailUrl) => {
                this.controller.setThumbnailUrl(thumbnailUrl)
            }
        })

        const options = []
        for (let i=0; i<this.model.wikiEntries.length; i++) {
            options.push({
                label: this.model.wikiEntries[i].title,
                value: i,
                selected: i == this.model.wikiEntryEditIndex
            })
        }
        const wikiEntrySelect = select({
            label: 'Wiki Entries',
            options: options,
            addNew: () => this.controller.newWikiEntry(),
            select: (value) => this.controller.editWikiEntry(value)
        })

        this.container.appendChild(webhookField)
        this.container.appendChild(serverIdField)
        this.container.appendChild(thumbnailUrlField)
        this.container.appendChild(wikiEntrySelect)
    }

}
