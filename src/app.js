import { config } from './utils/config'
import express from 'express'
import morgan from 'morgan'
import swagger from './utils/swagger'

// Importing Routes
import userRoutes from './routes/user.routes'
import minerRoutes from './routes/miner.routes'
import validateToken from './middelwares/validateToken.middelware'
import validateProfile from './middelwares/validateProfile.middelware'

const app = express()

// Settings
app.set('port', config.api.port)
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Routes
app.use('/api/v1/user', userRoutes)
app.use('/api/v1/miner', minerRoutes)

// Static routes
/**
 * @swagger
 * /users/profiles/{nameImage}:
 *     get:
 *      summary: Obtener imagen de perfil
 *      tags: [Users]
 *      parameters:
 *          - in: path
 *            name: Nombre de la imagen
 *            description: Nombre de la foto de perfil
 *            required: true
 *            schema:
 *              type: String
 *          - $ref: '#/components/parameters/AccessToken'
 *      responses:
 *          200:
 *              description: Imagen de usuario
 *              content:
 *                  image/jpg:
 *                      schema:
 *                          type: binary
 *                          description: Imagen de usuario
 *                          required: true
 *                  image/jpeg:
 *                      schema:
 *                          type: binary
 *                          description: Imagen de usuario
 *                          required: true
 *                  image/gif:
 *                      schema:
 *                          type: binary
 *                          description: Imagen de usuario
 *                          required: true
 *                  image/png:
 *                     schema:
 *                          type: binary
 *                          description: Imagen de usuario
 *                          required: true
 *                  image/bmp:
 *                      schema:
 *                          type: binary
 *                          description: Imagen de usuario
 *                          required: true
 *          401:
 *              description: Acceso denegado
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/AccessDenied'
 *          404:
 *              description: Imagen de usuario no encontrada
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              error:
 *                                  type: Boolean
 *                                  description: Indica si hubo error
 *                                  example: true
 *                              message:
 *                                  type: String
 *                                  description: Mensaje de error
 *                                  example: Imagen no encontrada
 *                          required:
 *                              - error
 *                              - message
 */
app.use('/users/profiles/', validateToken, validateProfile, express.static(config.imageProfile.storeImages))

// Initialize swagger
swagger(app)

export default app