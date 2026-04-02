
'use server';
/**
 * @fileOverview Advanced AI Healthcare Assistant for Epidemiology and Disease Prediction.
 * Provides structured scientific insights into outbreaks and public health risks.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const HealthcareAssistantInputSchema = z.object({
  query: z.string().describe('The user\'s health-related question or symptom description.'),
  context: z.object({
    region: z.string().optional(),
    environment: z.string().optional(),
    userSymptoms: z.string().optional(),
  }).optional(),
});
export type HealthcareAssistantInput = z.infer<typeof HealthcareAssistantInputSchema>;

const HealthcareAssistantOutputSchema = z.object({
  diseaseName: z.string().describe('The name of the suspected or discussed disease.'),
  overview: z.string().describe('Brief overview of the condition.'),
  causes: z.string().describe('Primary causes or triggers.'),
  symptoms: z.array(z.string()).describe('List of common symptoms.'),
  transmission: z.string().describe('How the disease spreads.'),
  riskFactors: z.array(z.string()).describe('Factors that increase vulnerability.'),
  consequences: z.object({
    shortTerm: z.string(),
    longTerm: z.string(),
  }).describe('Impact on health over time.'),
  prevention: z.array(z.string()).describe('Precautionary measures and hygiene steps.'),
  whenToSeekHelp: z.string().describe('Specific warning signs for medical intervention.'),
  riskLevel: z.enum(['LOW', 'MEDIUM', 'HIGH']).describe('Probability-based risk assessment.'),
  nextStep: z.string().describe('Actionable immediate next step for the user.'),
  disclaimer: z.string().default('This is for informational purposes only. Consult a healthcare professional for medical advice.'),
});
export type HealthcareAssistantOutput = z.infer<typeof HealthcareAssistantOutputSchema>;

const healthcarePrompt = ai.definePrompt({
  name: 'healthcareAssistantPrompt',
  input: { schema: HealthcareAssistantInputSchema },
  output: { schema: HealthcareAssistantOutputSchema },
  prompt: `You are an advanced AI Healthcare Assistant specialized in Epidemiology and Disease Prediction.

### YOUR ROLE:
1. Provide accurate, clear, and structured information about diseases, epidemics, and public health risks.
2. Explain causes, symptoms, transmission methods, prevention strategies, and consequences of diseases.
3. Help users understand epidemic spread patterns in a simplified way, using factors like population density, mobility, climate, and vaccination rates.
4. Suggest precautionary measures and basic care steps (non-prescriptive).
5. Provide risk awareness based on user input (location, symptoms, environment).

### GUIDELINES:
- Always respond in a structured format:
  • Disease Overview
  • Causes
  • Symptoms
  • Transmission
  • Risk Factors
  • Consequences (Short-term + Long-term)
  • Prevention
  • When to Seek Medical Help
- Use simple and easy-to-understand language but maintain scientific accuracy.
- NEVER give strict medical prescriptions or specific medicines.
- Always include a "Risk Level" indicator (LOW / MEDIUM / HIGH) and a "Next Best Action".
- If user provides symptoms, suggest possible diseases (not definitive diagnosis) and give probability-based reasoning.
- Maintain a helpful, calm, and supportive tone.
- If unsure, say: "I am not fully certain, but based on available data..."

### USER CONTEXT:
- Query: {{{query}}}
- Region: {{{context.region}}}
- Environment: {{{context.environment}}}
- Reported Symptoms: {{{context.userSymptoms}}}

### OUTPUT STRUCTURE:
Ensure every field in the output schema is populated thoroughly. Provide a clear Risk Level and a Next Best Action.`,
});

export async function healthcareAssistantResponse(input: HealthcareAssistantInput): Promise<HealthcareAssistantOutput> {
  return healthcareAssistantFlow(input);
}

export const healthcareAssistantFlow = ai.defineFlow(
  {
    name: 'healthcareAssistantFlow',
    inputSchema: HealthcareAssistantInputSchema,
    outputSchema: HealthcareAssistantOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await healthcarePrompt(input);
      if (!output) throw new Error('Failed to generate healthcare guidance.');
      return output;
    } catch (e: any) {
      console.error('Genkit Error in Healthcare Assistant:', e);
      throw e;
    }
  }
);
