import { Router } from 'express'
import fileUpload from 'express-fileupload'
import { login, refreshToken, register } from '../controllers/user.controller';

const router = Router()

router.post('/login', login)

router.post('/register', fileUpload(), register)

router.post('/refresh', refreshToken)

export default router