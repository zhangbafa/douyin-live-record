/**
 * 基础路由
 * @type { *[] }
 */
// export const Layout = () => import("@/layout/push-stream.vue");

const constantRouterMap = [
  {
    path: "/",
    name: "RecordVideo",
    redirect:'/recordvideo',
    children: [
      {
        path: "/recordvideo",
        name: "RecordVideoIndex",
        component: () => import("@/views/index.vue"),
        meta: {
          ignoreCache: false,
        },
      },
    ],
  },
  {
    path: "/record/setting",
    name: "RecordSetting",
    children: [
      {
        path: "/record/setting",
        name: "RecordSetting",
        component: () => import("@/views/setting.vue"),
      },
    ],
  },
];

export default constantRouterMap;
