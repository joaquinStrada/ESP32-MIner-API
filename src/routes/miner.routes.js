import { Router } from 'express'
import { getMiners, getMiner, createMiner, editMiner, deleteMiner } from '../controllers/miner.controller';

const router = Router()

router.get('/', getMiners)

router.get('/:id', getMiner)

router.post('/', createMiner)

router.put('/', editMiner)

router.delete('/', deleteMiner)

export default router