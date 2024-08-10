export const nativeReactions = ['love', 'like', 'fire', 'laugh'] as const;
export type NativeReaction = (typeof nativeReactions)[number];