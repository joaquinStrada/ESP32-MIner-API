import { getConn } from './database'
import { config } from './config'
import fs from 'fs/promises'
import path from 'path'
import { v4 as uuid } from 'uuid'
import Jimp from 'jimp'

const uploadProfileImage = async (file, userId) => {
    try {
        // Validamos que el formato de la imagen este soportado
        const ext = path.extname(file.name).replace('.', '')

        if (!config.imageProfile.exts.includes(ext)) {
            return {
                error: true,
                message: 'La extension no esta soportada'
            }
        }

        // Eliminamos la foto de perfil anterior si existe
        const [ userBD ] = await getConn().query('SELECT `image_small`, `image_big` FROM `users` WHERE `id` = ?;', [userId])
      
        if (userBD[0].image_small || userBD[0].image_big) {
            await deleteFile(path.join(config.imageProfile.storeImages, userBD[0].image_small))
            await deleteFile(path.join(config.imageProfile.storeImages, userBD[0].image_big))
        }

        // Declaramos las variables y subimos la imagen al servidor
        const filePath = await uploadFile(file)
        const imageSmall = `${userId}_image_small.${ext}`
        const imageBig = `${userId}_image_big.${ext}`
        const pathImageSmall = path.join(config.imageProfile.storeImages, imageSmall)
        const pathImageBig = path.join(config.imageProfile.storeImages, imageBig)

        // Redimensionamos las imagenes
        const Image = await Jimp.read(filePath)
        await Image.resize(50, 50).writeAsync(pathImageSmall)
        await Image.resize(300, 300).writeAsync(pathImageBig)

        // Eliminamos la image original
        await fs.unlink(filePath)

        // Actualizamos la base de datos con la imagen de perfil
        const editUser = {
            image_small: imageSmall,
            image_big: imageBig
        }

        await getConn().query('UPDATE `users` SET ? WHERE id = ?;', [editUser, userId])
        return {
            error: false,
            message: ''
        }
    } catch (err) {
        throw err
    }
}

const deleteFile = filePath => new Promise((res, rej) => {
    fs.access(filePath)
        .then(() => {
            fs.unlink(filePath)
                .then(() => res(filePath))
                .catch(err => rej(err))
        })
})

export const createFolder = () => new Promise(res => {
    fs.access(config.imageProfile.storeImages)
        .catch(() => {
            fs.mkdir(config.imageProfile.storeImages, {
                recursive: true
            })
                .then(() => res(config.imageProfile.storeImages))
                .catch(err => console.error(err))
        })
})

const uploadFile = file => {
    const fileName = uuid() + path.extname(file.name)
    const filePath = path.join(config.imageProfile.storeImages, fileName)

    return new Promise((res, rej) => {
        fs.access(filePath)
            .then(() => rej(new Error(`El archivo ${fileName} ya existe`)))
            .catch(() => file.mv(filePath, err => {
                if (err) {
                    rej(err)
                } else {
                    res(filePath)
                }
            }))
    })
}

export default uploadProfileImage;