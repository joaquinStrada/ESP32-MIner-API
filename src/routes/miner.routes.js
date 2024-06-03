import { Router } from 'express'
import validateToken from '../middelwares/validateToken.middelware'
import { getMiners, getMiner, createMiner, editMiner, deleteMiner, loginMiner } from '../controllers/miner.controller';

const router = Router()

/**
 * @swagger
 * tags:
 *  name: Miners
 *  description: Miners endpoints
 */

/**
 * @swagger
 * components:
 *     schemas:
 *         Miner:
 *              type: object
 *              description: Minero
 *              properties:
 *                  id:
 *                      type: Integer
 *                      description: Id del minero
 *                      example: 1
 *                  createdAt:
 *                      type: String
 *                      description: Fecha y hora de creacion del minero
 *                      example: 2024-05-22T00:50:52.000Z
 *                  name:
 *                      type: String
 *                      description: Nombre del minero
 *                      example: minador1
 *                  description:
 *                      type: String
 *                      description: Descripcion del minero
 *                      example: Este es mi primer mimnador
 *                  serie:
 *                      type: String
 *                      description: Serie del minero
 *                      example: 12345
 *                  baseTopic:
 *                      type: String
 *                      description: Topico base de mqtt del minero
 *                      example: 997b0f50-6ac2-4c62-ad52-8d649dbacfca
 *                  poolUrl:
 *                      type: String
 *                      description: Url de la pool
 *                      example: https://solo.ckpool.org/
 *                  poolPort:
 *                      type: Integer
 *                      description: Puerto de la pool
 *                      example: 2o20
 *                  walletAddress:
 *                      type: String
 *                      description: Direccion de la wallet a donde tiene que enviar lo que obtiene el minero
 *                      example: '0xaaa42F6d020fDa3809B60B4a2c66212c761708A7'
 *                  conected:
 *                      type: String
 *                      description: La ultima vez que se logeo el minero
 *                      example: 2024-05-30T23:29:07.000Z
 *              required:
 *                  - id
 *                  - createdAt
 *                  - name
 *                  - description
 *                  - serie
 *                  - baseTopic
 *                  - poolUrl
 *                  - poolPort
 *                  - walletAddress
 *                  - conected
 *         MinerNotFound:
 *             type: object
 *             description: Minero no encontrado
 *             properties:
 *                 error:
 *                     type: Boolean
 *                     description: Indica si hubo error
 *                     example: true
 *                 message:
 *                     type: String
 *                     description: Mensaje de error
 *                     example: Minero no encontrado
 *             required:
 *                 - error
 *                 - message
 *         ResponseMiner:
 *             type: object
 *             description: Minero obtenido
 *             properties:
 *                 error:
 *                     type: Boolean
 *                     description: Indica si hubo error
 *                     example: false
 *                 data:
 *                     $ref: '#/components/schemas/Miner'
 *             required:
 *                 - error
 *                 - data
 *         RequestMiner:
 *              type: object
 *              description: Datos a enviar del minero
 *              properties:
 *                  name:
 *                      type: String
 *                      description: Nombre del minero
 *                      example: minador1
 *                  description:
 *                      type: String
 *                      description: Descripcion del minero
 *                      example: Este es mi primer minador
 *                  serie:
 *                      type: String
 *                      description: Serie del minero
 *                      example: 12345
 *                  password:
 *                      type: String
 *                      description: Password del minero
 *                      example: 12345678
 *                  poolUrl:
 *                      type: String
 *                      description: Url de la pool
 *                      example: https://solo.ckpool.org/
 *                  poolPort:
 *                      type: Integer
 *                      description: Puerto de la pool
 *                      example: 2020
 *                  walletAddress:
 *                      type: String
 *                      description: La direccion de la wallet a donde tiene que enviar el dinero que obtiene el minero
 *                      example: '0xaaa42F6d020fDa3809B60B4a2c66212c761708A7'
 *              required:
 *                  - name
 *                  - description
 *                  - serie
 *                  - poolUrl
 *                  - poolPort
 *                  - walletAddress
 *         InvalidNameMiner:
 *             type: object
 *             description: El usuario ya tiene registrado un minador con ese nombre
 *             properties:
 *                 error:
 *                     type: Boolean
 *                     description: Indica si hubo error
 *                     example: true
 *                 message:
 *                     type: String
 *                     description: Mensaje de error
 *                     example: Ya tienes un minero registrado con ese nombre
 *             required:
 *                 - error
 *                 - message
 *     parameters:
 *         IdMiner:
 *             in: path
 *             name: Id del minero
 *             description: Id del minero
 *             required: true
 *             schema:
 *                 type: Integer
 */

