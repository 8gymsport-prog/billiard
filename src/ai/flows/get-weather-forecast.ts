'use server';

/**
 * @fileOverview Mendapatkan perkiraan cuaca untuk lokasi tertentu.
 *
 * - getWeatherForecast - Mendapatkan perkiraan cuaca saat ini.
 */

import {ai} from '@/ai/genkit';
import { GetWeatherForecastInputSchema, WeatherForecastOutputSchema, type GetWeatherForecastInput, type WeatherForecastOutput } from '@/ai/schemas/weather-schema';

export async function getWeatherForecast(input: GetWeatherForecastInput): Promise<WeatherForecastOutput> {
  return getWeatherForecastFlow(input);
}

const getWeatherForecastPrompt = ai.definePrompt({
  name: 'getWeatherForecastPrompt',
  input: {schema: GetWeatherForecastInputSchema},
  output: {schema: WeatherForecastOutputSchema},
  prompt: `Anda adalah asisten cuaca. Berikan perkiraan cuaca saat ini untuk lokasi berikut dalam Bahasa Indonesia.
  
  Gunakan hanya satu kata untuk kondisi cuaca.

  Lokasi: {{{location}}}

  Pastikan respons sesuai dengan skema output.`,
});

const getWeatherForecastFlow = ai.defineFlow(
  {
    name: 'getWeatherForecastFlow',
    inputSchema: GetWeatherForecastInputSchema,
    outputSchema: WeatherForecastOutputSchema,
  },
  async input => {
    const {output} = await getWeatherForecastPrompt(input);
    return output!;
  }
);
