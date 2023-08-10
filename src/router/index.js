import {
    createRouter,
    createWebHashHistory
} from 'vue-router'
import Test from "~/pages/test.vue";

import Admin from "~/layouts/index.vue";
import Index from '~/pages/index.vue'
import Login from '~/pages/login.vue'
import NotFound from '~/pages/404.vue'
import Game from "~/pages/gameList/game.vue";
import GameStore from "~/pages/gameList/gameStore.vue";
import GameTag from "~/pages/gameList/gameTag.vue";
import Advert from "~/pages/advert/advert.vue";
import DataIndex from "~/pages/dataStatistics/dataIndex.vue";
import GameClickTimesData from "~/pages/dataStatistics/gameClickTimesData.vue";
import Adgroup from "~/pages/advert/groupAd.vue";
import HomeConfig from "~/pages/pageFloor/appHomeConfig.vue";
import OtherPages from "~/pages/pageFloor/otherPageConfig.vue";






const routes = [
    {
        path: "/",
        component: Admin,
        // 子路由
        children: [
            {
                path: "/",
                component: Index,
                meta: {
                    title: "后台首页"
                }
            },
            {
                path: '/gameList',
                component: Game,
                meta: {
                    title: "游戏管理"
                }
            },
            {
                path: '/test',
                component: Test,
                meta: {
                    title: "测试"
                }
            },
            {
                path: '/gameStore',
                component: GameStore,
                meta: {
                    title: "游戏仓库管理"
                }
            },
            {
                path: '/gameTag',
                component: GameTag,
                meta: {
                    title: "游戏标签管理"
                }
            },
            {
                path: '/advert',
                component: Advert,
                meta: {
                    title: "广告管理"
                }
            },

            {
                path: '/dataStatistics',
                component: DataIndex,
                meta: {
                    title: "数据统计"
                }
            },
            {
                path: '/gameClickTimesData',
                component: GameClickTimesData,
                meta: {
                    title: "游戏打开次数"
                }
            },
            {
                path: '/adGroup',
                component: Adgroup,
                meta: {
                    title: "分组管理"
                }
            },
            {
                path: '/homeConfig',
                component: HomeConfig,
                meta: {
                    title: "首页配置"
                }
            },
            {
                path: '/otherPages',
                component: OtherPages,
                meta: {
                    title: "其他页面"
                }
            },
        ]
    },
    {
        path: "/login",
        component: Login,
        meta: {
            title: "登录页"
        }
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: NotFound
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router