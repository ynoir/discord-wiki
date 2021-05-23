import { inputField, button, textarea } from './components.js'

export class WikiEntryPanel {

    constructor(controller, model, container) {
        this.controller = controller
        this.model = model
        this.container = container
    }

    render() {
        this.container.innerHTML = ''

        if (this.model.wikiEntryEditIndex == undefined) {
            return
        }

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

        const deleteButton = button({
            label: 'Delete',
            action: () => this.controller.deleteWikiEntry()
        })

        this.container.appendChild(titleField)
        this.container.appendChild(contentField)
        this.container.appendChild(imageUrlField)
        this.container.appendChild(deleteButton)
    }
}
