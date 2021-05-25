import { inputField, importExportButtons } from './components.js'

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
            password: true,
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

        const importExport = importExportButtons({
            importLabel: 'Import',
            importAction: (value) => this.controller.import(value),
            exportLabel: 'Export',
            exportAction: () => this.controller.export()
        })

        this.container.appendChild(webhookField)
        this.container.appendChild(serverIdField)
        this.container.appendChild(thumbnailUrlField)
        this.container.appendChild(importExport)
    }

}
