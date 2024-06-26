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
    }
}