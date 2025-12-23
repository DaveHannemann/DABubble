import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { OverlayService } from '../../services/overlay.service';
import { NavbarDialog } from './navbar-dialog/navbar-dialog';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { FilterBox } from '../filter-box/filter-box';
import { FormsModule } from '@angular/forms';
import { ClickOutsideDirective } from '../../classes/click-outside.class';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    CommonModule,
    FilterBox,
    FormsModule,
    ClickOutsideDirective,
  ],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss'],
})
export class Navbar {
  private overlayService = inject(OverlayService);
  private userService = inject(UserService);

  @ViewChild('menuBtn', { read: ElementRef })
  menuBtn!: ElementRef<HTMLElement>;

  dropdownOpen = false;
  searchTerm: string = '';

  currentUser = this.userService.currentUser;

  onSearchInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm = value;

    this.dropdownOpen = value.trim().length >= 1;
  }

  onFocus() {}

  openUserMenu() {
    const target = this.menuBtn.nativeElement;

    this.overlayService.open(NavbarDialog, {
      target,
      offsetX: -225,
      offsetY: 40,
      data: { originTarget: target },
    });
  }

  closeDropdown() {
    this.searchTerm = '';
    this.dropdownOpen = false;
  }
}
