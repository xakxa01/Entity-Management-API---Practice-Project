import { ZodError, type ZodIssue } from "zod";
import { luzSchema, sensorSchema, switchSchema } from "../schemas/entity.schema.ts";

export const validateDataByType = (type: string, data: unknown) => {
	switch (type) {
		case 'Luz':
			return luzSchema.safeParse(data);
		case 'Sensor':
			return sensorSchema.safeParse(data);
		case 'Switch':
			return switchSchema.safeParse(data);
		default:
			const error: ZodIssue = {
				code: 'custom',
				message: 'Tipo de entidad no soportado.',
				path: ['type'],
			};
			return { success: false, error: new ZodError([error]) };
	}
}