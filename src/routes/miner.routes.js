import { Router } from 'express'
import { getMiners, getMiner, createMiner, editMiner, deleteMiner } from '../controllers/miner.controller';

const router = Router()

router.get('/', getMiners)

router.get('/:idMiner', getMiner)

router.post('/', createMiner)

router.put('/:idMiner', editMiner)

router.delete('/:idMiner', deleteMiner)

export default router