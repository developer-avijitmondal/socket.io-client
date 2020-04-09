import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthInterceptor } from '../app/auth/auth.interceptor';
import { AuthGuard } from '../app/auth/auth.guard';
import { UserService } from '../app/services/user.service';
import { FlashMessagesModule } from 'angular2-flash-messages';
// import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { SocketioService } from '../app/services/socketio.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NavbarComponent } from './navbar/navbar.component';
import { RegisterComponent } from './register/register.component';
import { AboutComponent } from './about/about.component';
import { DocumentListComponent } from './document-list/document-list.component';
import { DocumentComponent } from './document/document.component';
import { ChatComponent } from './chat/chat.component';
import { ChattwoComponent } from './chattwo/chattwo.component';
import { ChatagainComponent } from './chatagain/chatagain.component';
import { UsertouserchatComponent } from './usertouserchat/usertouserchat.component';
import { RoommessageComponent } from './roommessage/roommessage.component';

// const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    LogoutComponent,
    DashboardComponent,
    NavbarComponent,
    RegisterComponent,
    AboutComponent,
    DocumentListComponent,
    DocumentComponent,
    ChatComponent,
    ChattwoComponent,
    ChatagainComponent,
    UsertouserchatComponent,
    RoommessageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FlashMessagesModule.forRoot(),
    BrowserAnimationsModule,
    MatBadgeModule,MatButtonModule,MatIconModule,MatToolbarModule,

    // SocketIoModule.forRoot(config)
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    AuthGuard,
    UserService,
    SocketioService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
