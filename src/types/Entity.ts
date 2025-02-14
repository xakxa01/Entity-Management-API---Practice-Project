export interface Luz {
	state: 'on' | 'off';
	brightness: number;
	friendly_name: string;
}

export interface Sensor {
	state: number | string;
	unit_of_measurement: string;
	friendly_name: string;
}

export interface Switch {
	state: 'on' | 'off' | 'unavailable';
	friendly_name: string;
}

export type EntityType = 'Luz' | 'Sensor' | 'Switch';

export type EntityData = Luz | Sensor | Switch;

export interface Entity {
	entity_id: string;
	client_id: string;
	type: EntityType;
	data: EntityData | EntityData[] | string;
	last_updated: string;
	last_reported: string;
	last_changed: string;
}
