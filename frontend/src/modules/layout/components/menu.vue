<template>
  <el-aside class="app-menu" width="fit-content">
    <el-menu
      class="flex flex-col h-full border-gray-200"
      :collapse="isCollapsed"
      :router="true"
    >
      <!-- Menu logo header -->
      <div
        class="h-14 pl-6 pr-3 flex items-center justify-between menu-expanded-header"
      >
        <router-link to="/">
          <img
            key="logo"
            class="h-5 w-auto"
            src="/images/logo-all-black.png"
            alt="crowd.dev logo"
          />
        </router-link>
        <el-button
          class="btn btn--icon--sm btn--transparent custom-btn"
          @click="toggleMenu"
        >
          <i
            class="ri-layout-left-2-line text-lg leading-none text-gray-300"
          ></i>
        </el-button>
      </div>

      <!-- Menu dynamic logo -->
      <div
        class="h-14 flex items-center justify-center menu-collapsed-header"
      >
        <img
          key="icon"
          class="h-5 w-auto dynamic-logo"
          src="/images/icon-all-black.png"
          alt="crowd.dev icon"
        />

        <!-- Menu expand button -->
        <el-button
          class="btn btn--icon--sm btn--transparent expand-btn custom-btn"
          @click="toggleMenu"
        >
          <i
            class="ri-arrow-right-s-line text-lg leading-none text-gray-300"
          ></i>
        </el-button>
      </div>

      <!-- Workspace Dropdown -->
      <app-workspace-dropdown v-if="currentTenant" />

      <div class="px-3 pt-3 flex flex-col gap-2 grow">
        <!-- Menu items -->
        <el-tooltip
          :disabled="!isCollapsed"
          effect="dark"
          placement="right"
          raw-content
          popper-class="custom-menu-tooltip"
          :content="i18n('dashboard.menu')"
        >
          <router-link
            id="menu-dashboard"
            :to="{ path: '/' }"
            class="el-menu-item"
            :class="classFor('/', true)"
          >
            <i class="ri-home-5-line"></i>
            <span v-if="!isCollapsed">
              <app-i18n code="dashboard.menu"></app-i18n>
            </span>
          </router-link>
        </el-tooltip>
        <el-tooltip
          :disabled="!isCollapsed"
          effect="dark"
          placement="right"
          raw-content
          popper-class="custom-menu-tooltip"
          :content="i18n('entities.member.menu')"
        >
          <router-link
            v-if="
              hasPermissionToCommunityMember ||
              isCommunityMemberLocked
            "
            id="menu-members"
            :to="{ path: '/members' }"
            class="el-menu-item"
            :class="classFor('/members')"
            :disabled="isCommunityMemberLocked"
          >
            <i class="ri-contacts-line"></i>
            <span v-if="!isCollapsed">
              <app-i18n
                code="entities.member.menu"
              ></app-i18n>
            </span>
          </router-link>
        </el-tooltip>
        <el-tooltip
          :disabled="!isCollapsed"
          effect="dark"
          placement="right"
          raw-content
          popper-class="custom-menu-tooltip"
          :content="i18n('entities.activity.menu')"
        >
          <router-link
            v-if="
              hasPermissionToActivity || isActivityLocked
            "
            id="menu-activities"
            :to="{ path: '/activities' }"
            class="el-menu-item"
            :class="classFor('/activities')"
            :disabled="isActivityLocked"
          >
            <i class="ri-radar-line"></i>
            <span v-if="!isCollapsed">
              <app-i18n
                code="entities.activity.menu"
              ></app-i18n>
            </span>
          </router-link>
        </el-tooltip>
        <el-tooltip
          :disabled="!isCollapsed"
          effect="dark"
          placement="right"
          raw-content
          popper-class="custom-menu-tooltip"
          :content="i18n('entities.report.menu')"
        >
          <router-link
            v-if="hasPermissionToReport || isReportLocked"
            id="menu-reports"
            :to="{ path: '/reports' }"
            class="el-menu-item"
            :class="classFor('/reports')"
            :disabled="isReportLocked"
          >
            <i class="ri-bar-chart-line"></i>
            <span v-if="!isCollapsed">
              <app-i18n
                code="entities.report.menu"
              ></app-i18n>
            </span>
          </router-link>
        </el-tooltip>

        <!-- External links -->
        <el-divider
          v-if="hasPremiumModules"
          class="border-gray-200"
        />
        <el-tooltip
          v-if="hasPremiumModules"
          :disabled="!isCollapsed"
          effect="dark"
          placement="right"
          raw-content
          popper-class="custom-menu-tooltip"
          :content="i18n('entities.eagleEye.menu')"
        >
          <router-link
            v-if="
              hasPermissionToEagleEye || isEagleEyeLocked
            "
            id="menu-eagle-eye"
            :to="{ path: '/eagle-eye' }"
            class="el-menu-item"
            :class="classFor('/eagle-eye')"
            :disabled="isEagleEyeLocked"
          >
            <i class="ri-search-eye-line"></i>
            <span v-if="!isCollapsed">
              <app-i18n
                code="entities.eagleEye.menu"
              ></app-i18n>
            </span>
          </router-link>
        </el-tooltip>
        <el-tooltip
          v-if="hasPremiumModules"
          :disabled="!isCollapsed"
          effect="dark"
          placement="right"
          raw-content
          popper-class="custom-menu-tooltip"
          :content="i18n('entities.conversation.menu')"
        >
          <router-link
            id="menu-conversations"
            :to="{ path: '/community-help-center' }"
            class="el-menu-item"
            :class="classFor('/community-help-center')"
          >
            <i class="ri-question-answer-line"></i>
            <span v-if="!isCollapsed">
              <app-i18n
                code="entities.communityHelpCenter.menu"
              ></app-i18n>
            </span>
          </router-link>
        </el-tooltip>

        <div class="grow"></div>
        <el-tooltip
          :disabled="!isCollapsed"
          effect="dark"
          placement="right"
          raw-content
          popper-class="custom-menu-tooltip"
          :content="`${i18n(
            'integrations.menu'
          )} <i class='ri-external-link-line ml-1.1'></i>`"
        >
          <router-link
            id="menu-integrations"
            :to="{ path: '/integrations' }"
            class="el-menu-item"
            :class="classFor('/integrations')"
          >
            <i class="ri-apps-2-line"></i>
            <span v-if="!isCollapsed">
              <app-i18n code="integrations.menu"></app-i18n>
            </span>
          </router-link>
        </el-tooltip>
        <el-tooltip
          :disabled="!isCollapsed"
          effect="dark"
          placement="right"
          raw-content
          popper-class="custom-menu-tooltip"
          :content="i18n('settings.menu')"
        >
          <router-link
            v-if="
              hasPermissionToSettings || isSettingsLocked
            "
            id="menu-settings"
            :to="{ path: '/settings' }"
            class="el-menu-item"
            :class="classFor('/settings')"
            :disabled="isSettingsLocked"
          >
            <i class="ri-settings-3-line"></i>
            <span v-if="!isCollapsed">
              <app-i18n code="settings.menu"></app-i18n
            ></span>
          </router-link>
        </el-tooltip>

        <!-- Support popover -->
        <app-support-dropdown />
      </div>

      <!-- User Account -->
      <div class="mt-3">
        <app-account-dropdown />
      </div>
    </el-menu>
  </el-aside>
</template>

<script>
export default {
  name: 'AppMenu'
}
</script>

<script setup>
import { useStore } from 'vuex'
import { SettingsPermissions } from '@/modules/settings/settings-permissions'
import { ReportPermissions } from '@/modules/report/report-permissions'
import { MemberPermissions } from '@/modules/member/member-permissions'
import { ActivityPermissions } from '@/modules/activity/activity-permissions'
import { EagleEyePermissions } from '@/premium/eagle-eye/eagle-eye-permissions'
import AppAccountDropdown from './account-dropdown'
import AppSupportDropdown from './support-dropdown'
import AppWorkspaceDropdown from './workspace-dropdown'
import { computed } from 'vue'
import { i18n } from '@/i18n'
import config from '@/config'

import { RouterLink, useLink } from 'vue-router'

const store = useStore()
const { route } = useLink(RouterLink.props)
const isCollapsed = computed(
  () => store.getters['layout/menuCollapsed']
)
const currentUser = computed(
  () => store.getters['auth/currentUser']
)
const currentTenant = computed(
  () => store.getters['auth/currentTenant']
)

function toggleMenu() {
  store.dispatch('layout/toggleMenu')
}

const hasPermissionToSettings = computed(
  () =>
    new SettingsPermissions(
      currentTenant.value,
      currentUser.value
    ).edit
)

const hasPermissionToCommunityMember = computed(
  () =>
    new MemberPermissions(
      currentTenant.value,
      currentUser.value
    ).read
)

const hasPermissionToActivity = computed(
  () =>
    new ActivityPermissions(
      currentTenant.value,
      currentUser.value
    ).read
)

const hasPermissionToReport = computed(
  () =>
    new ReportPermissions(
      currentTenant.value,
      currentUser.value
    ).read
)

const hasPermissionToEagleEye = computed(
  () =>
    new EagleEyePermissions(
      currentTenant.value,
      currentUser.value
    ).read
)

const isSettingsLocked = computed(
  () =>
    new SettingsPermissions(
      currentTenant.value,
      currentUser.value
    ).lockedForCurrentPlan
)

const isCommunityMemberLocked = computed(
  () =>
    new MemberPermissions(
      currentTenant.value,
      currentUser.value
    ).lockedForCurrentPlan
)

const isActivityLocked = computed(
  () =>
    new ActivityPermissions(
      currentTenant.value,
      currentUser.value
    ).lockedForCurrentPlan
)

const isReportLocked = computed(
  () =>
    new ReportPermissions(
      currentTenant.value,
      currentUser.value
    ).lockedForCurrentPlan
)

const isEagleEyeLocked = computed(
  () =>
    new EagleEyePermissions(
      currentTenant.value,
      currentUser.value
    ).lockedForCurrentPlan
)

const hasPremiumModules = computed(
  () => config.hasPremiumModules
)

const classFor = (path, exact = false) => {
  if (exact) {
    return {
      'is-active': route.value.path === path
    }
  }

  const routePath = route.value.path
  const active =
    routePath === path || routePath.startsWith(path + '/')
  return {
    'is-active': active
  }
}
</script>

<style lang="scss">
.app-menu {
  @apply bg-white flex flex-col min-h-screen;

  a,
  a[href]:hover {
    @apply text-gray-900;
  }

  // Logo switch

  .dynamic-logo {
    display: block;
  }

  .expand-btn {
    display: none;
  }

  .el-menu:hover:not(.horizontal-collapse-transition).el-menu--collapse {
    .dynamic-logo {
      display: none;
    }

    .expand-btn {
      display: block;
    }
  }

  // Menu item
  .el-menu-item {
    @apply px-2.5 h-10 gap-3 leading-normal rounded-md;

    i {
      @apply text-gray-400 text-lg leading-none;
    }

    &.is-active {
      @apply bg-brand-50 text-gray-900 font-medium;

      i {
        @apply text-brand-500;
      }
    }

    &:hover {
      @apply bg-gray-50;

      i {
        @apply text-gray-500;
      }
    }
  }

  // Menu width and padding customization
  .el-menu--vertical:not(.el-menu--collapse):not(.el-menu--popup-container) {
    width: 260px;

    .menu-collapsed-header {
      display: none;
    }
  }

  .el-menu--vertical:not(.el-menu--collapse):not(.el-menu--popup-container)
    .el-menu-item {
    @apply px-2.5;
  }

  .el-menu--vertical.el-menu--collapse {
    .menu-expanded-header {
      display: none;
    }
  }

  // Override divider margin
  .el-divider--horizontal {
    @apply my-1;
  }

  // Custom Menu items
  .item-link {
    display: none;
  }

  .custom-menu-item:hover {
    .item-link {
      display: block;
    }
  }
  .custom-btn {
    @apply h-8 w-8;

    &:hover i {
      @apply text-gray-500;
    }
  }

  .horizontal-collapse-transition .custom-btn {
    display: none;
  }

  .horizontal-collapse-transition .expand-btn {
    display: none;
  }

  a[href]:hover {
    opacity: 1;
  }

  // Image animations
  img {
    transition: opacity 0.3s ease;
    opacity: 1;
  }

  .v-enter-active img,
  .v-leave-active img {
    opacity: 0;
  }
}

// Custom tooltip for external links
.custom-menu-tooltip {
  margin-left: 8px !important;

  span:first-child {
    @apply flex gap-1.5 items-center;
  }
}
</style>
