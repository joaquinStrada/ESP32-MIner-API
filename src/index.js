import '@babel/polyfill'
import app from './app'
import { createConnection } from './utils/database'
import { createFolder } from './utils/uploadProfileImage'
createConnection()
createFolder()

app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'))
})