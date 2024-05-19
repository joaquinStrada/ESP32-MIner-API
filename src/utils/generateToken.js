import { config } from './config'
import jwt from 'jsonwebtoken'
import { getConn } from './database'

const generateToken = async userId => {
    try {
        const expiresInRefreshToken = 30 * 24 * 60 * 60 * 1000
        const expiresInAccessToken = 2 * 60 * 1000

        // Generamos el token
        const refreshToken = jwt.sign({
            userId
        }, config.jwt.refreshToken, {
            expiresIn: `${expiresInRefreshToken}ms`
        })

        const accessToken = jwt.sign({
            userId
        }, config.jwt.accessToken, {
            expiresIn: `${expiresInAccessToken}ms`
        })

        // Guardamos el token en la base de datos
        const newToken = {
            enabled: 1,
            refresh_token: refreshToken,
            access_token: accessToken,
            user_id: userId
        }

        await getConn().query('INSERT INTO `whiteList` SET ?', [newToken])

        return {
            accessToken,
            refreshToken,
            expiresInAccessToken,
            expiresInRefreshToken
        }
    } catch (err) {
        throw err
    }
}

export default generateToken