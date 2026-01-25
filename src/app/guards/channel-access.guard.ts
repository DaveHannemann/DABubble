import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router } from "@angular/router";
import { UserService } from "../services/user.service";
import { ChannelMembershipService } from "../services/membership.service";
import { filter, map, Observable, of, switchMap, take, tap } from "rxjs";

@Injectable({ providedIn: 'root' })
export class ChannelAccessGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private membershipService: ChannelMembershipService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const channelId = route.paramMap.get('channelId');
    if (!channelId) {
      this.router.navigate(['/main']);
      return of(false);
    }

    return this.userService.currentUser$.pipe(
      filter(Boolean),
      switchMap(user =>
        this.membershipService.getChannelsForUser(user!.uid)
      ),
      map(channels => channels.some(c => c.id === channelId)),
      tap(hasAccess => {
        if (!hasAccess) {
          this.router.navigate(['/main']);
        }
      }),
      take(1)
    );
  }
}