import axios from 'axios'
import https from 'https'
import URL from 'url'

const urlExist = url => new Promise(resolve => {
    const urlObject = URL.parse(url)
    const getURL = `https://${urlObject.hostname || urlObject.host || urlObject.href}`
    
    axios.get(getURL, {
        httpAgent: new https.Agent({
            keepAlive: true,
            timeout: 6000
        })
    })
        .then(res => {
            if (res.status && res.status >= 200 && res.status <= 299) {
                resolve(true)
            } else {
                resolve(false)
            }
        })
        .catch(() => {
            resolve(false)
        })
})

export default urlExist