import swaggerUI from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'
import path from 'path'
import fs from 'fs'
import { config } from './config'

const { description, version } = JSON.parse(fs.readFileSync(path.resolve('package.json'), {
    encoding: 'utf-8'
}))

const urlApi = `${config.api.https ? 'https' : 'http'}://${config.api.host}:${config.api.port}`

const specs = swaggerJsdoc({
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'ESP32 Miner Api',
            description,
            version
        },
        servers: [
            {
                url: urlApi
            }
        ]
    },
    apis: ['./src/routes/*.js', './src/app.js']
})

const swaggerInit = app => {
    app.use(swaggerUI.serve, swaggerUI.setup(specs))
}

export default swaggerInit