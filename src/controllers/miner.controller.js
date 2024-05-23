import { schemaCreate, schemaUpdate } from '../joi/miner.joi'
import urlExist from '../utils/urlExist'
import { getConn } from '../utils/database'
import bcrypt from 'bcrypt'
import { v4 as uuid } from 'uuid'
import minerParser from '../utils/minerParser'

export const getMiners = async (req, res) => {
    try {
        const [ minersBD ] = await getConn().query('SELECT * FROM `miners` WHERE `user_id` = ?;', [req.user.id])

        const data = minersBD.map(miner => minerParser(miner))

        res.json({
            error: false,
            count: data.length,
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

export const getMiner = async (req, res) => {
    try {
        const [ minerBD ] = await getConn().query('SELECT * FROM `miners` WHERE `id` = ? AND `user_id` = ?;', [ req.params.idMiner, req.user.id ])

        if (minerBD.length == 0) {
            return res.status(404).json({
                error: true,
                message: 'Minador no encontrado'
            })
        }

        res.json({
            error: false,
            data: minerParser(minerBD[0])
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({
            error: true,
            message: 'Ha ocurrido un error'
        })
    }
}

export const createMiner = async (req, res) => {
    const { name, description, 
            serie, password, 
            poolUrl, poolPort, walletAddress } = req.body

    // Validamos los campos
    const { error } = schemaCreate.validate({
        name,
        description,
        serie,
        password,
        poolUrl,
        poolPort,
        walletAddress
    })

    if (error) {
        return res.status(400).json({
            error: true,
            message: error.details[0].message
        })
    }

    try {
        // Validamos que la pool url exista
        const poolExist = await urlExist(poolUrl)
        
        if (!poolExist) {
            return res.status(400).json({
                error: true,
                message: 'La url de la pool no existe'
            })
        }

        // Validamos que la serie ni el nombre del minero se repitan (En caso del nombre es por usuario)
        const [ nameOrSerieExist ] = await getConn().query('SELECT `name`, `serie`, `user_id` FROM `miners` WHERE `name` = ? OR `serie` = ?;', [name, serie])

        const existName = nameOrSerieExist.filter(nameFound => nameFound.name === name && nameFound.user_id === req.user.id)
        const existSerie = nameOrSerieExist.filter(serieFound => serieFound.serie === serie)

        if (existName.length > 0) {
            return res.status(400).json({
                error: true,
                message: 'Ya tienes un minero registrado con ese nombre'
            })
        } else if (existSerie.length > 0) {
            return res.status(400).json({
                error: true,
                message: 'Ya existe un minero con esa serie'
            })
        }

        // Encriptamos el password
        const salt = await bcrypt.genSalt(10)
        const passHash = await bcrypt.hash(password, salt)

        // Registramos el usuario en la BD
        const newMiner = {
            name,
            description,
            serie,
            password: passHash,
            base_topic: uuid(),
            pool_url: poolUrl,
            pool_port: poolPort,
            wallet_address: walletAddress,
            user_id: req.user.id
        }

        const [ newMinerBD ] = await getConn().query('INSERT INTO `miners` SET ?', [newMiner])

        // Habilitamos el topico para que escriba el minero
        const [ mqttFound ] = await getConn().query('SELECT `username` FROM `mqtt_user` WHERE `id` = ?;', [req.user.id_user_mqtt])

        const newACL = {
            username: mqttFound[0].username,
            action: 'all',
            permission: 'allow',
            topic: `${newMiner.base_topic}/#`
        }

        await getConn().query('INSERT INTO `mqtt_acl` SET ?', [newACL])

        // Devolvemos al usuario el nuevo minador
        const [ minerBD ] = await getConn().query('SELECT * FROM `miners` WHERE `id` = ?;', [newMinerBD.insertId])

        res.json({
            error: false,
            data: minerParser(minerBD[0])
        })
    } catch (err) {
       console.error(err)
       res.status(500).json({
            error: true,
            message: 'Ha ocurrido un error'
       }) 
    }
}

export const editMiner = async (req, res) => {
    const { name, description,
            serie, password, 
            poolUrl, poolPort, walletAddress } = req.body

    const { idMiner } = req.params
    const { id: userId } = req.user

    // Validamos los campos
    const { error } = schemaUpdate.validate({
        name,
        description,
        serie,
        password,
        poolUrl,
        poolPort,
        walletAddress
    })

    if (error) {
        return res.status(400).json({
            error: true,
            message: error.details[0].message
        })
    }

    try {
        // Validamos que la pool url exista
        const poolExist = await urlExist(poolUrl)

        if (!poolExist) {
            return res.status(400).json({
                error: true,
                message: 'La url de la pool no existe'
            })
        }

        // Validamos que el minero exista y sea nuestro
        const [ minerFound ] = await getConn().query('SELECT COUNT(*) FROM `miners` WHERE `id` = ? AND `user_id` = ?;', [idMiner, userId])

        if (minerFound[0]['COUNT(*)'] === 0) {
            return res.status(404).json({
                error: true,
                message: 'Minero no encontrado'
            })
        }

        // Validamos que el nombre (por usuario) mni la serie se repitan
        const [ nameOrSerieExist ] = await getConn().query('SELECT `id`, `name`, `serie`, `user_id` FROM `miners` WHERE `name` = ? OR `serie` = ?;', [ name, serie ])
        const nameExist = nameOrSerieExist.filter(nameFound => String(nameFound.name).toLowerCase() === String(name).toLowerCase() && nameFound.user_id === userId && nameFound.id !== idMiner)
        const serieExist = nameOrSerieExist.filter(serieFound => String(serieFound.serie).toLowerCase() === String(serie).toLowerCase() && serieFound.id !== idMiner)

        if (nameExist.length > 0) {
            return res.status(400).json({
                error: true,
                message: 'Ya tienes un minero con ese nombre'
            })
        } else if (serieExist.length > 0) {
            return res.status(400).json({
                error: true,
                message: 'Ya existe un minero con esa serie'
            })
        }

        // Actualizamos el minero
        const editMiner = {
            name,
            description,
            serie,
            pool_url: poolUrl,
            pool_port: poolPort,
            wallet_address: walletAddress
        }

        if (password) {
            const salt = await bcrypt.genSalt(10)
            editMiner.password = await bcrypt.hash(password, salt)
        }

        await getConn().query('UPDATE `miners` SET ? WHERE id = ?;', [ editMiner, idMiner ])

        // Devolvemos el minero actualizado
        const [ minerBD ] = await getConn().query('SELECT * FROM `miners` WHERE `id` = ?;', [ idMiner ])

        res.json({
            error: false,
            data: minerParser(minerBD[0])
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({
            error: true,
            message: 'Ha ocurrido un error'
        })
    }
}

export const deleteMiner = async (req, res) => {
    const { idMiner } = req.params
    const { id: userId } = req.user

    try {
        // Validamos si el minero existe y nos pertenece
        const [ minerFound ] = await getConn().query('SELECT COUNT(*), `base_topic` FROM `miners` WHERE `id` = ? AND `user_id` = ?;', [ idMiner, userId ])

        if (minerFound[0]['COUNT(*)'] === 0) {
            return res.status(404).json({
                error: true,
                message: 'Minero no encontrado'
            })
        }

        // Eliminamos el minero
        const mqttTopic = `${minerFound[0].base_topic}/#`

        await getConn().query('DELETE FROM `miners` WHERE `id` = ?;', [ idMiner ])
        await getConn().query('DELETE FROM `mqtt_acl` WHERE `topic` = ?;', [ mqttTopic ])

        // Respondemos al usuario
        res.json({
            error: false,
            idMiner,
            message: `Minero N° ${idMiner} eliminado satisfactoriamente`
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({
            error: true,
            message: 'Ha ocurrido un error'
        })
    }
}