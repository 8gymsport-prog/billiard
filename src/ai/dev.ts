import { config } from 'dotenv';
config();

import '@/ai/schemas/occupancy-schema.ts';
import '@/ai/schemas/weather-schema.ts';
import '@/ai/flows/predict-table-occupancy.ts';
import '@/ai/flows/get-weather-forecast.ts';
