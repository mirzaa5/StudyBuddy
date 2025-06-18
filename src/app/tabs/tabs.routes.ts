import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'chat',
        loadComponent: () =>
          import('../chat/chat.page').then((m) => m.ChatPage),
      },
      {
        path: 'summarize',
        loadComponent: () =>
          import('../summarize/summarize.page').then((m) => m.SummarizePage),
      },
      {
        path: 'quiz',
        loadComponent: () =>
          import('../quiz/quiz.page').then((m) => m.QuizPage),
      },
      {
        path: '',
        redirectTo: '/tabs/chat',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/chat',
    pathMatch: 'full',
  },
];
