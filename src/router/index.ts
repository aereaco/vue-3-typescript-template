import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import LayOut from '@/layout/index.vue'
import chartsRouter from '@/router/modules/charts'
import nestedRouter from '@/router/modules/nested'
import tableRouter from '@/router/modules/table'
import componentsRouter from '@/router/modules/components'
import { markRaw } from 'vue'

/**
 * ConstantRoutes
 * Static routes that are always available
 */
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/redirect',
    component: LayOut,
    meta: { hidden: true },
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index.vue')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    meta: { hidden: true }
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect.vue'),
    meta: { hidden: true }
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404.vue'),
    meta: { hidden: true }
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401.vue'),
    meta: { hidden: true }
  },
  {
    path: '/',
    component: LayOut,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        name: 'Dashboard',
        meta: {
          title: 'dashboard',
          icon: 'dashboard',
          affix: true
        }
      }
    ]
  },
  {
    path: '/guide',
    component: LayOut,
    redirect: '/guide/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/guide/index.vue'),
        name: 'Guide',
        meta: {
          title: 'guide',
          icon: 'guide',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/profile',
    component: LayOut,
    redirect: '/profile/index',
    meta: { hidden: true },
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index.vue'),
        name: 'Profile',
        meta: {
          title: 'profile',
          icon: 'user',
          noCache: true
        }
      }
    ]
  }
]

/**
 * AsyncRoutes
 * Dynamically loaded routes based on user roles
 */
