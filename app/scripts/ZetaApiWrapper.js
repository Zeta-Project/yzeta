export class ZetaApiWrapper {

    authenticate() {
        return fetch("http://zeta-dev.syslab.in.htwg-konstanz.de/signIn", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: "email=manuele.lorusso%40htwg-konstanz.de&password=zetadev",
            credentials: "include"
        });
    }

    async getConceptDefinition(metaModelId) {
        const url = "http://zeta-dev.syslab.in.htwg-konstanz.de/rest/v1/meta-models/" + metaModelId + "/definition"

        try {
            const auth = this.authenticate();
        } catch (e) {
            console.log("Already authenticated?", e)
        }

        return fetchUrl(url).then(checkStatus).then(json)
    }
}

function fetchUrl(url) {
    return fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include"
    })
}

function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response)
    } else {
        return Promise.reject()
    }
}

function json(response) {
    return response.json()
}
