import {z} from 'genkit';

export const AnalyzeBilliardDataInputSchema = z.object({
  historicalData: z.string().describe('Data CSV dari sesi biliar yang telah selesai.'),
  query: z.string().describe('Pertanyaan pengguna tentang data tersebut.'),
});
export type AnalyzeBilliardDataInput = z.infer<typeof AnalyzeBilliardDataInputSchema>;

export const AnalyzeBilliardDataOutputSchema = z.object({
  analysis: z.string().describe('Jawaban yang dihasilkan oleh AI terhadap pertanyaan pengguna.'),
});
export type AnalyzeBilliardDataOutput = z.infer<typeof AnalyzeBilliardDataOutputSchema>;
