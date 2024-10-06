import { compact } from "lodash";

/**
 * 基础路由
 * @type { *[] }
 */
export const Layout = () => import("@/layout/push-stream.vue"); 

const constantRouterMap = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component:Layout,
    redirect: { name: 'DashboardIndex' },
    children: [
      {
        path: '/dashboard',
        name: 'DashboardIndex',
        component: () => import('@/views/dashboard/Index.vue')
      },
    ]
  },
  {
    path: '/pushdetail',
    name: 'PushDetail',
    component:Layout,
    children: [
      {
        path: '/pushdetail',
        name: 'PushDetail',
        component: () => import('@/views/pushstream/Detail.vue')
      },
    ]
  },
  {
    path: '/setting',
    name: 'Setting',
    component:Layout,
    children: [
      {
        path: '/setting',
        name: 'Setting',
        component: () => import('@/views/pushstream/Setting.vue')
      },
    ]
  },
  {
    path: '/createpush',
    name: 'CreatePush',
    component:Layout,
    redirect: { name: 'CreatePushIndex' },
    children: [
      {
        path: '/createpush',
        name: 'CreatePushIndex',
        component: () => import('@/views/pushstream/createpush.vue')
      },
    ]
  },
  {
    path: '/managevideo',
    name: 'ManageVideo',
    redirect: { name: 'ManageVideoIndex' },
    children: [
      {
        path: '/managevideo',
        name: 'ManageVideoIndex',
        component: () => import('@/views/pushstream/managevideo.vue')
      },
    ]
  },
  {
    path: '/pushlist',
    name: 'PushList',
    component:Layout,
    redirect: { name: 'PushListIndex' },
    children: [
      {
        path: '/pushlist',
        name: 'PushListIndex',
        component: () => import('@/views/pushstream/pushlist.vue')
      },
    ]
  },
  {
    path:'/',
    name:'PushStream',
    redirect: {name:"PushStreamIndex"},
    component: Layout,
    children:[
      {
        path: "/push-stream",
        name: "PushStreamIndex",
        component: ()=> import('@/views/pushstream/Index.vue')
      }
    ]
  },
  {
    path: '/recordvideo',
    name: 'RecordVideo',
    // component: Layout,
    children: [
      {
        path: '/recordvideo',
        name: 'RecordVideoIndex',
        component: () => import('@/views/record/Index.vue'),
        meta:{
          ignoreCache:false
        }
      },
    ]
  },
  {
    path: '/record/setting',
    name: 'RecordSetting',
    // redirect: { name: 'RecordSetting' },
    children: [
      {
        path: '/record/setting',
        name: 'RecordSetting',
        component: () => import('@/views/record/setting.vue')
      },
    ]
  },
  {
    path: '/example',
    name: 'Example',
    children: [
      {
        path: '/example',
        name: 'ExampleHelloIndex',
        component: () => import('@/views/example/hello/Index.vue')
      },
    ]
  },
  {
    path: '/chepai',
    name: 'ChePai',
    redirect: { name: 'ChePaiIndex' },
    children: [
      {
        path: '/chepai',
        name: 'ChePaiIndex',
        component: () => import('@/views/chepai/Index.vue')
      },
    ]
  },
  {
    path: '/autohome',
    name: 'AutoHome',
    redirect: { name: 'AutoHomeRank' },
    children: [
      {
        path: '/autohome',
        name: 'AutoHomeRank',
        component: () => import('@/views/autohome/Index.vue')
      },
    ]
  },
]

export default constantRouterMap