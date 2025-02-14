import { z } from 'zod';

export const luzSchema = z.object({
	state: z.enum(['on', 'off']),
	brightness: z.number().min(0).max(255),
	friendly_name: z.string()
}).strict();

export const sensorSchema = z.object({
	state: z.union([z.number(), z.string()]),
	unit_of_measurement: z.string(),
	friendly_name: z.string()
}).strict();

export const switchSchema = z.object({
	state: z.enum(['on', 'off', 'unavailable']),
	friendly_name: z.string()
}).strict();

export const entitySchema = z.object({
	entity_id: z.string(),
	client_id: z.string(),
	type: z.enum(['Luz', 'Sensor', 'Switch']),
	data: z.union([luzSchema, sensorSchema, switchSchema]),
	last_updated: z.string(),
	last_reported: z.string(),
	last_changed: z.string()
}).strict();
