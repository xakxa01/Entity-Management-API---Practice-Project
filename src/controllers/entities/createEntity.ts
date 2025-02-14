import type { Request, Response } from 'express';
import { db } from '../../database.ts';
import { entitySchema } from '../../schemas/entity.schema.ts';
import { getQuery } from '../../magicString/getQuery.ts';
import { validateDataByType } from '../../lib/validateDataByTye.ts';

export const createEntity = async (req: Request, res: Response): Promise<void> => {
	try {
		const parsedBody = entitySchema.safeParse(req.body);

		if (!parsedBody.success) {
			res.status(400).json({ error: parsedBody.error.errors });
			return;
		}

		const { entity_id, client_id, type, data, last_updated, last_reported, last_changed } = parsedBody.data;

		const existingEntity = db.prepare('SELECT entity_id FROM entities WHERE entity_id = ?').get(entity_id);
		if (existingEntity) {
			res.status(409).json({ error: 'Entidad con la misma entidad_id ya existe' });
			return;
		}

		const parsedData = validateDataByType(type, data);
		if (!parsedData.success) {
			res.status(400).json({ error: parsedData.error.errors });
			return;
		}

		const insertQuery = `INSERT INTO entities (entity_id, client_id, type, data, last_updated, last_reported, last_changed) VALUES (?, ?, ?, ?, ?, ?, ?)`;
		db.prepare(insertQuery).run(
			entity_id,
			client_id,
			type,
			JSON.stringify(data),
			last_updated,
			last_reported,
			last_changed
		);

		const newEntity = db.prepare(getQuery).get(entity_id)

		if (newEntity) {
			try {
				newEntity.data = JSON.parse(newEntity.data);
			} catch {
				res.status(500).json({ error: 'error al parsear los datos de la entidad actualizada' });
				return;
			}

			res.status(201).json(newEntity);
		} else {
			res.status(500).json({ error: 'error al crear la entidad' });
		}

	} catch (error) {
		res.status(500).json({ error: (error as Error).message });
	}
};

