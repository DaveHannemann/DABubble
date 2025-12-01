import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { collection, collectionData, Firestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs';
import { ChannelDescription } from './channel-description/channel-description';

// typescript channel object deklaration
type Channel = { title?: string; };
@Component({
  selector: 'app-messages',
  imports: [CommonModule, ChannelDescription],
  templateUrl: './messages.html',
  styleUrl: './messages.scss',
})
export class Messages {
  private readonly firestore = inject(Firestore);

  protected readonly channelTitle$: Observable<string> = this.loadChannelTitle();
  protected isChannelDescriptionOpen = false;

  protected openChannelDescription(): void {
    this.isChannelDescriptionOpen = true;
  }

  protected closeChannelDescription(): void {
    this.isChannelDescriptionOpen = false;
  }

  private loadChannelTitle(): Observable<string> {
    const channelsCollection = collection(this.firestore, 'channels');
    // async weil daten sich auf firestore live ändern können
    // Wenn Firestore neue Daten liefert, verändere diese Daten so, wie im map() definiert.
    return collectionData(channelsCollection, { idField: 'id' }).pipe(
      map((channels) => {
        const [firstChannel] = channels as Channel[];
// if no channeltitle , name unbenannter channel
        return firstChannel?.title ?? 'Unbenannter Channel';
      })
    );
  }
}
