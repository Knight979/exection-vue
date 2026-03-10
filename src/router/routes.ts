import type { AppRouteRecordRaw } from './types'

// 定义路由
export const routes: AppRouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录',
      requiresAuth: false,
      hidden: true
    }
  },
  {
    path: '/',
    redirect: '/home',
    component: () => import('@/layouts/DefaultLayout.vue'),
    meta: {
      title: '布局',
      requiresAuth: true
    },
    children: [
      {
        path: '/home',
        name: 'Home',
        component: () => import('@/views/home/index.vue'),
        meta: {
          title: '首页',
          icon: 'HomeFilled',
          requiresAuth: true
        }
      },
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: {
          title: '数据看板',
          icon: 'DataAnalysis',
          requiresAuth: true
        }
      },
      {
        path: '/case',
        name: 'Case',
        meta: {
          title: '案件管理',
          icon: 'Files',
          requiresAuth: true
        },
        children: [
          {
            path: 'list',
            name: 'CaseList',
            component: () => import('@/views/case/index.vue'),
            meta: {
              title: '案件列表',
              requiresAuth: true
            }
          },
          {
            path: 'execution',
            name: 'ExecutionList',
            component: () => import('@/views/execution/index.vue'),
            meta: {
              title: '执行案件',
              requiresAuth: true
            }
          },
          {
            path: 'detail/:id',
            name: 'CaseDetail',
            component: () => import('@/views/case/detail.vue'),
            meta: {
              title: '案件详情',
              requiresAuth: true,
              hidden: true
            }
          }
        ]
      },
      {
        path: '/workOrder',
        name: 'WorkOrder',
        meta: {
          title: '工单管理',
          icon: 'List',
          requiresAuth: true
        },
        children: [
          {
            path: 'list',
            name: 'WorkOrderList',
            component: () => import('@/views/workOrder/index.vue'),
            meta: {
              title: '工单列表',
              requiresAuth: true
            }
          },
          {
            path: 'detail/:id',
            name: 'WorkOrderDetail',
            component: () => import('@/views/workOrder/detail.vue'),
            meta: {
              title: '工单详情',
              requiresAuth: true,
              hidden: true
            }
          }
        ]
      },
      {
        path: '/checkApply',
        name: 'CheckApply',
        meta: {
          title: '对账申请',
          icon: 'Money',
          requiresAuth: true
        },
        children: [
          {
            path: 'list',
            name: 'CheckApplyList',
            component: () => import('@/views/checkApply/index.vue'),
            meta: {
              title: '对账列表',
              requiresAuth: true
            }
          },
          {
            path: 'detail/:id',
            name: 'CheckApplyDetail',
            component: () => import('@/views/checkApply/detail.vue'),
            meta: {
              title: '对账详情',
              requiresAuth: true,
              hidden: true
            }
          }
        ]
      },
      {
        path: '/arbitration',
        name: 'Arbitration',
        meta: {
          title: '仲裁案件',
          icon: 'Management',
          requiresAuth: true
        },
        children: [
          {
            path: 'list',
            name: 'ArbitrationList',
            component: () => import('@/views/arbitration/index.vue'),
            meta: {
              title: '仲裁案件列表',
              requiresAuth: true
            }
          }
        ]
      },
      {
        path: '/execution/detail/:dataId',
        name: 'ExecutionDetail',
        component: () => import('@/views/execution/detail.vue'),
        meta: {
          title: '执行案件详情',
          requiresAuth: true,
          hidden: true
        }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/error/404.vue'),
    meta: {
      title: '404',
      hidden: true
    }
  },
  {
    path: '/user',
    name: 'User',
    meta: {
      title: '用户管理',
      icon: 'User',
      requiresAuth: true
    },
    children: [
      {
        path: 'list',
        name: 'UserList',
        component: () => import('@/views/user/index.vue'),
        meta: {
          title: '用户列表',
          requiresAuth: true
        }
      }
    ]
  },
  {
    path: '/role',
    name: 'Role',
    meta: {
      title: '角色管理',
      icon: 'Management',
      requiresAuth: true
    },
    children: [
      {
        path: 'list',
        name: 'RoleList',
        component: () => import('@/views/role/index.vue'),
        meta: {
          title: '角色列表',
          requiresAuth: true
        }
      }
    ]
  },
  {
    path: '/permission',
    name: 'Permission',
    meta: {
      title: '权限管理',
      icon: 'Lock',
      requiresAuth: true
    },
    children: [
      {
        path: 'list',
        name: 'PermissionList',
        component: () => import('@/views/permission/index.vue'),
        meta: {
          title: '权限列表',
          requiresAuth: true
        }
      }
    ]
  },
  {
    path: '/report',
    name: 'Report',
    meta: {
      title: '报表管理',
      icon: 'DocumentCopy',
      requiresAuth: true
    },
    children: [
      {
        path: 'list',
        name: 'ReportList',
        component: () => import('@/views/report/index.vue'),
        meta: {
          title: '报表列表',
          requiresAuth: true
        }
      }
    ]
  },
  {
    path: '/log',
    name: 'Log',
    meta: {
      title: '操作日志',
      icon: 'DocumentCopy',
      requiresAuth: true
    },
    children: [
      {
        path: 'list',
        name: 'LogList',
        component: () => import('@/views/log/index.vue'),
        meta: {
          title: '日志列表',
          requiresAuth: true
        }
      }
    ]
  },
  {
    path: '/import',
    name: 'Import',
    meta: {
      title: '数据导入',
      icon: 'DocumentCopy',
      requiresAuth: true
    },
    children: [
      {
        path: 'list',
        name: 'ImportList',
        component: () => import('@/views/import/index.vue'),
        meta: {
          title: '数据导入',
          requiresAuth: true
        }
      }
    ]
  },
  {
    path: '/caseAllocation',
    name: 'CaseAllocation',
    meta: {
      title: '案件分配',
      icon: 'DocumentCopy',
      requiresAuth: true
    },
    children: [
      {
        path: 'list',
        name: 'CaseAllocationList',
        component: () => import('@/views/caseAllocation/index.vue'),
        meta: {
          title: '案件分配',
          requiresAuth: true
        }
      }
    ]
  }
]
