import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import ShopLogin from '@/components/ShopLogin'
import ShopMain from '@/components/ShopMain'
// edit
import ShopInfo from '@/components/edit/ShopInfo'
// nav1
import User from '@/components/nav1/User'
import ShopIndex from '@/components/nav1/ShopIndex'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/',
      name: 'shoplogin',
      component: ShopLogin
    },
    {
      path: '/hello',
      name: 'hello',
      component: HelloWorld
    },
    {
      path: '/shopinfo',
      name:'shopinfo',
      component: ShopInfo,
      meta: {
        requrireAuth: true
      },
    },
    {
      path: '/shopmain',
      name: 'shopmain',
      component: ShopMain,
      meta: {
        requrireAuth: true
      },
      children:[
        // nav1
        {
          path: 'shopindex',
          name: 'shopindex',
          component: ShopIndex,
          meta: {
            requrireAuth: true,
            title: "首页"
          }
        },
        {
          path: 'user',
          name: 'user',
          component: User,
          meta: {
            requrireAuth: true,
            title: "信息设置"
          }
        },
      ]
    },
  ]
})

router.beforeEach((to, from ,next) => {
  if(to.path == '/'){
    next();
  }else if(to.meta.requrireAuth){
    let user = sessionStorage.getItem("ShopId");
    if(user){
      next();
    }else{
      next({
        path:'/'
      });
    }
  }else{
    next();
  }
})

export default router;
