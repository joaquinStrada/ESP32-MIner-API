import { config } from '../utils/config'
import { getConn } from '../utils/database'
import jwt from 'jsonwebtoken'

const validateToken = async (req, res, next) => {
    try {
        // Validamos que nos hayan enviado el token
        let token = req.headers?.authorization

        if (!token) {
            throw new Error('No existe el token')
        } else if (!token.startsWith('Bearer ')) {
            throw new Error('Formato de token invalido')
        }

        token = token.replace('Bearer', '').trim()

        // Validamos que el token este en la lista blanca y habilitado
        const [ tokenFound ] = await getConn().query('SELECT * FROM `whiteList` WHERE `access_token` = ?;', [token])

        if (tokenFound.length === 0 || tokenFound[0].access_token !== token) {
            throw new Error('Token no registrado')
        } else if (tokenFound[0].enabled !== 1) {
            throw new Error('Token deshabilitado')
        }

        // Validamos el token
        const { userId } = jwt.verify(token, config.jwt.accessToken)

        if (tokenFound[0].user_id !== userId) {
            throw new Error('Token no coincide')
        }

        // Validamos el usuario
        const [ userFound ] = await getConn().query('SELECT `id`, `created_at`, `fullname`, `email`, `user`, `image_small`, `image_big`, `id_user_mqtt` FROM `users` WHERE `id` = ?;', [userId])

        if (userFound.length === 0 || userFound[0].id !== userId) {
            throw new Error('Usuario no existe')
        }

        // Le concedemos el acceso
        req.user = userFound[0]
        next()
    } catch (err) {
        console.error(err)
        res.status(401).json({
            error: true,
            message: 'Acceso denegado'
        })
    }
}

export default validateToken