/**
 * @swagger
 * /api/v1/miner:
 *  get:
 *      summary: Obtener todos los mineros
 *      tags: [Miners]
 *      parameters:
 *          - $ref: '#/components/parameters/AccessToken'
 *      responses:
 *          200:
 *              description: Los mineros del usuario
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          description: Los mineros del usuario
 *                          properties:
 *                              error:
 *                                  type: Boolean
 *                                  description: Indica si hubo error
 *                                  example: false
 *                              count:
 *                                  type: Integer
 *                                  descriptin: Cantidad de mineros que tiene el usuario
 *                                  example: 4
 *                              data:
 *                                  type: array
 *                                  description: Los mineros
 *                                  items:
 *                                      $ref: '#/components/schemas/Miner'
 *                          required:
 *                              - error
 *                              - count
 *                              - data
 *          401:
 *              description: Acceso denegado
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/AccessDenied'
 *          500:
 *              description: Error del servidor
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ServerError'                                 
 */
router.get('/', validateToken, getMiners)

/**
 * @swagger
 * /api/v1/miner/{idMiner}:
 *  get:
 *      summary: Obtener un minero
 *      tags: [Miners]
 *      parameters:
 *          - $ref: '#/components/parameters/IdMiner'
 *          - $ref: '#/components/parameters/AccessToken'
 *      responses:
 *          200:
 *              description: El minero
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ResponseMiner'
 *          401:
 *              description: Acceso denegado
 *              content:
 *                  application/json:
 *                      schema:
 *                         $ref: '#/components/schemas/AccessDenied'
 *          404:
 *              description: Minero no encontrado
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/MinerNotFound'
 *          500:
 *              description: Error del servidor
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ServerError'
 */
router.get('/:idMiner', validateToken, getMiner)

/**
 * @swagger
 * /api/v1/miner:
 *  post:
 *      summary: Crear un minero
 *      tags: [Miners]
 *      parameters:
 *          - $ref: '#/components/parameters/AccessToken'
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/RequestMiner'
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: '#/components/schemas/RequestMiner'
 *      responses:
 *          200:
 *              description: Minero registrado satisfactoriamente
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ResponseMiner'
 *          400:
 *              description: Error en el envio de datos
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/InvalidNameMiner'
 *          401:
 *              description: Acceso denegado
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/AccessDenied'
 *          500:
 *              description: Error del servidor
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ServerError'
 */
router.post('/', validateToken, createMiner)

/**
 * @swagger
 * /api/v1/miner/{idMiner}:
 *  put:
 *      summary: Actualizar un minero
 *      tags: [Miners]
 *      parameters:
 *          - $ref: '#/components/parameters/IdMiner'
 *          - $ref: '#/components/parameters/AccessToken'
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/RequestMiner'
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: '#/components/schemas/RequestMiner'
 *      responses:
 *          200:
 *              description: Minero actualizado satisfactoriamente
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ResponseMiner'
 *          400:
 *              description: Error en el envio de datos
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/InvalidNameMiner'
 *          401:
 *              description: Acceso denegado
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/AccessDenied'
 *          404:
 *              description: Minero no encontrado
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/MinerNotFound'
 *          500:
 *              description: Error del servidor
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ServerError'
 */
router.put('/:idMiner', validateToken, editMiner)

