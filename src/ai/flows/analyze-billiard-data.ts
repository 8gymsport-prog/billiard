'use server';

/**
 * @fileOverview Menganalisis data biliar historis untuk menjawab pertanyaan pengguna.
 *
 * - analyzeBilliardData - Menjawab pertanyaan tentang data historis.
 */

import {ai} from '@/ai/genkit';
import { AnalyzeBilliardDataInputSchema, AnalyzeBilliardDataOutputSchema, type AnalyzeBilliardDataInput, type AnalyzeBilliardDataOutput } from '@/ai/schemas/billiard-data-schema';

export async function analyzeBilliardData(input: AnalyzeBilliardDataInput): Promise<AnalyzeBilliardDataOutput> {
  return analyzeBilliardDataFlow(input);
}

const analyzeBilliardDataPrompt = ai.definePrompt({
  name: 'analyzeBilliardDataPrompt',
  input: {schema: AnalyzeBilliardDataInputSchema},
  output: {schema: AnalyzeBilliardDataOutputSchema},
  prompt: `Anda adalah seorang analis data ahli untuk sebuah bisnis biliar. Tugas Anda adalah menjawab pertanyaan berdasarkan data historis sesi yang disediakan.
  
  Jawablah pertanyaan berikut secara ringkas dan jelas dalam Bahasa Indonesia.

  Data Historis (format: Meja, Mulai, Selesai, Biaya):
  {{{historicalData}}}

  Pertanyaan: "{{{query}}}"

  Berikan jawaban langsung untuk pertanyaan tersebut berdasarkan data yang ada.
  
  Contoh Jawaban:
  - Jika ditanya "Meja mana yang paling menguntungkan?", jawabannya bisa: "Meja 3 adalah yang paling menguntungkan dengan total pendapatan Rp150.000."
  - Jika ditanya "Kapan waktu paling ramai?", jawabannya bisa: "Waktu paling ramai adalah sekitar pukul 19:00 - 21:00."

  Pastikan respons sesuai dengan skema output.`,
});

const analyzeBilliardDataFlow = ai.defineFlow(
  {
    name: 'analyzeBilliardDataFlow',
    inputSchema: AnalyzeBilliardDataInputSchema,
    outputSchema: AnalyzeBilliardDataOutputSchema,
  },
  async input => {
    const {output} = await analyzeBilliardDataPrompt(input);
    return output!;
  }
);
