import { hideOverlay } from './components.js'

const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'en',
    'Connection': 'keep-alive'
}

export class DiscordService {

    post(webhook, data) {
        return this.sendRequest(webhook, data, 'POST')
    }

    patch(webhook, messageId, data) {
        return this.sendRequest(webhook + '/messages/' + messageId, data, 'PATCH')
    }

    sendRequest(url, data, method) {
        return new Promise((resolve) => {
            fetch(url + '?wait=true', {
                method: method,
                headers: headers,
                body: JSON.stringify(data)
            }).then((response) => {
                response.json().then((responseJson) => {
                    if (!response.ok) {
                        if (responseJson.message && responseJson.message.includes('rate limit')) {
                            setTimeout(() => {
                                this.sendRequest(url, data, method).then((responseJson) => resolve(responseJson))
                            }, 2000)
                        } else {
                            hideOverlay()
                            alert('Something went wrong while publishing following data:\n'
                                + JSON.stringify(data, null, 4)
                                + '\nThe response was:\n'
                                + JSON.stringify(responseJson, null, 4)
                                + '\nTry to fix the issue, and publish again.')
                        }
                    } else {
                        resolve(responseJson)        
                    }
                })
            });
        })
    }

}