/**
 * @swagger
 * /api/v1/miner/{idMiner}:
 *  delete:
 *      summary: Eliminar minero
 *      tags: [Miners]
 *      parameters:
 *          - $ref: '#/components/parameters/IdMiner'
 *          - $ref: '#/components/parameters/AccessToken'
 *      responses:
 *          200:
 *              description: Minero eliminado satisfactoriamente
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          description: Minero eliminado
 *                          properties:
 *                              error:
 *                                  type: Boolean
 *                                  description: Indica si hubo error
 *                                  example: true
 *                              idMiner:
 *                                  type: Integer
 *                                  description: Id del minero eliminado
 *                                  example: 4
 *                              message:
 *                                  type: String
 *                                  description: Mensaje de que el minero fue eliminado
 *                                  example: Minero N° 4 eliminado satisfactoriamente
 *                          required:
 *                              - error
 *                              - idMiner
 *                              - message
 *          401:
 *              description: Acceso denegado
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/AccessDenied'
 *          404:
 *              description: Minero no encontrado
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/MinerNotFound'
 *          500:
 *              description: Error del servidor
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ServerError'
 */
router.delete('/:idMiner', validateToken, deleteMiner)

/**
 * @swagger
 * /api/v1/miner/login:
 *  post:
 *      summary: Login del minero
 *      tags: [Miners]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          serie:
 *                              type: String
 *                              description: Serie del minero
 *                              example: 12345
 *                          password:
 *                              type: String
 *                              description: Password del minero
 *                              example: 123456asdfgh
 *                      required:
 *                          - serie
 *                          - password
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          serie:
 *                              type: String
 *                              description: Serie del minero
 *                              example: 12345
 *                          password:
 *                              type: String
 *                              description: Password del minero
 *                              example: 123456asdfgh
 *                      required:
 *                          - serie
 *                          - password
 *      responses:
 *          200:
 *              descripcion: Informacion del minero
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          description: Informacion del minero
 *                          properties:
 *                              error:
 *                                  type: Boolean
 *                                  description: Indica si hubo error
 *                                  example: false
 *                              data:
 *                                  type: object
 *                                  description: Informacion del minero
 *                                  properties:
 *                                      poolUrl:
 *                                          type: String
 *                                          description: Url de la pool
 *                                          example: https://solo.ckpool.org/
 *                                      poolPort:
 *                                          type: Integer
 *                                          description: Puerto de la pool
 *                                          example: 2020
 *                                      walletAddress:
 *                                          type: String
 *                                          description: Direccion de la wallet a donde tiene que enviar lo que obtiene el minero
 *                                          example: 'xaaa42F6d020fDa3809B60B4a2c66212c761708A7'
 *                                      mqttUser:
 *                                          type: String
 *                                          description: Usuario de mqtt
 *                                          example: 38246efa-4580-4166-a85f-3ddf6ce5f5FG
 *                                      mqttPassword:
 *                                          type: String
 *                                          description: Contraseña de mqtt
 *                                          example: 381f23f8-ac27-4d67-a8f2-da82129dabJD
 *                                      mqttTopic:
 *                                          type: String
 *                                          description: Topico base de mqtt
 *                                          example: 97cc5728-9001-4f52-85ea-db2e67e51b5P
 *                                  required:
 *                                      - poolUrl
 *                                      - poolPort
 *                                      - walletAddress
 *                                      - mqttUser
 *                                      - mqttPassword
 *                                      - mqttTopic
 *                          required:
 *                              - error
 *                              - data
 *          400:
 *              description: Error en el envio de datos
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          description: Error en el envio de datos
 *                          properties:
 *                              error:
 *                                  type: Boolean
 *                                  description: indica si hubo error
 *                                  example: true
 *                              message:
 *                                  type: String
 *                                  description: Mensaje de error
 *                                  example: "\"password\" length must be at least 8 characters long"
 *                          required:
 *                              - error
 *                              - message
 *          401:
 *              description: Acceso denegado
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          description: Serie y/o password incorrectos
 *                          properties:
 *                              error:
 *                                  type: Boolean
 *                                  message: Indica si hubo error
 *                                  example: true
 *                              message:
 *                                  type: String
 *                                  description: Mensaje de error
 *                                  example: Serie y/o password incorrectos
 *                          required:
 *                              - error
 *                              - message
 *          500:
 *              description: Error del servidor
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ServerError'
 */
router.post('/login', loginMiner)

export default router