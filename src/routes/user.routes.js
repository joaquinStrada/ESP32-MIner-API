import { Router } from 'express'
import fileUpload from 'express-fileupload'
import { editUser, getUser, login, refreshToken, register } from '../controllers/user.controller'
import validateToken from '../middelwares/validateToken.middelware'

const router = Router()

/**
 * @swagger
 * tags:
 *  name: Users
 *  description: Users endpoints
 */

/**
 * @swagger
 * components:
 *     schemas:
 *         TokenJWT:
 *             type: object
 *             description: Token JWT
 *             properties:
 *                 error:
 *                     type: Boolean
 *                     description: Indica si hubo error
 *                     example: false
 *                 data:
 *                     type: object
 *                     description: Tokens y tiempos
 *                     properties:
 *                         accessToken:
 *                             type: String
 *                             description: Token de acceso
 *                             example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTcxNzIwNjgwNywiZXhwIjoxNzE3MjA2OTI3fQ.1RELaZuCR6CwFleTzEG_gpIupmpAQAB_ZIrUcph_oC4
 *                         refreshToken:
 *                             type: String
 *                             description: Token de actualizacion
 *                             example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTcxNzIwNjgwNywiZXhwIjoxNzE5Nzk4ODA3fQ._KVisrg8cIwYh3JDoDzlSYgpbq3vUOTOCIIQnTzai5o
 *                         expiresInAccessToken:
 *                             type: Integer
 *                             description: Tiempo de expiracion del token de acceso (ms)
 *                             example: 120000
 *                         expiresInRefreshToken:
 *                             type: Integer
 *                             description: Tiempo de expiracion del token de actualizacion (ms)
 *                             example: 2592000000
 *                     required:
 *                         - accessToken
 *                         - refreshToken
 *                         - expiresInAccessToken
 *                         - expiresInRefreshToken
 *             required:
 *                 - error
 *                 - data
 *         InvalidRequest:
 *             type: object
 *             description: Error en el envio de los datos
 *             properties:
 *                 error:
 *                     type: Boolean
 *                     description: Indica si hubo error
 *                     example: true
 *                 message:
 *                     type: String
 *                     description: Mensaje de error
 *                     example: \"user\" length must be at least 6 characters long
 *             required:
 *                 - error
 *                 - message
 *         ServerError:
 *              type: object
 *              description: Error del servidor
 *              properties:
 *                  error:
 *                      type: Boolean
 *                      description: Indica si hubo error
 *                      example: true
 *                  message:
 *                      type: String
 *                      description: Mensaje de error
 *                      example: Ha occurrido un error
 *              required:
 *                  - error
 *                  - message
 *         RegisterUser:
 *             type: object
 *             description: Nuevo usuario
 *             properties:
 *                 fullname:
 *                     type: String
 *                     description: Nombre completo del usuario
 *                     example: Joaquin Jose Strada
 *                 email:
 *                     type: String
 *                     description: Email del usuario
 *                     example: joaquinstrada@hotmail.com.ar
 *                 user:
 *                     type: String
 *                     description: Nombre de usuario
 *                     example: joaquin
 *                 password:
 *                     type: String
 *                     description: Contraseña del usuario
 *                     example: 12345678
 *                 image:
 *                     type: file
 *                     description: Imagen de perfil
 *             required:
 *                 - fullname
 *                 - email
 *                 - user
 *         AccessDenied:
 *             type: object
 *             description: Acceso denegado
 *             properties:
 *                 error:
 *                     type: Boolean
 *                     description: Indica si hubo error
 *                     example: true
 *                 message:
 *                     type: String
 *                     description: Mensaje de error
 *                     example: Acceso denegado
 *             required:
 *                 - error
 *                 - message
 *         User:
 *             type: object
 *             properties:
 *                 error:
 *                     type: Boolean
 *                     description: Indica si hubo error
 *                     example: false
 *                 data:
 *                     type: object
 *                     description: Los datos del usuario
 *                     properties:
 *                         createdAt:
 *                             type: String
 *                             description: Fecha y hora de creacion del usuario
 *                             example: 2024-05-18T22:41:05.000Z
 *                         fullname:
 *                             type: String
 *                             description: Nombre completo del usuario
 *                             example: Joaquin Jose Strada
 *                         email:
 *                             type: String
 *                             description: Email del usuario
 *                             example: joaquinstrada@hotmail.com.ar
 *                         user:
 *                             type: String
 *                             description: Nombre de usuario
 *                             example: joaquinStrada
 *                         imageSmall:
 *                             type: String
 *                             description: Imagen de perfil pequeña
 *                             example: 2_image_small.jpg
 *                         imageBig:
 *                             type: String
 *                             description: Imagen de perfil grande
 *                             example: 2_image_big.jpg
 *                         mqttUser:
 *                             type: String
 *                             description: Usuario de mqtt
 *                             example: 38246efa-4580-4166-a85f-3ddf6ce5f5D2
 *                         mqttPassword:
 *                             type: String
 *                             description: Contraseña de mqtt
 *                             example: 381f23f8-ac27-4d67-a8f2-da82129daBFC
 *                     required:
 *                         - createdAt
 *                         - fullname
 *                         - email
 *                         - user
 *                         - imageSmall
 *                         - imageBig
 *                         - mqttUser
 *                         - mqttPassword
 *             required:
 *                 - error
 *                 - data
 *     parameters:
 *         AccessToken:
 *             in: header
 *             name: AccessToken
 *             description: Token de acceso
 *             required: true
 *             schema:
 *                 type: String
*/

