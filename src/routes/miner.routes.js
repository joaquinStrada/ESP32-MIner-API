import { Router } from 'express'
import validateToken from '../middelwares/validateToken.middelware'
import { getMiners, getMiner, createMiner, editMiner, deleteMiner, loginMiner } from '../controllers/miner.controller';

const router = Router()

router.get('/', validateToken, getMiners)

router.get('/:idMiner', validateToken, getMiner)

router.post('/', validateToken, createMiner)

router.put('/:idMiner', validateToken, editMiner)

router.delete('/:idMiner', validateToken, deleteMiner)

router.post('/login', loginMiner)

export default router