import { LOGIN_TOKEN, MENUS_INFO, USER_INFO } from '@/constants/login'
import router from '@/router/route'
import { accountLogin, menusInfoById, userInfoById } from '@/service/login/login'
import type { IAccount } from '@/types/login'
import { localCache } from '@/utils/cache'
import { defineStore } from 'pinia'
import type { RouteRecordRaw } from 'vue-router'

// 指定箭头函数的类型
interface ILoginState {
  token: string
  userInfo: any
  menuInfo: any
}

const useLoginStore = defineStore('login', {
  state: (): ILoginState => ({
    token: localCache.getCache(LOGIN_TOKEN) ?? '',
    userInfo: localCache.getCache(USER_INFO) ?? {},
    menuInfo: localCache.getCache(MENUS_INFO) ?? {}
  }),
  // 异步请求网络数据
  actions: {
    async loginAccountAction(account: IAccount) {
      const loginResult = await accountLogin(account)
      // 1.帐号登录，获取token的信息，把token结果保存到state中
      // console.log(loginResult)
      const id = loginResult.data.data.id
      this.token = loginResult.data.data.token

      // 2.使用localStorage或sessionStorages本地缓存，可以使用封装过后的localStorage
      localCache.setCache(LOGIN_TOKEN, this.token)

      // 3.获取用户登录的详细信息(权限信息、角色信息、部门等)，存到state中，存到缓存中
      const userInfoRes = await userInfoById(id)
      const userInfo = userInfoRes.data.data
      this.userInfo = userInfo
      localCache.setCache(USER_INFO, userInfo)
      // console.log('userInfoRes:', userInfoRes.data.data)
      // console.log('userInfoRole', this.userInfo.role)

      // 4.根据用户角色权限动态获取菜单信息，将菜单信息存到state和浏览器内存中
      const menusInfoRes = await menusInfoById(this.userInfo.role.id)
      const menusInfo = menusInfoRes.data.data
      this.menuInfo = menusInfo
      localCache.setCache(MENUS_INFO, menusInfo)
      // console.log('menus:', menusInfoRes)
      // console.log('menuInfo:', menusInfoRes.data.data)

      // 将动态获取的菜单路由放在数组中
      // 1.1.定义一个数组，类型是router中的类型
      const localRoutes: RouteRecordRaw[] = []
      // 1.2.读取router/main中的所有ts文件，加载main下面的所有的ts文件，中间的两个**表示匹配main下面的所有子目录
      const files: Record<string, any> = import.meta.glob('../../router/main/**/*.ts', {
        eager: true
      })
      // 1.3.遍历出模块，拿到path属性
      for (let key in files) {
        const module = files[key]
        localRoutes.push(module.default)
      }
      // console.log('localRoutes:', loaclRoutes)
      // console.log('menusInfo:', menusInfo)
      // 1.4.根据菜单匹配正确的路由
      for (let menu of menusInfo) {
        for (let subMenu of menu.children) {
          const route = localRoutes.find((item) => item.path === subMenu.url)
          // 类型缩小
          if (route) router.addRoute('main', route)
        }
      }

      // 4.页面跳转到main页面
      router.push('/main')
    }
  }
})

export default useLoginStore
