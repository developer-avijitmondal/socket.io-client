import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from '../app/auth/auth.guard';
import { AboutComponent } from './about/about.component';
import { ChatComponent } from './chat/chat.component';
import { ChattwoComponent } from './chattwo/chattwo.component';
import { ChatagainComponent } from './chatagain/chatagain.component';
import { UsertouserchatComponent } from './usertouserchat/usertouserchat.component';
import { RoommessageComponent } from './roommessage/roommessage.component';
import { VideochatComponent } from './videochat/videochat.component';


const routes: Routes = [
  { path:'home', redirectTo:'',pathMatch:'full' },
  { path:'',component: HomeComponent },
  { path:'login',component: LoginComponent },
  { path:'register',component: RegisterComponent },
  { path:'logout',component: LogoutComponent },
  { path:'about',component: AboutComponent },
  { path:'chat',component: ChatComponent },
  { path:'chat-two',component: ChattwoComponent },
  { path:'chat-again',component: ChatagainComponent },
  { path:'user-to-user',component: UsertouserchatComponent },
  { path:'message',component: RoommessageComponent },
  { path:'video-call',component: VideochatComponent },

  { path:'dashboard',component: DashboardComponent,canActivate:[AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
