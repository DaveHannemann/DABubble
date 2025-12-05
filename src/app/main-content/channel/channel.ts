import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

type ChannelDay = {
  label: string;
  messages: ChannelMessage[];
};

type ChannelMessage = {
  author: string;
  avatar: string;
  time: string;
  text: string;
  replies?: number;
  tag?: string;
  attachment?: ChannelAttachment;
};

type ChannelAttachment = {
  title: string;
  description?: string;
  linkLabel?: string;
  linkHref?: string;
  badgeLabel?: string;
};

@Component({
  selector: 'app-channel',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './channel.html',
  styleUrl: './channel.scss',
})
export class ChannelComponent {
  protected readonly channelName = 'Entwicklerteam';
  protected readonly channelCategory = 'Allgemeines';
  protected readonly channelSummary =
    'Gruppe zum Austausch über technische Fragen und das laufende Redesign des Devspace.';
  protected readonly channelStats = '15 Mitglieder, 5 online';

  protected readonly memberAvatars = [
    'imgs/users/Property 1=Frederik Beck.svg',
    'imgs/users/Property 1=Noah Braun.svg',
    'imgs/users/Property 1=Sofia Müller.svg',
    'imgs/users/Property 1=Elias Neumann.svg',
  ];

  protected readonly messagesByDay: ChannelDay[] = [
    {
      label: 'Dienstag, 14. Januar',
      messages: [
        {
          author: 'Noah Braun',
          avatar: 'imgs/users/Property 1=Noah Braun.svg',
          time: '14:55 Uhr',
          text: 'Welche Version ist aktuell von Angular?',
          replies: 2,
        },
        {
          author: 'Frederik Beck',
          avatar: 'imgs/users/Property 1=Frederik Beck.svg',
          time: '14:59 Uhr',
          text: '@Noah Braun Die aktuellste Version findest du hier: https://angular.io/guide/what-is-angular',
        },
      ],
    },
    {
      label: 'Heute',
      messages: [
        {
          author: 'Frederik Beck',
          avatar: 'imgs/users/Property 1=Frederik Beck.svg',
          time: '08:45 Uhr',
          text:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque blandit odio fermentum ' +
            'lectus vestibulum, quis accumsan ante vulputate. Quisque tristique nisi id lacus luctus ' +
            'iaculis ac.',
          tag: 'Geplant',
          replies: 4,
        },
        {
          author: 'Frederik Beck',
          avatar: 'imgs/users/Property 1=Frederik Beck.svg',
          time: '08:45 Uhr',
          text:
            'Denke daran, den Rerendering zu beschleunigen. Wir brauchen das Update, wir arbeiten hier immer noch mit dem alten. Mit dem alten ist es super langsam und teilweise schwer zu bedienen.',
          attachment: {
            title: 'Design Update',
            description:
              'Kleiner Tipp: Der Menüpunkt “Channels“ müsste weiter oben sein, der ist sonst etwas versteckt.',
            linkLabel: 'Figma ansehen',
            linkHref: '#',
            badgeLabel: 'Info',
          },
          replies: 4,
        },
        {
          author: 'Sofie Klein',
          avatar: 'imgs/users/Property 1=Sofia Müller.svg',
          time: '08:45 Uhr',
          text: 'Habe alle Videotutorials in ein Unlisted YouTube-Video gepackt.',
          attachment: {
            title: 'DABubble Vorstellungsvideo',
            linkLabel: 'Youtube Link',
            linkHref: '#',
          },
          tag: 'Neue Info',
          replies: 2,
        },
      ],
    },
  ];
}