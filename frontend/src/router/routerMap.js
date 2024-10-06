import { compact } from "lodash";

/**
 * 基础路由
 * @type { *[] }
 */
// export const Layout = () => import("@/layout/push-stream.vue");

const constantRouterMap = [
  {
    path: "/",
    name: "RecordVideo",
    // component: Layout,
    redirect:'/recordvideo',
    children: [
      {
        path: "/recordvideo",
        name: "RecordVideoIndex",
        component: () => import("@/views/record/Index.vue"),
        meta: {
          ignoreCache: false,
        },
      },
    ],
  },
  {
    path: "/record/setting",
    name: "RecordSetting",
    // redirect: { name: 'RecordSetting' },
    children: [
      {
        path: "/record/setting",
        name: "RecordSetting",
        component: () => import("@/views/record/setting.vue"),
      },
    ],
  },
];

export default constantRouterMap;
