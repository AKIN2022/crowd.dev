<template>
  <div
    v-if="selectedRows.length > 0"
    class="app-page-toolbar user-list-toolbar"
  >
    <span class="block text-sm font-semibold mr-4"
      >{{ selectedRows.length }}
      {{ selectedRows.length > 1 ? 'rows' : 'row' }}
      selected</span
    >

    <el-dropdown trigger="click" @command="handleCommand">
      <button class="btn btn--bordered btn--sm">
        <span class="mr-2">Actions</span>
        <i class="ri-xl ri-arrow-down-s-line"></i>
      </button>
      <template #dropdown>
        <el-dropdown-item
          command="export"
          :disabled="exportButtonDisabled"
        >
          <i class="ri-lg ri-file-download-line mr-1" />
          Export to CSV
        </el-dropdown-item>
        <el-dropdown-item
          v-if="hasPermissionToDestroy"
          command="destroyAll"
          :disabled="destroyButtonDisabled"
        >
          <div class="text-red-500 flex items-center">
            <i class="ri-lg ri-delete-bin-line mr-2" />
            <app-i18n code="common.destroy"></app-i18n>
          </div>
        </el-dropdown-item>
      </template>
    </el-dropdown>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { UserPermissions } from '@/premium/user/user-permissions'
import { i18n } from '@/i18n'
import ConfirmDialog from '@/shared/confirm-dialog/confirm-dialog.js'

export default {
  name: 'AppUserListToolbar',

  computed: {
    ...mapGetters({
      currentUser: 'auth/currentUser',
      currentTenant: 'auth/currentTenant',
      hasRows: 'user/list/hasRows',
      loading: 'user/list/loading',
      exportLoading: 'user/list/exportLoading',
      selectedRows: 'user/list/selectedRows'
    }),

    hasPermissionToDestroy() {
      return new UserPermissions(
        this.currentTenant,
        this.currentUser
      ).destroy
    },

    exportButtonDisabled() {
      return (
        !this.hasRows || this.loading || this.exportLoading
      )
    },

    destroyButtonDisabled() {
      return !this.selectedRows.length || this.loading
    }
  },

  methods: {
    ...mapActions({
      doExport: 'user/list/doExport',
      doDestroyAll: 'user/destroy/doDestroyAll'
    }),

    async handleCommand(command) {
      if (command === 'export') {
        await this.handleDoExport()
      } else if (command === 'destroyAll') {
        await this.doDestroyAllWithConfirm()
      }
    },

    async doDestroyAllWithConfirm() {
      try {
        await ConfirmDialog({
          title: i18n('common.confirm'),
          message: i18n('common.areYouSure'),
          confirmButtonText: i18n('common.yes'),
          cancelButtonText: i18n('common.no')
        })

        return this.doDestroyAll(
          this.selectedRows.map((item) => item.id)
        )
      } catch (error) {
        // no
      }
    },

    async handleDoExport() {
      try {
        await this.doExport()
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="scss">
.user-list-toolbar {
  @apply flex items-center justify-start absolute top-0 right-0 z-10 bg-white rounded-tr-xl p-2;
  height: calc(56px - 1px);
  width: calc(100% - 75px);
}
</style>
