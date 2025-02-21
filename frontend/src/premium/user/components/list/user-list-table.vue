<template>
  <div
    class="flex items-center py-1 mb-3 mt-2 justify-between"
  >
    <div class="text-gray-500 text-sm">
      {{ count }} user{{ count === 1 ? '' : 's' }}
    </div>

    <el-button
      class="btn btn--primary btn--sm"
      @click.prevent="() => $emit('invite')"
    >
      <i class="ri-lg ri-mail-line mr-1" />
      <span class="leading-5">Invite user</span>
    </el-button>
  </div>
  <div class="app-list-table panel">
    <app-user-list-toolbar></app-user-list-toolbar>
    <div class="-mx-6 -mt-6">
      <el-table
        ref="table"
        v-loading="loading"
        :data="rows"
        row-key="id"
        :bordered="true"
        :row-class-name="rowClass"
        @sort-change="doChangeSort"
      >
        <el-table-column
          type="selection"
          width="75"
        ></el-table-column>

        <el-table-column
          :width="250"
          :label="fields.fullName.label"
          :prop="fields.fullName.name"
          sortable="custom"
        >
          <template #default="scope">
            {{ presenter(scope.row, 'fullName') ?? '-' }}
          </template>
        </el-table-column>

        <el-table-column
          :width="400"
          :label="fields.email.label"
          :prop="fields.email.name"
          sortable="custom"
        >
          <template #default="scope">
            {{ presenter(scope.row, 'email') }}
          </template>
        </el-table-column>

        <el-table-column
          :width="100"
          :label="fields.role.label"
          :prop="fields.roles.name"
        >
          <template #default="scope">
            <div
              v-for="roleId in scope.row.roles"
              :key="roleId"
            >
              <el-tooltip
                :content="roleDescriptionOf(roleId)"
              >
                <span>{{ roleLabelOf(roleId) }}</span>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          :label="fields.status.label"
          :prop="fields.status.name"
        >
          <template #default="scope">
            <span
              class="badge"
              :class="{
                'badge--green':
                  scope.row[fields.status.name] ===
                  'active',
                'badge--red':
                  scope.row[fields.status.name] ===
                  'empty-permissions'
              }"
              >{{ presenter(scope.row, 'status') }}</span
            >
          </template>
        </el-table-column>

        <el-table-column
          fixed="right"
          align="center"
          width="120"
        >
          <template #default="scope">
            <div class="table-actions">
              <app-user-dropdown
                :user="scope.row"
              ></app-user-dropdown>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { UserModel } from '@/premium/user/user-model'
import { mapGetters, mapActions } from 'vuex'
import { UserPermissions } from '@/premium/user/user-permissions'
import UserListToolbar from '@/premium/user/components/list/user-list-toolbar.vue'
import Roles from '@/security/roles'
import { i18n } from '@/i18n'
import AppUserDropdown from '../user-dropdown'
import ConfirmDialog from '@/shared/confirm-dialog/confirm-dialog.js'

const { fields } = UserModel

export default {
  name: 'AppUserListTable',

  components: {
    AppUserDropdown,
    'app-user-list-toolbar': UserListToolbar
  },

  emits: ['invite'],

  computed: {
    ...mapGetters({
      rows: 'user/list/rows',
      count: 'user/list/count',
      loading: 'user/list/loading',
      selectedRows: 'user/list/selectedRows',
      currentUser: 'auth/currentUser',
      currentTenant: 'auth/currentTenant'
    }),

    hasPermissionToDestroy() {
      return new UserPermissions(
        this.currentTenant,
        this.currentUser
      ).destroy
    },

    hasPermissionToEdit() {
      return new UserPermissions(
        this.currentTenant,
        this.currentUser
      ).edit
    },

    fields() {
      return fields
    }
  },

  mounted() {
    this.doMountTable(this.$refs.table)
  },

  methods: {
    ...mapActions({
      doChangeSort: 'user/list/doChangeSort',
      doMountTable: 'user/list/doMountTable',
      doDestroy: 'user/destroy/doDestroy'
    }),

    roleDescriptionOf(roleId) {
      return Roles.descriptionOf(roleId)
    },

    roleLabelOf(roleId) {
      return Roles.labelOf(roleId)
    },

    presenter(row, fieldName) {
      return UserModel.presenter(row, fieldName)
    },

    async doDestroyWithConfirm(id) {
      try {
        await ConfirmDialog({
          title: i18n('common.confirm'),
          message: i18n('common.areYouSure'),
          confirmButtonText: i18n('common.yes'),
          cancelButtonText: i18n('common.no')
        })

        return this.doDestroy(id)
      } catch (error) {
        // no
      }
    },

    rowClass({ row }) {
      const isSelected =
        this.selectedRows.find((r) => r.id === row.id) !==
        undefined
      return isSelected ? 'is-selected' : ''
    }
  }
}
</script>

<style lang="scss">
.user-list-table {
  @apply relative;
  .el-table {
    @apply mt-0 border-t-0;

    th {
      @apply pb-4;
    }

    .el-table-column--selection {
      .cell {
        @apply p-0 pl-4;
      }
    }
  }
}
</style>
