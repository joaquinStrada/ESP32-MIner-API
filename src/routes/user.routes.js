import { Router } from 'express'
import fileUpload from 'express-fileupload'
import { editUser, getUser, login, refreshToken, register } from '../controllers/user.controller'
import validateToken from '../middelwares/validateToken.middelware'

const router = Router()

router.post('/login', login)

router.post('/register', fileUpload(), register)

router.get('/refresh', refreshToken)

router.get('/', validateToken, getUser)

router.put('/', fileUpload(), validateToken, editUser)

export default router