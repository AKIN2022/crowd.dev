<template>
  <div>
    <el-popover
      placement="right-start"
      :width="230"
      trigger="click"
      popper-class="workspace-popover"
      @show="isDropdownOpen = true"
      @hide="isDropdownOpen = false"
    >
      <template #reference>
        <div class="w-full">
          <el-tooltip
            :disabled="!isCollapsed || isDropdownOpen"
            effect="dark"
            placement="right"
            raw-content
            popper-class="custom-workspace-menu-tooltip"
            :content="currentTenant.name"
          >
            <div
              class="cursor-pointer flex w-full min-h-16 py-2 items-center bg-white hover:bg-gray-50 account-btn"
              :class="
                isDropdownOpen ? 'bg-gray-50' : 'bg-white'
              "
              @click="isDropdownOpen = true"
            >
              <div class="flex items-center">
                <div
                  class="h-10 w-10 p-1"
                  :class="isCollapsed ? '' : 'mr-3'"
                >
                  <app-squared-avatar
                    :name="currentTenant.name"
                  ></app-squared-avatar>
                </div>
                <div
                  v-if="!isCollapsed"
                  class="text-sm account-btn-info"
                >
                  <div class="text-gray-900">
                    {{ currentTenant.name }}
                  </div>
                  <div class="text-gray-500 text-2xs">
                    {{ planLabelOf(currentTenant.plan) }}
                  </div>
                </div>
              </div>

              <i
                v-if="!isCollapsed"
                class="ri-more-2-fill text-gray-300 text-lg"
              ></i>
            </div>
          </el-tooltip>
        </div>
      </template>

      <div class="flex flex-col gap-1 mb-1">
        <!-- TODO: Check if we need permissions to access this page -->
        <div
          class="uppercase text-2xs text-gray-400 tracking-wide font-semibold pl-3 mt-1 leading-6"
        >
          Workspaces
        </div>
        <div
          v-for="tenant in tenantsList"
          :key="tenant.id"
          class="popover-item min-h-10 h-auto py-2"
          :class="
            currentTenant && currentTenant.id === tenant.id
              ? 'selected'
              : ''
          "
          @click="() => doSwitchTenant(tenant)"
        >
          <div
            class="flex grow justify-between items-center"
          >
            <div class="text-gray-900 text-xs flex-grow">
              {{ tenant.name }}
            </div>
            <div
              class="text-gray-400 pl-3 text-2xs plan whitespace-nowrap"
            >
              {{ planLabelOf(tenant.plan) }}
            </div>
          </div>
        </div>

        <el-divider class="border-gray-200 !my-1" />

        <div
          class="popover-item"
          @click="doManageWorkspaces"
        >
          <i
            class="text-base text-gray-400 ri-list-settings-line"
          ></i>
          <span class="text-xs text-gray-900"
            ><app-i18n code="tenant.menu"></app-i18n
          ></span>
        </div>
      </div>
    </el-popover>
    <app-tenant-list-drawer v-model="isTenantsDrawerOpen" />
  </div>
</template>

<script>
export default {
  name: 'AppWorkspaceDropdown'
}
</script>

<script setup>
import { useStore } from 'vuex'
import { computed, onMounted, ref } from 'vue'
import { i18n } from '@/i18n'
import AppTenantListDrawer from '@/modules/tenant/components/tenant-list-drawer'

const store = useStore()

const isDropdownOpen = ref(false)
const isTenantsDrawerOpen = ref(false)

const currentTenant = computed(
  () => store.getters['auth/currentTenant']
)
const tenantsList = computed(() => {
  const rows = store.getters['tenant/rows']

  return rows.sort((x, y) => {
    return x.name < y.name ? -1 : x.name > y.name ? 1 : 0
  })
})
const isCollapsed = computed(
  () => store.getters['layout/menuCollapsed']
)

onMounted(async () => {
  await store.dispatch('tenant/doFetch', {})
})

function doManageWorkspaces() {
  isDropdownOpen.value = false
  isTenantsDrawerOpen.value = true
}

async function doSwitchTenant(tenant) {
  isDropdownOpen.value = false
  await store.dispatch('auth/doSelectTenant', tenant)
}

function planLabelOf(plan) {
  return i18n(`plan.${plan}.label`)
}
</script>

<style lang="scss">
.workspace-popover {
  padding: 8px !important;
  border-radius: 8px !important;
  border: none !important;
  box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.2) !important;
}

.popover-item.selected {
  background-color: rgba(253, 237, 234, 0.5);

  & .plan {
    @apply text-brand-400;
  }
}

.custom-workspace-menu-tooltip {
  margin-left: -3px !important;
}
</style>
