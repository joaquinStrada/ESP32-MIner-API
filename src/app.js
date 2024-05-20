import { config } from './utils/config'
import express from 'express'
import morgan from 'morgan'

// Importing Routes
import userRoutes from './routes/user.routes'
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

// Static routes
app.use('/users/profiles/', validateToken, validateProfile, express.static(config.imageProfile.storeImages))

export default app