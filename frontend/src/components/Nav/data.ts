import { Tab } from './type';

const homeTabs: Tab[] = [
  {
    label: 'Home',
    path: '/'
  },
  {
    label: 'Sign-up',
    path: '/sign-up'
  },
  {
    label: 'Log in',
    path: '/login'
  },
];

const studentTabs: Tab[] = [
  {
    label: 'Home',
    path: '/'
  },
  {
    label: 'Sign-out',
    path: '/sign-out'
  },
];

export {
  homeTabs,
  studentTabs
};
