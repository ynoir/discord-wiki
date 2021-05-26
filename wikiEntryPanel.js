import { inputField, updateInputField, button, textarea, updateTextarea, select, updateSelect, divider } from './components.js'

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

        if (!this.rendered) {
            this.wikiEntrySelect = select({
                label: 'Wiki Entries',
                options: options,
                addNew: () => this.controller.newWikiEntry(),
                select: (value) => this.controller.editWikiEntry(value)
            })
            this.container.appendChild(this.wikiEntrySelect)
        } else {
            updateSelect(this.wikiEntrySelect, options)
            this.container.appendChild(this.wikiEntrySelect)
        }

        if (this.model.wikiEntryEditIndex == undefined) {
            return
        }

        const wikiEntry = this.model.wikiEntries[this.model.wikiEntryEditIndex]
        if (!wikiEntry) {
            return
        }

        let messageUrl = '(not yet published)'
        if (wikiEntry.messageId) {
            messageUrl = 'https://discord.com/channels/' + this.model.serverId + '/' + this.model.channelId + '/' + wikiEntry.messageId
        }

        if (!this.rendered) {
        
            this.entryDivider = divider()
    
            this.titleField = inputField({
                label: 'Title',
                value: wikiEntry.title,
                onchange: (title) => {
                    this.controller.updateTitle(title)
                }
            })
    
            this.contentField = textarea({
                value: wikiEntry.content,
                onchange: (content) => {
                    this.controller.updateContent(content)
                }
            })
    
            this.imageUrlField = inputField({
                label: 'Image URL',
                value: wikiEntry.imageUrl,
                onchange: (imageUrl) => {
                    this.controller.updateImageUrl(imageUrl)
                }
            })
    
            this.messageUrlField = inputField({
                label: 'Message URL',
                value: messageUrl,
                disabled: true,
                copyButton: true
            })
    
            this.deleteButton = button({
                label: 'Delete',
                action: () => this.controller.deleteWikiEntry()
            })
        } else {
            updateInputField(this.titleField, wikiEntry.title)
            updateTextarea(this.contentField, wikiEntry.content)
            updateInputField(this.imageUrlField, wikiEntry.imageUrl)
            updateInputField(this.messageUrlField, wikiEntry.imageUrl)
        }

        this.container.appendChild(this.entryDivider)
        this.container.appendChild(this.titleField)
        this.container.appendChild(this.contentField)
        this.container.appendChild(this.imageUrlField)
        this.container.appendChild(this.messageUrlField)
        this.container.appendChild(this.deleteButton)

        this.rendered = true
    }
}
