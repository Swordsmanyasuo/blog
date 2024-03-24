import { createRouter, createWebHistory } from 'vue-router'
const routes = [
    {
        path: '/:pathMatch(.*)*',
        meta: { title: '404页面不存在' },
        component: () => import('@/views/404.vue'),
    },
    {
        path: '/',
        meta: { title: '首页', parentPath: '/' },
        component: () => import('@/views/Index.vue'),
    },
    {
        path: '/category',
        meta: { title: '分类', parentPath: '/category' },
        component: () => import('@/views/Category.vue'),
    },
    {
        path: '/category/:categoryId',
        meta: { title: '分类博客', parentPath: '/category' },
        component: () => import('@/views/CategoryBlogList.vue'),
    },
    {
        path: '/blog/:blogId',
        meta: { title: '博客详情', parentPath: '/' },
        component: () => import('@/views/BlogDetail.vue'),
    },
    {
        path: '/special',
        meta: { title: '专题', parentPath: '/special' },
        component: () => import('@/views/Special.vue'),
    },
    {
        path: '/special/:blogId',
        meta: { title: '专题博客', parentPath: '/special' },
        component: () => import('@/views/SpecialBlog.vue'),
    },
    {
        path: '/user',
        meta: { title: '成员', parentPath: '/user' },
        component: () => import('@/views/User.vue'),
    },
    {
        path: '/comment',
        meta: { title: '留言', parentPath: 'comment' },
        component: () => import('@/views/Comment.vue'),
    },
]
const router = createRouter({
    routes,
    history: createWebHistory(),
})

router.beforeEach((to, from, next) => {
    window.document.title = to.meta.title
    next()
});
export default router