import { inputField, button, textarea, select, divider } from './components.js'

export class WikiEntryPanel {

    constructor(controller, model, container) {
        this.controller = controller
        this.model = model
        this.container = container
    }

    render() {
        this.container.innerHTML = ''

        const options = []
        for (let i=0; i<this.model.wikiEntries.length; i++) {
            let title = this.model.wikiEntries[i].title
            if (this.model.wikiEntries[i].dirty) {
                title += ' *'
            }
            options.push({
                label: title,
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
        this.container.appendChild(wikiEntrySelect)

        if (this.model.wikiEntryEditIndex == undefined) {
            return
        }

        const entryDivider = divider()

        const wikiEntry = this.model.wikiEntries[this.model.wikiEntryEditIndex]

        const titleField = inputField({
            label: 'Title',
            value: wikiEntry.title,
            onchange: (title) => {
                this.controller.updateTitle(title)
            }
        })

        const contentField = textarea({
            value: wikiEntry.content,
            onchange: (content) => {
                this.controller.updateContent(content)
            }
        })

        const imageUrlField = inputField({
            label: 'Image URL',
            value: wikiEntry.imageUrl,
            onchange: (imageUrl) => {
                this.controller.updateImageUrl(imageUrl)
            }
        })

        let messageUrl = '(not yet published)'
        if (wikiEntry.messageId) {
            messageUrl = 'https://discord.com/channels/' + this.model.serverId + '/' + this.model.channelId + '/' + wikiEntry.messageId
        }
        const messageUrlField = inputField({
            label: 'Message URL',
            value: messageUrl,
            disabled: true,
            copyButton: true
        })

        const deleteButton = button({
            label: 'Delete',
            action: () => this.controller.deleteWikiEntry()
        })

        this.container.appendChild(entryDivider)
        this.container.appendChild(titleField)
        this.container.appendChild(contentField)
        this.container.appendChild(imageUrlField)
        this.container.appendChild(messageUrlField)
        this.container.appendChild(deleteButton)
    }
}
