import { AuthService, LocalizationPipe, CurrentUserDto, ConfigStateService} from '@abp/ng.core';
import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common'; // 1. Import class này

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [LocalizationPipe, AsyncPipe]
})
export class HomeComponent {
  private authService = inject(AuthService);
  private configState = inject(ConfigStateService);
  // Observable chứa thông tin user hiện tại
  currentUser$: Observable<CurrentUserDto>;

  get hasLoggedIn(): boolean {
    return this.authService.isAuthenticated
  }


  ngOnInit() {
    // Lấy thông tin user từ store của ABP
    this.currentUser$ = this.configState.getOne$("currentUser");
  }

  login() {
    this.authService.navigateToLogin();
  }
}
