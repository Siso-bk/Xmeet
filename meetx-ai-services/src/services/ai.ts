export async function generateSuggestion(type: 'bio' | 'message' | 'summary', input: string): Promise<string> {
  if (type === 'bio') {
    return `Suggested bio: ${input.slice(0, 140)}`
  }
  if (type === 'message') {
    return `Suggested message: ${input.slice(0, 140)}`
  }
  return `Summary: ${input.slice(0, 200)}`
}