/**
 * @swagger
 * /api/v1/user/login:
 *  post:
 *      summary: Login user
 *      tags: [Users]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          user:
 *                              type: String
 *                              description: Nombre de usuario
 *                              example: joaquin
 *                          password:
 *                              type: String
 *                              description: Contraseña del usuario
 *                              example: 12345678
 *                      required:
 *                          - user
 *                          - password
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                     type: object
 *                     properties:
 *                         user:
 *                             type: String
 *                             description: Nombre de usuario
 *                             example: joaquin
 *                         password:
 *                             type: String
 *                             description: Contraseña del usuario
 *                             example: 12345678
 *                     required:
 *                         - user
 *                         - password
 *      responses:
 *          200:
 *              description: Token de acceso
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/TokenJWT'
 *          400:
 *              description: Error en el envio de datos
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/InvalidRequest'
 *          401:
 *              description: Usuario y/o contraseña incorrectos
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              error:
 *                                  type: Boolean
 *                                  description: indica si hubo error
 *                                  example: true
 *                              message:
 *                                  type: String
 *                                  message: Mensaje de error
 *                                  example: Usuario y/o contraseña incorrectos
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
router.post('/login', login)

/**
 * @swagger
 * /api/v1/user/register:
 *     post:
 *      summary: Register user
 *      tags: [Users]
 *      requestBody:
 *          required: true
 *          content:
 *              multipart/form-data:
 *                  schema:
 *                      $ref: '#/components/schemas/RegisterUser'
 *      responses:
 *          200:
 *              description: Usuario registrado satisfactoriamente
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/TokenJWT'
 *          400:
 *              description: Error en el envio de datos
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/InvalidRequest'
 *          500:
 *              description: Error del servidor
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ServerError'
 */
router.post('/register', fileUpload(), register)

/**
 * @swagger
 * /api/v1/user/refresh:
 *     get:
 *      summary: Obtener un nuevo token de acceso
 *      tags: [Users]
 *      parameters:
 *          - in: header
 *            name: Token de actualizacion
 *            required: true
 *            schema:
 *              type: String
 *      responses:
 *          200:
 *              description: Nuevo token de acceso
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/TokenJWT'
 *          401:
 *              description: Acceso denegado
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/AccessDenied'
 */
router.get('/refresh', refreshToken)

/**
 * @swagger
 * /api/v1/user/:
 *     get:
 *      summary: Obtener usuario
 *      tags: [Users]
 *      parameters:
 *          - $ref: '#/components/parameters/AccessToken'
 *      responses:
 *          200:
 *              description: Tu usuario
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/User'
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
router.get('/', validateToken, getUser)

/**
 * @swagger
 * /api/v1/user/:
 *     put:
 *      summary: Actualizar usuario
 *      tags: [Users]
 *      parameters:
 *          - $ref: '#/components/parameters/AccessToken'
 *      requestBody:
 *          required: true
 *          content:
 *              multipart/form-data:
 *                  schema:
 *                      $ref: '#/components/schemas/RegisterUser'
 *      responses:
 *          200:
 *              description: Usuario actualizado
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/User'
 *          400:
 *              description: Error en el envio de datos
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/InvalidRequest'
 *          401:
 *              description: Acceso denegado
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/AccessDenied'
 *          500:
 *              description: Error en el servidor
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ServerError'
 */
router.put('/', fileUpload(), validateToken, editUser)

export default router