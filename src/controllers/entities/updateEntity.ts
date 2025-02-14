import type { Request, Response } from 'express';
import { db } from '../../database.ts';
import { entitySchema } from '../../schemas/entity.schema.ts';
import { getQuery } from '../../magicString/getQuery.ts';
import { validateDataByType } from '../../lib/validateDataByTye.ts';
import { z } from 'zod';

type UpdateFields = Partial<Omit<z.infer<typeof entitySchema>, 'entity_id' | 'client_id'>>;

export const updateEntity = async (req: Request, res: Response): Promise<void> => {
	try {
		const { id } = req.params;

		const existingEntity = db.prepare(getQuery).get(id);
		if (!existingEntity) {
			res.status(404).json({ error: 'entidad no encontrada' });
			return;
		}

		const parsedBody = entitySchema.partial().safeParse(req.body);
		if (!parsedBody.success) {
			res.status(400).json({ error: parsedBody.error.errors });
			return;
		}

		const updateFields: UpdateFields = parsedBody.data;

		const newType = updateFields.type ?? existingEntity.type;

		if (updateFields.data !== undefined) {
			const dataValidation = validateDataByType(newType, updateFields.data);

			if (!dataValidation.success) {
				res.status(400).json({ error: dataValidation.error.errors });
				return;
			}
		}

		if (Object.keys(updateFields).length === 0) {
			res.status(400).json({ error: 'no se proporcionaron campos para actualizar' });
			return;
		}

		const setClause = Object.keys(updateFields)
			.map(field => `${field} = ?`)
			.join(', ');

		const updateQuery = `UPDATE entities SET ${setClause} WHERE entity_id = ?`;

		const values = Object.values(updateFields).map(value =>
			typeof value === 'object' ? JSON.stringify(value) : value
		);
		values.push(id);

		const result = db.prepare(updateQuery).run(...values);

		if (result.changes === 0) {
			res.status(404).json({ error: 'entidad no encontrada' });
			return;
		}

		const updatedEntity = db.prepare(getQuery).get(id);
		if (updatedEntity) {
			try {
				updatedEntity.data = JSON.parse(updatedEntity.data);
			} catch {
				res.status(500).json({ error: 'error al parsear los datos de la entidad actualizada' });
				return;
			}

			res.json(updatedEntity);
		} else res.status(404).json({ error: 'entidad no encontrada' });
	} catch (error) {
		res.status(500).json({ error: (error as Error).message });
	}
};

