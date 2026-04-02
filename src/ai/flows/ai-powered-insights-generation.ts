
'use server';
/**
 * @fileOverview A Genkit flow for generating AI-powered insights on disease trends, R_t values, and transmission factors.
 * Uses advanced Data Science context for technical analysis.
 *
 * - generateAIPoweredInsights - A function that handles the AI-powered insights generation process.
 * - GenerateInsightsInput - The input type for the generateAIPoweredInsights function.
 * - GenerateInsightsOutput - The return type for the generateAIPoweredInsights function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateInsightsInputSchema = z.object({
  region: z.string().describe('The geographical region for which insights are requested.'),
  historicalCases: z.array(
    z.object({
      date: z.string().describe('Date in YYYY-MM-DD format'),
      cases: z.number().int().describe('Number of cases'),
      rtValue: z.number().describe('Calculated R_t value for this date'),
    })
  ).describe('Historical time-series data for disease cases and R_t.'),
  predictedCases: z.array(
    z.object({
      date: z.string().describe('Date in YYYY-MM-DD format'),
      cases: z.number().int().describe('Predicted number of cases'),
      rtValue: z.number().describe('Predicted R_t value for this date'),
    })
  ).describe('Predicted future time-series data for disease cases and R_t.'),
  vaccinationData: z.array(
    z.object({
      date: z.string().describe('Date in YYYY-MM-DD format'),
      vaccinationRate: z.number().describe('Percentage of population vaccinated'),
    })
  ).optional().describe('Optional historical time-series data for vaccination rates.'),
  mobilityData: z.array(
    z.object({
      date: z.string().describe('Date in YYYY-MM-DD format'),
      mobilityIndex: z.number().describe('Mobility index relative to a baseline'),
    })
  ).optional().describe('Optional historical time-series data for population mobility.'),
});
export type GenerateInsightsInput = z.infer<typeof GenerateInsightsInputSchema>;

const GenerateInsightsOutputSchema = z.object({
  diseaseTrendSummary: z.string().describe('A concise summary of predicted disease trends and R_t evolution.'),
  mobilityImpactAnalysis: z.string().optional().describe('Analysis of how mobility trends (R_t sensitivity) have impacted growth.'),
  vaccinationImpactAnalysis: z.string().optional().describe('Analysis of how vaccination has dampened the transmission rate beta.'),
  anomalyDetection: z.string().describe('Description of any detected hotspots or unusual patterns in the R_t vector.'),
  overallRecommendations: z.string().describe('Actionable public health recommendations based on EPOF predictive model.'),
  dataScienceStats: z.string().describe('Technical data science metrics (MSE, R2, Vector correlations) for the analysis.'),
});
export type GenerateInsightsOutput = z.infer<typeof GenerateInsightsOutputSchema>;

export async function generateAIPoweredInsights(input: GenerateInsightsInput): Promise<GenerateInsightsOutput> {
  return aiPoweredInsightsGenerationFlow(input);
}

const insightsPrompt = ai.definePrompt({
  name: 'generateInsightsPrompt',
  input: { schema: GenerateInsightsInputSchema },
  output: { schema: GenerateInsightsOutputSchema },
  prompt: `You are an expert Data Science AI agent for the EPOF (Epidemic Outbreak Forecaster) project. Your task is to perform technical analysis for the region of {{{region}}}.\

### Epidemiological Matrix (Last 30 days):
{{#each historicalCases}}
- Date: {{{date}}}, Cases: {{{cases}}}, R_t: {{{rtValue}}}
{{/each}}

### Forecast Tensors (Next 30 days):
{{#each predictedCases}}
- Date: {{{date}}}, Predicted Cases: {{{cases}}}, Predicted R_t: {{{rtValue}}}
{{/each}}

{{#if vaccinationData}}
### Vaccination Vector Array:
{{#each vaccinationData}}
- Date: {{{date}}}, Coverage: {{{vaccinationRate}}}%
{{/each}}
{{/if}}

{{#if mobilityData}}
### Mobility Sensitivity Index:
{{#each mobilityData}}
- Date: {{{date}}}, Flow Index: {{{mobilityIndex}}}
{{/each}}
{{/if}}

Based on this technical input for {{{region}}}, generate insights with a focus on data science reliability:

1.  **diseaseTrendSummary**: Focus on exponential growth vs. logarithmic decay using the R_t vector.
2.  **mobilityImpactAnalysis**: Calculate the Pearson correlation between mobility and case growth.
3.  **vaccinationImpactAnalysis**: Explain the dampening effect on the transmission coefficient (Beta).
4.  **anomalyDetection**: Identify statistical outliers (Z-score > 2) in the historical data.
5.  **overallRecommendations**: Technical directives for public health resource optimization.
6.  **dataScienceStats**: Provide simulated metrics like RMSE (Root Mean Square Error) and R-Squared for the current projection model.

Maintain a technical, data-centric, and authoritative tone.
`,
});

const aiPoweredInsightsGenerationFlow = ai.defineFlow(
  {
    name: 'aiPoweredInsightsGenerationFlow',
    inputSchema: GenerateInsightsInputSchema,
    outputSchema: GenerateInsightsOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await insightsPrompt(input);
      if (!output) throw new Error('No insights generated');
      return output;
    } catch (e: any) {
      console.error('Genkit Error in Insights Generation:', e);
      throw e;
    }
  }
);
