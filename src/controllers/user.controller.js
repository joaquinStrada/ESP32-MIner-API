import { schemaLogin, schemaRegister } from '../joi/user.joi'
import { getConn } from '../utils/database'
import { v4 as uuid } from 'uuid'
import bcrypt from 'bcrypt'
import uploadProfileImage from '../utils/uploadProfileImage'
import generateToken from '../utils/generateToken'
import jwt from 'jsonwebtoken'
import { config } from '../utils/config'

export const login = async (req, res) => {
    const { user, password } = req.body
    
    // Validamos los campos
    const { error } = schemaLogin.validate({
        user,
        password
    })

    if (error) {
        return res.status(400).json({
            error: true,
            message: error.details[0].message
        })
    }

    try {
        // Verificamos que el usuario exista
        const [ userFound ] = await getConn().query('SELECT `id`, `password` FROM `users` WHERE `user` = ? OR `email` = ?;', [user, user])
        
        if (userFound.length === 0) {
            return res.status(401).json({
                error: true,
                message: 'Usuario y/o contraseña incorrectos'
            })
        }

        // Verificamos la contraseña
        const validPass = await bcrypt.compare(password, userFound[0].password)

        if (!validPass) {
            return res.status(401).json({
                error: true,
                message: 'Usuario y/o contraseña incorrectos'
            })
        }

        // Generamos el token
        const data = await generateToken(userFound[0].id)

        res.header('Authorization', `Bearer ${data.accessToken}`).json({
            error: false,
            data
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({
            error: true,
            message: 'Ha occurrido un error'
        })
    }
}

export const register = async (req, res) => {
    const { fullname, email, user, password } = req.body;

    // Validamos los campos
    const { error } = schemaRegister.validate({
        fullname,
        email,
        user,
        password
    })

    if (error) {
        return res.status(400).json({
            error: true,
            message: error.details[0].message
        })
    }

    try {
        // Validamos que ni el email ni el usuario existan
        const [ userOrEmailExist ] = await getConn().query('SELECT `email`, `user` FROM `users` WHERE `email` = ? OR `user` = ?;', [email, user])

        if (userOrEmailExist.length > 0 && userOrEmailExist[0].email == email) {
            return res.status(400).json({
                error: true,
                message: 'El email ya existe'
            })
        } else if (userOrEmailExist.length > 0 && userOrEmailExist[0].user == user) {
            return res.status(400).json({
                error: true,
                message: 'El usuario ya existe'
            })
        }

        // Creamos el usuario mqtt
        const userMqtt = {
            username: uuid(),
            password_hash: uuid(),
            is_superuser: 0,
            created: new Date()
        }

        const [ userMqttBD ] = await getConn().query('INSERT INTO `mqtt_user` SET ?', [userMqtt])

        // Encriptamos el password
        const salt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(password, salt)

        // Guardamos el usuario en la base de datos
        const newUser = {
            fullname,
            email,
            user,
            password: passwordHash,
            id_user_mqtt: userMqttBD.insertId
        }

        const [ userBD ] = await getConn().query('INSERT INTO `users` SEt ?', [newUser])

        // Subimos la imagen de perfil
        if (req.files && req.files.image) {
            const uploadImage = await uploadProfileImage(req.files.image, userBD.insertId)

            if (uploadImage.error) {
                return res.status(400).json(uploadImage)
            }
        }

        // Generamos el JWT Token
        const data = await generateToken(userBD.insertId)

        res.header('Authorization', `Bearer ${data.accessToken}`).json({
            error: false,
            data
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({
            error: true,
            message: 'Ha ocurrido un error'
        })
    }
}

export const refreshToken = async (req, res) => {
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
        const [ tokenFound ] = await getConn().query('SELECT * FROM `whiteList` WHERE `refresh_token` = ?;', [token])

        if (tokenFound.length === 0 || tokenFound[0].refresh_token !== token) {
            throw new Error('Token no registrado')
        } else if (tokenFound[0].enabled !== 1) {
            throw new Error('Token deshabilitado')
        }

        // Validamos el token
        const { userId } = jwt.verify(token, config.jwt.refreshToken)

        if (tokenFound[0].user_id !== userId) {
            throw new Error('El token no coincide')
        }

        // Validamos el usuario
        const [ userFound ] = await getConn().query('SELECT `id` FROM `users` WHERE `id` = ?;', [userId])

        if (userFound.length === 0 || userFound[0].id !== userId) {
            throw new Error('El usuario no existe')
        }

        // Eliminamos el token
        await getConn().query('DELETE FROM `whiteList` WHERE `id` = ?;', [tokenFound[0].id])

        // Generamos el nuevo token
        const data = await generateToken(userId)

        res.header('Authorization', `Bearer ${data.accessToken}`).json({
            error: false,
            data
        })
    } catch (err) {
        console.error(err)
        res.status(401).json({
            error: true,
            message: 'Acceso denegado'
        })
    }
}

export const getUser = async (req, res) => {
    const { created_at, fullname, email, user, image_small, image_big, id_user_mqtt } = req.user

    try {
        const [ mqttUser ] = await getConn().query('SELECT `username`, `password_hash` FROM `mqtt_user` WHERE `id` = ?;', [id_user_mqtt])

        if (mqttUser.length == 0) {
            res.status(500).json({
                error: true,
                message: 'El usuario mqtt no existe'
            })
        }

        res.json({
            error: false,
            data: {
                created_at,
                fullname,
                email,
                user,
                imageSmall: image_small,
                imageBig: image_big,
                mqttUser: mqttUser[0].username,
                mqttPassword: mqttUser[0].password_hash
            }
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({
            error: true,
            message: 'Ha ocurrido un error'
        })
    }
}