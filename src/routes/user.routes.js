import { Router } from 'express'
import fileUpload from 'express-fileupload'
import { login, register } from '../controllers/user.controller';

const router = Router()

router.post('/login', login)

router.post('/register', fileUpload(), register)

export default router