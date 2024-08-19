import axios from 'axios'
import URL from 'url'

export const urlExist = url => new Promise(resolve => {
    const urlObject = URL.parse(url)
    const getURL = `https://${urlObject.hostname || urlObject.host || urlObject.href}`
    
    axios.get(getURL, {
        timeout: 2000
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


export const getHostname = url => URL.parse(url).hostname || URL.parse(url).host || URL.parse(url).href