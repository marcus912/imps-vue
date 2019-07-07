import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/components/Login'
import MuserSet from '@/components/MuserSet'
import IMPS03001 from '@/components/IMPS03001'
import IMPS03002 from '@/components/IMPS03002'
import IMPS03003 from '@/components/IMPS03003'
import IMPS03003_1 from '@/components/IMPS03003_1'
import IMPS03003_2 from '@/components/IMPS03003_2'
import IMPS03004 from '@/components/IMPS03004'
import IMPS03005 from '@/components/IMPS03005'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/MuserSet',
      name: 'MuserSet',
      component: MuserSet
    },
    {
      path: '/IMPS03001',
      name: 'IMPS03001',
      component: IMPS03001
    },
    {
      path: '/IMPS03002',
      name: 'IMPS03002',
      component: IMPS03002
    },
    {
      path: '/IMPS03003',
      name: 'IMPS03003',
      component: IMPS03003
    },
    {
      path: '/IMPS03003_1',
      name: 'IMPS03003_1',
      component: IMPS03003_1
    },
    {
      path: '/IMPS03003_2',
      name: 'IMPS03003_2',
      component: IMPS03003_2
    },
    {
      path: '/IMPS03004',
      name: 'IMPS03004',
      component: IMPS03004
    },
    {
      path: '/IMPS03005',
      name: 'IMPS03005',
      component: IMPS03005
    }
  ]
})
