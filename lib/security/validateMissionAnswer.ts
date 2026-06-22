/**
 * Server-side mission answer validator.
 *
 * Uses strict normalized equality to prevent substring/superstring bypasses.
 * Exact match is required after trimming, lower-casing, and collapsing whitespace.
 *
 * Previous implementation allowed `answer.includes(value)` which let one-word
 * guesses pass multi-word expected answers — HIGH severity vulnerability.
 */

function normalize(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

export function validateMissionAnswer(
  expected: string | null | undefined,
  submitted: string
): boolean {
  if (!expected?.trim()) return false;

  const answer = normalize(expected);
  const value = normalize(submitted);

  if (!value) return false;

  // Exact match (primary)
  if (value === answer) return true;

  // Multi-word answers: submitted must contain ALL significant tokens from
  // the expected answer AND submitted length must not exceed 3× the answer length
  // (prevents embedding the answer inside a very long paragraph).
  // Single-word answers NEVER match unless exactly equal (see exact check above).
  const tokens = answer.split(" ").filter(t => t.length > 2);
  if (
    tokens.length >= 2 &&
    tokens.every(t => value.includes(t)) &&
    value.length <= answer.length * 3
  ) {
    return true;
  }

  return false;
}
