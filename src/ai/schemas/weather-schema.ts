import {z} from 'genkit';

export const GetWeatherForecastInputSchema = z.object({
  location: z.string().describe('Lokasi untuk mendapatkan perkiraan cuaca.'),
});
export type GetWeatherForecastInput = z.infer<typeof GetWeatherForecastInputSchema>;

export const WeatherForecastOutputSchema = z.object({
  temperature: z.number().describe('Suhu saat ini dalam Celcius.'),
  condition: z.string().describe('Kondisi cuaca dalam satu kata (misalnya, Cerah, Berawan, Hujan, Badai, Salju, Kabut) dalam Bahasa Indonesia.'),
});
export type WeatherForecastOutput = z.infer<typeof WeatherForecastOutputSchema>;
