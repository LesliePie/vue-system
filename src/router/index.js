import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { title: '自述文件' },
            children:[
                {
                    path: '/dashboard',
                    component: resolve => require(['../components/page/Dashboard.vue'], resolve),
                    meta: { title: '系统首页' }
                },
                {
                    path:'/treeEdit',
                    component: resolve => require(['../components/page/TreePage.vue'],resolve),
                    meta:{title:'字典编辑'}
                },
                {
                    path: '/pageArticle',
                    component: resolve => require(['../components/page/PageArticle.vue'], resolve),
                    meta: { title: '文章/资源列表' }
                },
                {
                  path:'/recommendTabs' ,
                   component: resolve => require(['../components/page/Recommend.vue'] ,resolve),
                  meta: { title :'推荐管理'}
                },
                {
                    path: '/feedback',
                    component: resolve => require(['../components/page/FeedBack.vue'], resolve),
                    meta: { title: '用户反馈' }
                },
                {
                    path: '/notifyTabs',
                    component: resolve => require(['../components/page/NotifyTabs.vue'], resolve),
                    meta: { title: '消息通知' }
                },
                {
                    path: '/circleTabs',
                    component: resolve => require(['../components/page/CircleTabs.vue'], resolve),
                    meta: { title: '圈子管理' }
                },
                {
                    path: '/articleTabs',
                    component: resolve => require(['../components/page/ArticleTabs.vue'], resolve),
                    meta: { title: '心情/看法列表' }
                },
                {
                    path: '/teacherAuthorization',
                    component: resolve => require(['../components/page/teacherAuthorization.vue'], resolve),
                    meta: { title: '名师认证申请' }
                },
                {
                    path:'/pageUser',
                    component:resolve => require(['../components/page/PageUser.vue'],resolve),
                    meta: { title:'用户列表' }
                },
                {
                    // 富文本编辑器组件
                    path: '/editor',
                    component: resolve => require(['../components/page/VueEditor.vue'], resolve),
                    meta: { title: '富文本编辑器' }
                },
                {
                    // markdown组件
                    path: '/markdown',
                    component: resolve => require(['../components/page/Markdown.vue'], resolve),
                    meta: { title: 'markdown编辑器' }
                },
                {
                    // 图片上传组件
                    path: '/upload',
                    component: resolve => require(['../components/page/Upload.vue'], resolve),
                    meta: { title: '文件上传' }
                },
                {
                    // vue-schart组件
                    path: '/charts',
                    component: resolve => require(['../components/page/BaseCharts.vue'], resolve),
                    meta: { title: 'schart图表' }
                },
                {
                    // 拖拽列表组件
                    path: '/drag',
                    component: resolve => require(['../components/page/DragList.vue'], resolve),
                    meta: { title: '拖拽列表' }
                },
                {
                    // 权限页面
                    path: '/permission',
                    component: resolve => require(['../components/page/Permission.vue'], resolve),
                    meta: { title: '权限测试', permission: true }
                }
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {
            path: '/404',
            component: resolve => require(['../components/page/404.vue'], resolve)
        },
        {
            path: '/403',
            component: resolve => require(['../components/page/403.vue'], resolve)
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
})
