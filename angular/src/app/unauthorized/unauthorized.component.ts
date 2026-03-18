import { AuthService } from '@abp/ng.core';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.scss']
})
export class UnauthorizedComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  goLogin() {
    this.authService.navigateToLogin();
  }

  goHome() {
    this.router.navigate(['/']);
  }
}
