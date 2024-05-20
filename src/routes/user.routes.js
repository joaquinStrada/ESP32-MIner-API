import { Router } from 'express'
import fileUpload from 'express-fileupload'
import { getUser, login, refreshToken, register } from '../controllers/user.controller'
import validateToken from '../middelwares/validateToken.middelware'

const router = Router()

router.post('/login', login)

router.post('/register', fileUpload(), register)

router.post('/refresh', refreshToken)

router.get('/', validateToken, getUser)

export default router