import { inputField, updateInputField, importExportButtons } from './components.js'

export class TopPanel {

    constructor(controller, model, container) {
        this.controller = controller
        this.model = model
        this.container = container
    }

    render() {
        this.container.innerHTML = ''

        if (!this.rendered) {

            this.wikiNameField = inputField({
                label: 'Wiki Name',
                value: this.model.wikiName,
                onchange: (wikiName) => {
                    this.controller.setWikiName(wikiName)
                }
            })
    
            this.indexTitleField = inputField({
                label: 'Index Title',
                value: this.model.indexTitle,
                onchange: (indexTitle) => {
                    this.controller.setIndexTitle(indexTitle)
                }
            })

            this.indexLinkNameField = inputField({
                label: 'Index Link Name',
                value: this.model.indexLinkName,
                onchange: (indexLinkName) => {
                    this.controller.setIndexLinkName(indexLinkName)
                }
            })
    
            this.indexMessageField = inputField({
                label: 'Channel ID / Index Message ID',
                value: this.model.channelId + ' / ' + this.model.wikiIndexMessageId,
                disabled: true
            })
    
            this.webhookField = inputField({
                label: 'Webhook',
                value: this.model.webhook,
                password: true,
                onchange: (webhook) => {
                    this.controller.setWebhook(webhook)
                },
                button: {
                    label: 'Publish',
                    action: () => this.controller.sync()
                }
            })
    
            this.serverIdField = inputField({
                label: 'Server ID',
                value: this.model.serverId,
                onchange: (serverId) => {
                    this.controller.setServerId(serverId)
                }
            })
    
            this.thumbnailUrlField = inputField({
                label: 'Thumbnail URL',
                value: this.model.thumbnailUrl,
                onchange: (thumbnailUrl) => {
                    this.controller.setThumbnailUrl(thumbnailUrl)
                }
            })
    
            this.importExport = importExportButtons({
                importLabel: 'Import',
                importAction: (value) => this.controller.import(value),
                exportLabel: 'Export',
                exportAction: () => this.controller.export()
            })
        } else {
            updateInputField(this.wikiNameField, this.model.wikiName)
            updateInputField(this.indexTitleField, this.model.indexTitle)
            updateInputField(this.indexLinkNameField, this.model.indexLinkName)
            updateInputField(this.webhookField, this.model.webhook)
            updateInputField(this.serverIdField, this.model.serverId)
            updateInputField(this.thumbnailUrlField, this.model.thumbnailUrl)
        }

        this.container.appendChild(this.webhookField)
        this.container.appendChild(this.wikiNameField)
        this.container.appendChild(this.indexTitleField)
        this.container.appendChild(this.indexLinkNameField)
        this.container.appendChild(this.thumbnailUrlField)
        this.container.appendChild(this.serverIdField)
        this.container.appendChild(this.indexMessageField)
        this.container.appendChild(this.importExport)

        this.rendered = true
    }

}
