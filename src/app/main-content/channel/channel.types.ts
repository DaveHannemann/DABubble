import type { ChannelMemberView } from '../../types';

/**
 * Represents a text segment that may contain a user mention.
 */
export type MentionSegment =
  | { kind: 'text'; text: string }
  | { kind: 'member'; text: string; member: ChannelMemberView }
  | { kind: 'channel'; text: string; channel: { id: string; name: string } };

/**
 * State for tracking user mention suggestions.
 */
export interface MentionState {
  suggestions: ChannelMemberView[];
  isVisible: boolean;
  triggerIndex: number | null;
  caretIndex: number | null;
  type?: MentionType;
}

export type MentionType = 'user' | 'channel';