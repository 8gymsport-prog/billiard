'use server';

/**
 * @fileOverview Predicts billiard table occupancy based on historical data.
 *
 * - predictTableOccupancy - Predicts the occupancy of each billiard table.
 * - PredictTableOccupancyInput - The input type for the predictTableOccupancy function.
 * - PredictTableOccupancyOutput - The return type for the predictTableOccupancy function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictTableOccupancyInputSchema = z.object({
  historicalData: z.string().describe('Data permainan historis, termasuk ID meja, waktu mulai, waktu berakhir, dan durasi.'),
});
export type PredictTableOccupancyInput = z.infer<typeof PredictTableOccupancyInputSchema>;

const PredictTableOccupancyOutputSchema = z.object({
  tablePredictions: z.array(
    z.object({
      tableId: z.string().describe('ID meja biliar.'),
      predictedOccupancy: z.number().describe('Tingkat okupansi yang diprediksi (0-1) untuk meja.'),
      reason: z.string().describe('Alasan untuk prediksi okupansi.'),
    })
  ).describe('Sebuah array prediksi okupansi meja.'),
});
export type PredictTableOccupancyOutput = z.infer<typeof PredictTableOccupancyOutputSchema>;

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
