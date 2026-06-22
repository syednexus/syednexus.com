export function validateMissionAnswer(
  expected: string | null | undefined,
  submitted: string
): boolean {
  if (!expected?.trim()) return false;

  const answer = expected.trim().toLowerCase();
  const value = submitted.trim().toLowerCase();

  if (!value) return false;
  if (value === answer) return true;

  if (value.includes(answer) || answer.includes(value)) return true;

  return answer.split(/\s+/).every(token => token.length > 2 && value.includes(token));
}
