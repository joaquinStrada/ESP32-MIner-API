import { schemaRegister } from '../joi/user.joi'
import { getConn } from '../utils/database'
import { v4 as uuid } from 'uuid'
import bcrypt from 'bcrypt'
import uploadProfileImage from '../utils/uploadProfileImage'
import generateToken from '../utils/generateToken'

export const login = (req, res) => {
    res.json('oh yeah!!!')
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