import { DEFAULT_WHATSAPP_MESSAGE } from '@/lib/whatsapp';

export const interestedProgramOptions = [
  "Bachelor's",
  "Master's Engineering",
  "Master's Business",
  'Ausbildung',
] as const;

export const currentEducationOptions = ['12th Grade', 'Graduate', 'Post-Graduate'] as const;

export type InterestedProgram = (typeof interestedProgramOptions)[number];
export type CurrentEducation = (typeof currentEducationOptions)[number];

type ProfileEvaluationLeadInput = {
  interestedProgram: InterestedProgram;
  currentEducation: CurrentEducation;
};

type ProfileEvaluationWhatsappInput = ProfileEvaluationLeadInput & {
  name?: string;
  phone?: string;
  email?: string;
};

export function buildProfileEvaluationLeadMessage(input: ProfileEvaluationLeadInput): string {
  return [
    'Requested a free profile evaluation.',
    `Interested Program: ${input.interestedProgram}`,
    `Current Education: ${input.currentEducation}`,
  ].join('\n');
}

export function buildProfileEvaluationWhatsappMessage(input?: ProfileEvaluationWhatsappInput): string {
  const lines = [DEFAULT_WHATSAPP_MESSAGE];

  if (!input) {
    return lines.join('\n');
  }

  lines.push('');

  if (input.name) {
    lines.push(`Full Name: ${input.name}`);
  }

  if (input.phone) {
    lines.push(`WhatsApp Number: ${input.phone}`);
  }

  if (input.email) {
    lines.push(`Email Address: ${input.email}`);
  }

  lines.push(`Interested Program: ${input.interestedProgram}`);
  lines.push(`Current Education: ${input.currentEducation}`);

  return lines.join('\n');
}
