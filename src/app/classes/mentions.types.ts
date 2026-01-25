import type { ChannelMemberView } from '../types';

export type MentionType = 'user' | 'channel';

export type UserMentionSuggestion = ChannelMemberView;

export interface ChannelMentionSuggestion {
  id: string;
  name: string;
}

export interface MentionState {
  suggestions: UserMentionSuggestion[] | ChannelMentionSuggestion[];
  isVisible: boolean;
  triggerIndex: number | null;
  caretIndex: number | null;
  type?: MentionType;
}

export type MentionSegment =
  | {
      kind: 'text';
      text: string;
    }
  | {
      kind: 'member';
      text: string;
      member: ChannelMemberView;
    }
  | {
      kind: 'channel';
      text: string;
      channel: ChannelMentionSuggestion;
    };