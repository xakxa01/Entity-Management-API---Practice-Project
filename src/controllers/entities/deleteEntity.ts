import type { Request, Response } from 'express';
import { db } from '../../database.ts';

export const deleteEntity = async (req: Request, res: Response): Promise<void> => {
	try {
		const { id } = req.params;
		const result = db.prepare('DELETE FROM entities WHERE entity_id = ?').run(id);

		if (result.changes === 0) {
			res.status(404).json({ error: 'entidad no encontrada' });
			return;
		}

		res.status(204).send("entity eliminado");
	} catch (error) {
		res.status(500).json({ error: (error as Error).message });
	}
}
