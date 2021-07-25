import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'onboarding',
    pathMatch: 'full'
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'details',
    loadChildren: () => import('./details/details.module').then( m => m.DetailsPageModule)
  },
  {
    path: 'bursaries',
    loadChildren: () => import('./bursaries/bursaries.module').then( m => m.BursariesPageModule)
  },
  // {
  //   path: 'tab4',
  //   loadChildren: () => import('./tab4/tab4.module').then( m => m.Tab4PageModule)
  // },
  // {
  //   path: '',
  //   loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  // },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'registration',
    loadChildren: () => import('./registration/registration.module').then( m => m.RegistrationPageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule)
  },
  // {
  //   path: '',
  //   loadChildren: () => import('./sign-in/sign-in.module').then( m => m.SignInPageModule)
  // },
  {
    path: 'institutions',
    loadChildren: () => import('./institutions/institutions.module').then( m => m.InstitutionsPageModule)
  },
  {
    path: 'ap-score',
    loadChildren: () => import('./ap-score/ap-score.module').then( m => m.ApScorePageModule)
  },
  {
    path: 'welcome',
    loadChildren: () => import('./welcome/welcome.module').then( m => m.WelcomePageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: '',
    loadChildren: () => import('./onboarding/onboarding.module').then( m => m.OnboardingPageModule)
  },  {
    path: 'opportunity-details',
    loadChildren: () => import('./opportunity-details/opportunity-details.module').then( m => m.OpportunityDetailsPageModule)
  },
  {
    path: 'all-opportunities',
    loadChildren: () => import('./all-opportunities/all-opportunities.module').then( m => m.AllOpportunitiesPageModule)
  },
  {
    path: 'all-bursarues',
    loadChildren: () => import('./all-bursarues/all-bursarues.module').then( m => m.AllBursaruesPageModule)
  },








 

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
