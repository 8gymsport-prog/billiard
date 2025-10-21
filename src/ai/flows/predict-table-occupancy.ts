'use server';

/**
 * @fileOverview Predicts billiard table occupancy based on historical data.
 *
 * - predictTableOccupancy - Predicts the occupancy of each billiard table.
 */

import {ai} from '@/ai/genkit';
import { PredictTableOccupancyInputSchema, PredictTableOccupancyOutputSchema, type PredictTableOccupancyInput, type PredictTableOccupancyOutput } from '@/ai/schemas/occupancy-schema';

export async function predictTableOccupancy(input: PredictTableOccupancyInput): Promise<PredictTableOccupancyOutput> {
  return predictTableOccupancyFlow(input);
}

const predictTableOccupancyPrompt = ai.definePrompt({
  name: 'predictTableOccupancyPrompt',
  input: {schema: PredictTableOccupancyInputSchema},
  output: {schema: PredictTableOccupancyOutputSchema},
  prompt: `Anda adalah asisten AI yang menganalisis data permainan biliar historis untuk memprediksi tingkat okupansi meja.

  Analisis data historis berikut untuk memprediksi tingkat okupansi untuk setiap meja. Tingkat okupansi harus antara 0 dan 1.

  Data Historis: {{{historicalData}}}

  Berikan prediksi tingkat okupansi dan penjelasan singkat untuk setiap meja dalam Bahasa Indonesia.
  Pastikan respons sesuai dengan skema output.`, 
});

const predictTableOccupancyFlow = ai.defineFlow(
  {
    name: 'predictTableOccupancyFlow',
    inputSchema: PredictTableOccupancyInputSchema,
    outputSchema: PredictTableOccupancyOutputSchema,
  },
  async input => {
    const {output} = await predictTableOccupancyPrompt(input);
    return output!;
  }
);
