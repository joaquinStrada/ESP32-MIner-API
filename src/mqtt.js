import mqtt from 'mqtt'
import { config } from './utils/config'
import { getConn } from './utils/database'

const miners = {}

const validMiner = async topic => {
    if (miners.hasOwnProperty(topic)) return true

    try {
        const [minerBD] = await getConn().query('SELECT `serie`, `base_topic` FROM `miners` WHERE `base_topic` = ?', [topic])

        if (minerBD.length !== 1 || (minerBD.length > 0 && minerBD[0].base_topic !== topic)) {
            throw new Error('Miner not found')
        }

        miners[minerBD[0].base_topic] = {
            serie: minerBD[0].serie,
            updateTime: 0
        }
        return true
    } catch (err) {
        console.error(err)
        return false
    }
}

const onMessage = async (topic, message) => {
    try {
        const isValidMiner = await validMiner(topic)
        const date = new Date()
        
        if (isValidMiner && (date.getTime() - miners[topic].updateTime) >= config.mqtt.intervalTime) {
            // Registramos el nuevo dato
            const { validShares, invalidShares, memory, memoryPsram, disk, red, hashrate } = JSON.parse(message.toString())
            const newDataBD = {
                datetime: date,
                serie: miners[topic].serie,
                valid_shares: validShares,
                invalid_shares: invalidShares,
                memory,
                memory_psram: memoryPsram,
                disk,
                red,
                hashrate
            }
            
            await getConn().query('INSERT INTO `data` SET ?', [newDataBD])

            // Actualizamos el updateTime
            miners[topic].updateTime = date.getTime()
        }
    } catch (err) {
        console.error(err)
    }
}

const main = () => {
    const client = mqtt.connect(config.mqtt.url, config.mqtt.options)
    client.on('connect', () => {
        console.log('MQTT is connected to', config.mqtt.options.host)

        client.subscribe(config.mqtt.baseTopic, err => {
            if (err) {
                return console.error(err)
            }
            console.log('MQTT is suscribe to topic ->', config.mqtt.baseTopic);
        })
    })

    client.on('reconnect', () => console.log('Reconnecting to MQTT'))

    client.on('error', err => console.error(err))

    client.on('message', onMessage)
}

export default main

