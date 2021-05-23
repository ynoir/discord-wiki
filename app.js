import { Model } from './model.js'
import { Controller } from './controller.js'

const topPanelContainer = document.getElementById('topPanelContainer')
const wikiEntryPanelContainer = document.getElementById('wikiEntryPanelContainer')

const controller = new Controller(topPanelContainer, wikiEntryPanelContainer)
