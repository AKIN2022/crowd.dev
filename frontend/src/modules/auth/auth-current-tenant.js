import { tenantSubdomain } from '@/modules/tenant/tenant-subdomain'

/**
 * Auth Current Tenant
 *
 * This class helps us manage the active tenant that is stored within browser's localStorage, along with some
 * other helper methods like getSettings() or getCommunityHelpCenterSettings()
 */
export default class AuthCurrentTenant {
  static selectAndSaveOnStorageFor(currentUser) {
    if (!currentUser) {
      return null
    }

    if (!currentUser.tenants) {
      return null
    }

    const activeTenants = currentUser.tenants.filter(
      (tenantUser) => tenantUser.status === 'active'
    )

    if (!activeTenants || !activeTenants.length) {
      return null
    }

    const tenantId = this.get()

    let tenant

    if (tenantId) {
      tenant = activeTenants
        .map((tenantUser) => tenantUser.tenant)
        .find((tenant) => tenant.id === tenantId)
    }

    tenant = tenant || activeTenants[0].tenant

    if (
      tenant &&
      tenantSubdomain.isEnabled &&
      !tenantSubdomain.isSubdomainOf(tenant.url)
    ) {
      return tenantSubdomain.redirectAuthenticatedTo(
        tenant.url
      )
    }

    this.set(tenant)
    return tenant
  }

  static get() {
    const tenantASString =
      localStorage.getItem('tenant') || null

    if (tenantASString) {
      return JSON.parse(tenantASString).id
    }

    return null
  }

  static getSettings() {
    const tenantASString =
      localStorage.getItem('tenant') || null

    if (tenantASString) {
      const tenant = JSON.parse(tenantASString)

      if (tenant) {
        if (Array.isArray(tenant.settings)) {
          if (tenant.settings.length) {
            return tenant.settings[0]
          }
        } else {
          return tenant.settings
        }
      }
    }

    return null
  }

  static getCommunityHelpCenterSettings() {
    const tenantASString =
      localStorage.getItem('tenant') || null

    if (tenantASString) {
      const tenant = JSON.parse(tenantASString)

      if (tenant) {
        if (Array.isArray(tenant.conversationSettings)) {
          if (tenant.conversationSettings.length) {
            return tenant.conversationSettings[0]
          }
        } else {
          return tenant.conversationSettings
        }
      }
    }

    return {}
  }

  static set(tenant) {
    if (!tenant) {
      return this.clear()
    }

    localStorage.setItem('tenant', JSON.stringify(tenant))
  }

  static clear() {
    localStorage.removeItem('tenant')
  }
}
