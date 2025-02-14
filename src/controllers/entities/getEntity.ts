import type { Request, Response } from 'express';
import { db } from '../../database.ts';
import { getQuery } from '../../magicString/getQuery.ts';

export const getEntity = async (req: Request, res: Response): Promise<void> => {
	try {
		const { id } = req.params;
		const entity = db.prepare(getQuery).get(id);

		if (!entity) {
			res.status(404).json({ error: 'entidad no encontrada' });
			return;
		}

		entity.data = JSON.parse(entity.data);
		res.json(entity);
	} catch (error) {
		res.status(500).json({ error: (error as Error).message });
	}
}