export const asyncRoutes: RouteRecordRaw[] = [
  {
    path: '/permission',
    component: LayOut,
    redirect: '/permission/directive',
    meta: {
      title: 'permission',
      icon: 'lock',
      roles: ['admin', 'editor'],
      alwaysShow: true
    },
    children: [
      {
        path: 'page',
        component: () => import('@/views/permission/page.vue'),
        name: 'PagePermission',
        meta: {
          title: 'pagePermission',
          roles: ['admin']
        }
      },
      {
        path: 'directive',
        component: () => import('@/views/permission/directive.vue'),
        name: 'DirectivePermission',
        meta: {
          title: 'directivePermission'
        }
      },
      {
        path: 'role',
        component: () => import('@/views/permission/role.vue'),
        name: 'RolePermission',
        meta: {
          title: 'rolePermission',
          roles: ['admin']
        }
      }
    ]
  },
  {
    path: '/icon',
    component: LayOut,
    children: [
      {
        path: 'index',
        component: () => import('@/views/icons/index.vue'),
        name: 'Icons',
        meta: {
          title: 'icons',
          icon: 'icon',
          noCache: true
        }
      }
    ]
  },
  // Include other async routes here as needed
  componentsRouter,
  chartsRouter,
  nestedRouter,
  tableRouter,
  {
    path: '/example',
    component: LayOut,
    redirect: '/example/list',
    meta: {
      title: 'example',
      icon: 'example'
    },
    children: [
      {
        path: 'create',
        component: () =>
          import(/* webpackChunkName: "example-create" */ '@/views/example/create.vue'),
        name: 'CreateArticle',
        meta: {
          title: 'createArticle',
          icon: 'edit'
        }
      },
      {
        path: 'edit/:id(\\d+)',
        component: () => import(/* webpackChunkName: "example-edit" */ '@/views/example/edit.vue'),
        name: 'EditArticle',
        meta: {
          title: 'editArticle',
          noCache: true,
          activeMenu: '/example/list',
          hidden: true
        }
      },
      {
        path: 'list',
        component: () => import(/* webpackChunkName: "example-list" */ '@/views/example/list.vue'),
        name: 'ArticleList',
        meta: {
          title: 'articleList',
          icon: 'list'
        }
      }
    ]
  },
  {
    path: '/tab',
    component: LayOut,
    children: [
      {
        path: 'index',
        component: () => import(/* webpackChunkName: "tab" */ '@/views/tab/index.vue'),
        name: 'Tab',
        meta: {
          title: 'tab',
          icon: 'tab'
        }
      }
    ]
  },
  {
    path: '/error',
    component: LayOut,
    redirect: 'noredirect',
    meta: {
      title: 'errorPages',
      icon: '404'
    },
    children: [
      {
        path: '401',
        component: () => import('@/views/error-page/401.vue'),
        name: 'Page401',
        meta: {
          title: 'page401',
          noCache: true
        }
      },
      {
        path: '404',
        component: () => import('@/views/error-page/404.vue'),
        name: 'Page404',
        meta: {
          title: 'page404',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/error-log',
    component: LayOut,
    redirect: 'noredirect',
    children: [
      {
        path: 'log',
        component: () => import('@/views/error-log/index.vue'),
        name: 'ErrorLog',
        meta: {
          title: 'errorLog',
          icon: 'bug'
        }
      }
    ]
  },
  {
    path: '/excel',
    component: LayOut,
    redirect: '/excel/export-excel',
    meta: {
      title: 'excel',
      icon: 'excel'
    },
    children: [
      {
        path: 'export-excel',
        component: () => import('@/views/excel/export-excel.vue'),
        name: 'ExportExcel',
        meta: { title: 'exportExcel' }
      },
      {
        path: 'export-selected-excel',
        component: () => import('@/views/excel/select-excel.vue'),
        name: 'SelectExcel',
        meta: { title: 'selectExcel' }
      },
      {
        path: 'export-merge-header',
        component: () => import('@/views/excel/merge-header.vue'),
        name: 'MergeHeader',
        meta: { title: 'mergeHeader' }
      },
      {
        path: 'upload-excel',
        component: () => import('@/views/excel/upload-excel.vue'),
        name: 'UploadExcel',
        meta: { title: 'uploadExcel' }
      }
    ]
  },
  {
    path: '/zip',
    component: LayOut,
    redirect: '/zip/download',
    meta: {
      title: 'zip',
      icon: 'zip',
      alwaysShow: true
    },
    children: [
      {
        path: 'download',
        component: () => import('@/views/zip/index.vue'),
        name: 'ExportZip',
        meta: { title: 'exportZip' }
      }
    ]
  },
  {
    path: '/pdf',
    component: LayOut,
    redirect: '/pdf/index',
    children: [
      {
        path: 'index',
        component: () => import(/* webpackChunkName: "pdf" */ '@/views/pdf/index.vue'),
        name: 'PDF',
        meta: {
          title: 'pdf',
          icon: 'pdf'
        }
      }
    ]
  },
  {
    path: '/pdf-download-example',
    component: () =>
      import(/* webpackChunkName: "pdf-download-example" */ '@/views/pdf/download.vue'),
    meta: { hidden: true }
  },
  {
    path: '/theme',
    component: markRaw(LayOut),
    redirect: 'noredirect',
    children: [
      {
        path: 'index',
        component: () => import('@/views/theme/index.vue'),
        name: 'Theme',
        meta: {
          title: 'theme',
          icon: 'theme'
        }
      }
    ]
  },
  {
    path: '/clipboard',
    component: LayOut,
    redirect: 'noredirect',
    children: [
      {
        path: 'index',
        component: () => import(/* webpackChunkName: "clipboard" */ '@/views/clipboard/index.vue'),
        name: 'Clipboard',
        meta: {
          title: 'clipboard',
          icon: 'clipboard'
        }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: constantRoutes,
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 } as ScrollToOptions
    }
  }
})

// Navigation guard to handle dynamic route addition
router.beforeEach((to, from, next) => {
  const routeExists = router.getRoutes().some(route => route.path === to.path)
  
  if (!routeExists && asyncRoutes.length) {
    // Add async routes to handle the navigation
    asyncRoutes.forEach(route => {
      router.addRoute(route)
    })
    // Navigate again to the original path
    next({ ...to, replace: true })
  } else {
    next()
  }
})

export function resetRouter() {
  const newRouter = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: constantRoutes
  })
  ;(router as any).matcher = (newRouter as any).matcher // reset router
}

export default router
