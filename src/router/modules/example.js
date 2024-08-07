import Layout from '@/views/layout/index.vue'

export const example = {
  path: '/example',
  component: Layout,
  redirect: '/example/index',
  children: [
    {
      path: 'index',
      component: () => import('@/views/example.vue'),
      name: 'exampleIndex',
      meta: { title: '示例列表', icon: 'Tickets' }
    }
  ]
}

export const icon = {
  path: 'icon',
  component: Layout,
  name: 'Icon',
  meta: { // 处理外链
    title: '图标',
    icon: 'PictureRounded',
    path: 'https://element-plus.org/zh-CN/component/icon.html'
  }
}
