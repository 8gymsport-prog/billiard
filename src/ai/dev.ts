import { config } from 'dotenv';
config();

import '@/ai/schemas/weather-schema.ts';
import '@/ai/schemas/billiard-data-schema.ts';
import '@/ai/flows/get-weather-forecast.ts';
import '@/ai/flows/analyze-billiard-data.ts';
