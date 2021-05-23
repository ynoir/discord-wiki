const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'en',
    'Connection': 'keep-alive'
}

export class DiscordService {

    async post(webhook, data) {
        const response = await fetch(webhook + '?wait=true', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        });
        return await response.json()
    }

    async patch(webhook, messageId, data) {
        const response = await fetch(webhook + '/messages/' + messageId + '?wait=true', {
            method: 'PATCH',
            headers: headers,
            body: JSON.stringify(data)
        })
        return await response.json();
    }

}
