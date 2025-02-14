import type { Request, Response } from 'express';
import { db } from '../../database.ts';

const getPagination = (query: any) => {
	const
		defaultPage = 1,
		defaultLimit = 10;

	let
		page = Number(query.page) || defaultPage,
		limit = Number(query.limit) || defaultLimit;

	if (page < 1) page = 1;
	if (limit < 1) limit = 10;

	const offset = (page - 1) * limit;

	return { page, limit, offset };
};

const fetchEntities = (limit: number, offset: number) =>
	db.prepare('SELECT * FROM entities LIMIT ? OFFSET ?').all(limit, offset);

const fetchTotalCount = () => {
	const countResult = db.prepare('SELECT COUNT(*) as count FROM entities').get();
	return countResult.count as number;
};

const parseEntities = (entities: any[]) => entities.map(entity => ({
	...entity,
	data: JSON.parse(entity.data)
}));

export const getAllEntities = async (req: Request, res: Response): Promise<void> => {
	try {
		const { page, limit, offset } = getPagination(req.query);
		const entities = fetchEntities(limit, offset);
		const
			total = fetchTotalCount(),
			totalPages = Math.ceil(total / limit);

		const parsedEntities = parseEntities(entities);

		res.json({
			page,
			limit,
			total,
			totalPages,
			data: parsedEntities,
		});
	} catch (error) {
		res.status(500).json({ error: (error as Error).message });
	}
};

