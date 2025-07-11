import { config as dotenv } from 'dotenv'
import path from 'path'
dotenv()

export const config = {
    api: {
        https: process.env.IS_HTTPS || false,
        host: process.env.HOST || 'localhost',
        port: process.env.PORT || 3000,
        cors: {
            origin: process.env.HOST_APP || '',
            optionsSuccessStatus: 200
        }
    },
    database: {
        host: process.env.MYSQL_HOST || 'localhost',
        port: process.env.MYSQL_PORT || 3306,
        user: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD || '',
        database: process.env.MYSQL_DATABASE || 'esp32Miner'
    },
    imageProfile: {
        storeImages: path.join(__dirname, '../public/profiles'),
        exts: ['jpg', 'jpeg', 'gif', 'png', 'bmp']
    },
    jwt: {
        accessToken: process.env.JWT_ACCESS_TOKEN || '',
        refreshToken: process.env.JWT_REFRESH_TOKEN || ''
    },
    mqtt: {
        url: `mqtt://${process.env.MQTT_HOST || 'localhost'}`,
        options: {
            host: process.env.MQTT_HOST || 'localhost',
            port: process.env.MQTT_PORT || 1883,
            username: process.env.MQTT_USER || '',
            password: process.env.MQTT_PASSWORD || '',
            clientId: process.env.MQTT_CLIENT_ID || 'MQTT_Node',
            keepalive: 60 
        },
        baseTopic: process.env.MQTT_BASE_TOPIC || '+/#',
        intervalTime: process.env.MQTT_INTERVAL_TIME || 1000
    }
}