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
                            alert('Oh no, something went wrong!\n' + JSON.stringify(response, null, 4))
                        }
                    } else {
                        resolve(responseJson)        
                    }
                })
            });
        })
    }

}
