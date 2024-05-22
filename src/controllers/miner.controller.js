import { schemaCreate } from '../joi/miner.joi'
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
        const [ minerBD ] = await getConn().query('SELECT * FROM `miners` WHERE `id` = ? AND `user_id` = ?;', [ req.params.id, req.user.id ])

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
        const existUrl = await urlExist(poolUrl)
        
        if (!existUrl) {
            return res.status(400).json({
                error: true,
                message: 'La url de la pool no existe'
            })
        }

        // Validamos que la serie ni el nombre del minero se repitan (En caso del nombre es por usuario)
        const [ nameOrSerieValid ] = await getConn().query('SELECT `name`, `serie`, `user_id` FROM `miners` WHERE `name` = ? OR `serie` = ?;', [name, serie])

        const validName = nameOrSerieValid.filter(nameFound => nameFound.name === name && nameFound.user_id === req.user.id)
        const validSerie = nameOrSerieValid.filter(serieFound => serieFound.serie === serie)

        if (validName.length > 0) {
            return res.status(400).json({
                error: true,
                message: 'Ya tienes un minero registrado con ese nombre'
            })
        } else if (validSerie.length > 0) {
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
        const [ minerBD ] = await getConn().query('SELECT `id`, `created_at`, `name`, `description`, `serie`, `base_topic`, `pool_url`, `pool_port`, `wallet_address`, `conected` FROM `miners` WHERE `id` = ?;', [newMinerBD.insertId])

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

export const editMiner = (req, res) => {
    res.json('oh yeah!!!')
}

export const deleteMiner = (req, res) => {
    res.json('oh yeah!!!')
}