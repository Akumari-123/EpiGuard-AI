'use server';
/**
 * @fileOverview A specialized Genkit flow for disaster response and emergency assistance.
 * Provides actionable safety protocols and crisis management guidance.
 * Updated: Friendly Hinglish Health Assistant persona.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const DisasterAssistantInputSchema = z.object({
  query: z.string().describe('The user\'s specific question or emergency situation.'),
  context: z.object({
    region: z.string().optional(),
    currentDisease: z.string().optional(),
    userSituation: z.string().optional().describe('Details about the user\'s immediate environment or health status.'),
  }).optional(),
});
export type DisasterAssistantInput = z.infer<typeof DisasterAssistantInputSchema>;

const DisasterAssistantOutputSchema = z.object({
  message: z.string().describe('The primary response or guidance text in friendly Hinglish.'),
  priority: z.enum(['CRITICAL', 'HIGH', 'MODERATE', 'INFO']).describe('The urgency level of the guidance.'),
  actionSteps: z.array(z.string()).describe('Immediate physical or medical steps the user should take.'),
  resources: z.array(z.object({
    name: z.string(),
    url: z.string().optional(),
    description: z.string(),
  })).describe('Relevant authorities or medical resources.'),
});
export type DisasterAssistantOutput = z.infer<typeof DisasterAssistantOutputSchema>;

const disasterPrompt = ai.definePrompt({
  name: 'disasterAssistantPrompt',
  input: { schema: DisasterAssistantInputSchema },
  output: { schema: DisasterAssistantOutputSchema },
  prompt: `You are a smart, friendly, and responsible AI Health Assistant for the EpiGuard system.

### ROLE:
Your role is to help users with health-related questions such as COVID-19, symptoms, precautions, and basic care. 

### LANGUAGE & TONE:
- Speak in conversational Hinglish (a mix of Hindi and English).
- Tone must be friendly, calm, and reassuring.
- Keep answers suitable for voice output (natural speaking style).
- Example: "Agar aapko fever ya cough ho raha hai, toh please rest karein, hydration maintain karein..."

### GUIDELINES:
1. Always give clear, simple, and safe advice.
2. If the user asks about symptoms (like fever, cough, breathing issues), suggest basic precautions.
3. If the situation seems serious (breathing difficulty, very high fever), strictly advise contacting a doctor or local emergency services (911, 102, 112).
4. Never give harmful or risky medical advice.
5. Keep answers short, helpful, and easy to understand.
6. Determine priority: CRITICAL for life-threats, HIGH for serious symptoms, MODERATE for general care, INFO for basic info.

### USER CONTEXT:
- Query: {{{query}}}
- Region: {{{context.region}}}
- Current Pathogen: {{{context.currentDisease}}}

### OUTPUT:
- message: Your main response in friendly Hinglish.
- actionSteps: Numbered list of simple, executable steps (e.g., "Garam pani piyein", "Mask pehnein").
- resources: List 1-2 helpful organizations (WHO, CDC, local hospital).

Hamesha reassurance aur sahi guidance ke saath end karein.`,
});

export async function disasterAssistantResponse(input: DisasterAssistantInput): Promise<DisasterAssistantOutput> {
  const { output } = await disasterPrompt(input);
  if (!output) throw new Error('Failed to generate health guidance.');
  return output;
}

export const disasterAssistantFlow = ai.defineFlow(
  {
    name: 'disasterAssistantFlow',
    inputSchema: DisasterAssistantInputSchema,
    outputSchema: DisasterAssistantOutputSchema,
  },
  async (input) => {
    return disasterAssistantResponse(input);
  }
);
