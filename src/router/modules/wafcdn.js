import Layout from '@/views/layout/index.vue'

export const wafcdn = {
  path: '/wafcdn',
  component: Layout,
  redirect: '/wafcdn/stat',
  meta: { title: 'WAFCDN', icon: 'Postcard' },
  children: [
    {
      path: 'index',
      component: () => import('@/views/wafcdn/index.vue'),
      name: 'WafCdnIndex',
      meta: { title: '主控', icon: 'HelpFilled' }
    },
    {
      path: 'stat',
      component: () => import('@/views/wafcdn/stat.vue'),
      name: 'WafCdnStat',
      meta: { title: '状态总览', icon: 'Odometer' }
    },
    {
      path: 'domain',
      component: () => import('@/views/wafcdn/domain.vue'),
      name: 'WafCdnDomain',
      meta: { title: '域名管理', icon: 'Grid' }
    },
    {
      path: 'cache',
      component: () => import('@/views/wafcdn/cache.vue'),
      name: 'WafCdnCache',
      meta: { title: '缓存文件', icon: 'Files' }
    }
  ]
}
