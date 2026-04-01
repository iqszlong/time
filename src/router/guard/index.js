import { createBaseGuard } from "./base-guard"
// import { createPermissionGuard } from './permission-guard'
// import { createPageLoadingGuard } from './page-loading-guard'
import { createPageTitleGuard } from './page-title-guard'

export function setupRouterGuard(router) {
  // createPageLoadingGuard(router)
  createBaseGuard(router)
  // createPermissionGuard(router)
  createPageTitleGuard(router)
}
