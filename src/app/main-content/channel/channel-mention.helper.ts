import type { ChannelMemberView } from '../../types';
import type { MentionSegment } from './channel.types';

/**
 * Escapes special regex characters in a string.
 * @param value The string to escape
 * @returns Escaped string safe for regex
 */
export function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Builds a regex pattern to match mentions from cached members.
 * @param cachedMembers Array of channel members
 * @returns RegExp for matching mentions or null if no members
 */
export function buildMentionRegex(cachedMembers: ChannelMemberView[]): RegExp | null {
  if (!cachedMembers.length) return null;

  const names = cachedMembers
    .map((member) => member.name)
    .filter(Boolean)
    .sort((a, b) => b.length - a.length)
    .map((name) => escapeRegex(name));

  if (!names.length) return null;
  return new RegExp(`@(${names.join('|')})`, 'gi');
}

function buildChannelRegex(channels: { name: string }[]): RegExp | null {
  if (!channels.length) return null;

  const names = channels
    .map((c) => c.name)
    .filter(Boolean)
    .sort((a, b) => b.length - a.length)
    .map(escapeRegex);

  if (!names.length) return null;
  return new RegExp(`#(${names.join('|')})`, 'gi');
}

/**
 * Parses message text into segments, identifying mentions.
 * @param text The message text
 * @param cachedMembers Array of channel members
 * @returns Array of text segments with potential mention data
 */
export function buildMessageSegments(
  text: string,
  members: ChannelMemberView[],
  channels: { id: string; name: string }[] = []
): MentionSegment[] {
  if (!text) return [{ kind: 'text', text: '' }];

  const userRegex = buildMentionRegex(members);
  const channelRegex = buildChannelRegex(channels);

  if (!userRegex && !channelRegex) {
    return [{ kind: 'text', text }];
  }

  const parts: MentionSegment[] = [];
  let index = 0;

  const combined = new RegExp(`${userRegex?.source ?? ''}|${channelRegex?.source ?? ''}`, 'gi');

  let match: RegExpExecArray | null;

  while ((match = combined.exec(text)) !== null) {
    if (match.index > index) {
      parts.push({ kind: 'text', text: text.slice(index, match.index) });
    }

    const value = match[0];

    if (value.startsWith('@')) {
      const name = value.slice(1);
      const member = members.find((m) => m.name.toLowerCase() === name.toLowerCase());

      parts.push(member ? { kind: 'member', text: value, member } : { kind: 'text', text: value });
    }

    if (value.startsWith('#')) {
      const name = value.slice(1);
      const channel = channels.find((c) => c.name.toLowerCase() === name.toLowerCase());
      parts.push(channel ? { kind: 'channel', text: value, channel } : { kind: 'text', text: value });
    }

    index = combined.lastIndex;
  }

  if (index < text.length) {
    parts.push({ kind: 'text', text: text.slice(index) });
  }

  return parts.length ? parts : [{ kind: 'text', text }];
}

/**
 * Extracts mentioned members from message text.
 * @param text The message text
 * @param cachedMembers Array of channel members
 * @returns Array of mentioned members
 */
export function getMentionedMembers(text: string, cachedMembers: ChannelMemberView[]): ChannelMemberView[] {
  const regex = buildMentionRegex(cachedMembers);
  if (!regex) return [];

  const found = new Map<string, ChannelMemberView>();
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    const mentionName = match[1] ?? '';
    const member = cachedMembers.find((entry) => entry.name.toLowerCase() === mentionName.toLowerCase());
    if (member) {
      found.set(member.id, member);
    }
  }

  return Array.from(found.values());
}

/**
 * Updates mention suggestions based on text input and caret position.
 * @param messageText Current message text
 * @param caretIndex Current caret position
 * @param cachedMembers Array of channel members
 * @returns Updated mention state
 */
export function updateTagSuggestions<T extends { name: string }>(
  messageText: string,
  caretIndex: number | null,
  trigger: '@' | '#',
  items: T[]
): { suggestions: T[]; isVisible: boolean; triggerIndex: number | null } {
  const caret = caretIndex ?? messageText.length;
  const textUpToCaret = messageText.slice(0, caret);
  const triggerIndex = textUpToCaret.lastIndexOf(trigger);

  if (triggerIndex === -1) {
    return { suggestions: [], isVisible: false, triggerIndex: null };
  }

  if (triggerIndex > 0 && !/\s/.test(textUpToCaret[triggerIndex - 1])) {
    return { suggestions: [], isVisible: false, triggerIndex: null };
  }

  const query = textUpToCaret.slice(triggerIndex + 1);
  if (/\s/.test(query)) {
    return { suggestions: [], isVisible: false, triggerIndex: null };
  }

  const q = query.toLowerCase();
  const suggestions = items.filter((i) => i.name.toLowerCase().includes(q));

  return {
    suggestions,
    isVisible: suggestions.length > 0,
    triggerIndex,
  };
}
