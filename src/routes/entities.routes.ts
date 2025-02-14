import { Router } from 'express';
import { getAllEntities } from '../controllers/entities/getAllEntities.ts';
import { createEntity } from '../controllers/entities/createEntity.ts';
import { getEntity } from '../controllers/entities/getEntity.ts';
import { updateEntity } from '../controllers/entities/updateEntity.ts';
import { deleteEntity } from '../controllers/entities/deleteEntity.ts';

const router = Router();

router.route('/')
	.get(getAllEntities)
	.post(createEntity);

router.route('/:id')
	.get(getEntity)
	.put(updateEntity)
	.delete(deleteEntity);

export default router;

