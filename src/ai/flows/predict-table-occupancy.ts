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
  historicalData: z.string().describe('Historical game data, including table ID, start time, end time, and duration.'),
});
export type PredictTableOccupancyInput = z.infer<typeof PredictTableOccupancyInputSchema>;

const PredictTableOccupancyOutputSchema = z.object({
  tablePredictions: z.array(
    z.object({
      tableId: z.string().describe('The ID of the billiard table.'),
      predictedOccupancy: z.number().describe('The predicted occupancy rate (0-1) for the table.'),
      reason: z.string().describe('The reason for the predicted occupancy.'),
    })
  ).describe('An array of table occupancy predictions.'),
});
export type PredictTableOccupancyOutput = z.infer<typeof PredictTableOccupancyOutputSchema>;

export async function predictTableOccupancy(input: PredictTableOccupancyInput): Promise<PredictTableOccupancyOutput> {
  return predictTableOccupancyFlow(input);
}

const predictTableOccupancyPrompt = ai.definePrompt({
  name: 'predictTableOccupancyPrompt',
  input: {schema: PredictTableOccupancyInputSchema},
  output: {schema: PredictTableOccupancyOutputSchema},
  prompt: `You are an AI assistant that analyzes historical billiard game data to predict table occupancy rates.

  Analyze the following historical data to predict the occupancy rate for each table.  Occupancy rate should be between 0 and 1.

  Historical Data: {{{historicalData}}}

  Provide a predicted occupancy rate and a brief explanation for each table.
  Ensure that the response matches the output schema.`, 
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
