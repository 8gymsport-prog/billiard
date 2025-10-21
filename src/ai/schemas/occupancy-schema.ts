import {z} from 'genkit';

export const PredictTableOccupancyInputSchema = z.object({
  historicalData: z.string().describe('Data permainan historis, termasuk ID meja, waktu mulai, waktu berakhir, dan durasi.'),
});
export type PredictTableOccupancyInput = z.infer<typeof PredictTableOccupancyInputSchema>;

export const PredictTableOccupancyOutputSchema = z.object({
  tablePredictions: z.array(
    z.object({
      tableId: z.string().describe('ID meja biliar.'),
      predictedOccupancy: z.number().describe('Tingkat okupansi yang diprediksi (0-1) untuk meja.'),
      reason: z.string().describe('Alasan untuk prediksi okupansi.'),
    })
  ).describe('Sebuah array prediksi okupansi meja.'),
});
export type PredictTableOccupancyOutput = z.infer<typeof PredictTableOccupancyOutputSchema>;
