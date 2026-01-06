import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, filter, map, of, startWith, switchMap } from 'rxjs';
import { ChannelMessage, FirestoreService, ThreadDocument, ThreadReply as FirestoreThreadReply } from './firestore.service';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import type { User } from '@angular/fire/auth';

export interface ThreadMessage {
  id: string;
  authorId: string;
  authorName?: string;
  avatarUrl?: string;
  timestamp: string;
  text: string;
  isOwn?: boolean;
}

export interface ThreadContext {
  channelId: string;
  channelTitle: string;
  root: ThreadMessage;
  replies: ThreadMessage[];
}

export interface ThreadSource {
  id?: string;
  channelId: string;
  channelTitle: string;
  authorId: string;
  time: string;
  text: string;
  isOwn?: boolean;
}

@Injectable({ providedIn: 'root' })
export class ThreadService {
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly firestoreService = inject(FirestoreService);
  private readonly authUser$ = this.authService.authState$.pipe(
    startWith(this.authService.auth.currentUser),
    filter((user): user is User => !!user)
  );
  private readonly threadSubject = new BehaviorSubject<ThreadContext | null>(null);
  readonly thread$ = this.threadSubject.pipe(
    switchMap((context) => {
      if (!context?.channelId || !context.root.id) return of(null);

      return combineLatest([
        this.firestoreService.getThread(context.channelId, context.root.id),
        this.firestoreService.getThreadReplies(context.channelId, context.root.id),
        this.userService.getAllUsers(),
        this.firestoreService.getChannel(context.channelId),
        this.firestoreService.getChannelMessage(context.channelId, context.root.id),
        this.authUser$,
      ]).pipe(
        map(([storedThread, replies, users, channel, rootMessage, authUser]) => {
          const userMap = new Map(users.map((u) => [u.uid, u]));

          const mapUser = (authorId: string) => {
            const user = userMap.get(authorId);
            return {
              authorName: user?.name ?? 'Gelöschter Nutzer',
              avatarUrl: user?.photoUrl,
            };
          };

          const root = this.toRootMessage(context, storedThread, rootMessage);

          const isOwn = root.authorId === authUser.uid;

          return {
            channelId: context.channelId,
            channelTitle: channel?.title ?? context.channelTitle,
            root: {
              ...root,
              isOwn,
              ...mapUser(root.authorId),
            },
            replies: replies.map((r) => {
              const message = this.toThreadMessage(r);
              return {
                ...message,
                isOwn: r.authorId === authUser.uid,
                ...mapUser(r.authorId),
              };
            }),
          };
        })
      );
    })
  );

  openThread(source: ThreadSource): void {
    const id = source.id ?? this.generateId();
    this.setThreadContext(source.channelId, source.channelTitle, {
      id,
      authorId: source.authorId,
      timestamp: source.time,
      text: source.text,
      isOwn: source.isOwn ?? false,
    });

    void this.firestoreService.saveThread(source.channelId, id, {
      authorId: source.authorId,
      text: source.text,
    });
  }

  loadThread(channelId: string, messageId: string): void {
    const current = this.threadSubject.value;
    if (current && current.channelId === channelId && current.root.id === messageId) return;
    if (!channelId || !messageId) {
      this.reset();
      return;
    }

    this.setThreadContext(channelId, current?.channelId === channelId ? current.channelTitle : '', { id: messageId });
  }

  private setThreadContext(
    channelId: string,
    channelTitle: string,
    root: Partial<ThreadMessage> & { id: string }
  ): void {
    this.threadSubject.next({
      channelId,
      channelTitle,
      root: {
        id: root.id,
        authorId: root.authorId ?? '',
        timestamp: root.timestamp ?? '',
        text: root.text ?? '',
        isOwn: root.isOwn ?? false,
      },
      replies: [],
    });
  }

  async addReply(text: string): Promise<void> {
    const current = this.threadSubject.value;
    const user = this.userService.currentUser();
    if (!current || !user) return;

    await this.firestoreService.addThreadReply(current.channelId, current.root.id, {
      authorId: user.uid,
      text,
    });
  }

  reset(): void {
    this.threadSubject.next(null);
  }
  async updateRootMessage(text: string): Promise<void> {
    const current = this.threadSubject.value;
    if (!current?.channelId || !current.root.id) return;

    await Promise.all([
      this.firestoreService.updateChannelMessage(current.channelId, current.root.id, { text }),
      this.firestoreService.updateThreadMeta(current.channelId, current.root.id, { text }),
    ]);

    this.threadSubject.next({
      ...current,
      root: {
        ...current.root,
        text,
      },
    });
  }

  async updateReply(replyId: string, text: string): Promise<void> {
    const current = this.threadSubject.value;
    if (!current?.channelId || !current.root.id || !replyId) return;

    await this.firestoreService.updateThreadReply(current.channelId, current.root.id, replyId, {
      text,
    });
  }

  private toRootMessage(
    context: ThreadContext,
    storedThread: ThreadDocument | null,
    channelMessage: ChannelMessage | null
  ): ThreadMessage {
    const authorId = channelMessage?.authorId ?? storedThread?.authorId ?? context.root.authorId;
    const text = channelMessage?.text ?? storedThread?.text ?? context.root.text;
    const timestampSource = channelMessage?.createdAt ? channelMessage : null;
    const createdAt = this.resolveTimestamp(timestampSource ?? null);
    const hasServerTimestamp = !!timestampSource?.createdAt;

    return {
      id: context.root.id,
      authorId,
      timestamp: hasServerTimestamp ? this.formatTime(createdAt) : context.root.timestamp,
      text,
      isOwn: context.root.isOwn,
    };
  }

  private toThreadMessage(reply: FirestoreThreadReply): ThreadMessage {
    const createdAt = this.resolveTimestamp(reply);
    return {
      id: reply.id ?? this.generateId(),
      authorId: reply.authorId,
      timestamp: this.formatTime(createdAt),
      text: reply.text ?? '',
    };
  }

  private resolveTimestamp(message: FirestoreThreadReply | ThreadDocument | ChannelMessage | null): Date {
    if (message?.createdAt instanceof Date) {
      return message.createdAt;
    }
    if (message?.createdAt && 'toDate' in message.createdAt) {
      return (message.createdAt as unknown as { toDate: () => Date }).toDate();
    }

    return new Date();
  }

  private formatTime(date: Date): string {
    const formatter = new Intl.DateTimeFormat('de-DE', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return formatter.format(date);
  }

  private generateId(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
}
