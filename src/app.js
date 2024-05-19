import { config } from './utils/config'
import express from 'express'
import morgan from 'morgan'

// Importing Routes
import userRoutes from './routes/user.routes'

const app = express()

// Settings
app.set('port', config.api.port)
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Routes
app.use('/api/v1/user', userRoutes)

export default app