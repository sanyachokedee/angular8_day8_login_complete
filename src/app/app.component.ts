import { Component, ViewChild  } from '@angular/core'
import { NavigationEnd, Router, RouterOutlet } from '@angular/router'
import { MatCardModule } from '@angular/material/card'
import { MatIconModule } from '@angular/material/icon'
import { MenuComponent } from "./components/menu/menu.component";
import { HeaderComponent } from "./components/header/header.component"
import { MatSidenavModule } from '@angular/material/sidenav'
import { NgStyle } from '@angular/common'
import { Title } from '@angular/platform-browser'

// Import AuthService
import { AuthService } from './services/auth.service'

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [
      NgStyle,
      RouterOutlet, 
      MatCardModule, 
      MatIconModule, 
      MenuComponent, 
      HeaderComponent,
      MatSidenavModule
    ]
})
export class AppComponent {
  title = 'angular-stock'

  isExpanded = true
  isLoggedIn = false   // true ถ้าเราต้องการให้แสดง หน้า dashboard

  @ViewChild('sidenav', { static: true }) sidenav: any

  constructor(
    private router: Router,
    private titleService: Title,
    private auth : AuthService
  ) {
    // Check if the user is logged in
    // this.isLoggedIn = localStorage.getItem('LoggedInToken') ? true : false
    this.isLoggedIn = this.auth.isLoggedIn() ? true : false
  }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const url = event.url
        this.updatePageTitle(url)
      }
    })
  }

  private updatePageTitle(url: string) {
    const routeObj = this.router.config.find((route) => ("/" + route.path) === url)
    let routeData = routeObj?.data
    if (routeData && routeData['title']) {
      this.titleService.setTitle(routeData['title'] + ' - Stock Management')
    } else {
      this.titleService.setTitle('Stock Management')
    }
  }

  toggleSideBar() {
    this.sidenav.toggle();
  }
}