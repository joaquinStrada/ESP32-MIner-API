import '@babel/polyfill'
import app from './app'
import { createConnection } from './utils/database'
import mqtt from './mqtt'
import { createFolder } from './utils/uploadProfileImage'

app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'))
})

const main = async () => {
    try {
        createFolder()
        await createConnection()
        mqtt()
    } catch (err) {
        console.error(err)
    }
}

main()