<template>
  <div class="widget-table">
    <app-widget
      :config="config"
      :editable="editable"
      @trigger-duplicate-widget="
        (widget) =>
          $emit('trigger-duplicate-widget', widget)
      "
      @trigger-edit-widget="
        (widget) => $emit('trigger-edit-widget', widget)
      "
      @trigger-delete-widget="
        (widget) => $emit('trigger-delete-widget', widget)
      "
    >
      <div class="-mx-6 -mt-6">
        <el-table v-if="data" :data="items">
          <el-table-column
            v-for="column in columns"
            :key="column"
            :label="column"
          >
            <template #default="scope">
              {{ scope.row[column] }}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </app-widget>
  </div>
</template>

<script>
import Widget from '@/modules/widget/components/widget'

export default {
  name: 'AppWidgetTable',
  components: {
    'app-widget': Widget
  },
  props: {
    config: {
      type: Object,
      default: () => {}
    },
    editable: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default: () => [],
      required: true
    }
  },
  emits: [
    'trigger-duplicate-widget',
    'trigger-delete-widget',
    'trigger-edit-widget'
  ],
  computed: {
    items() {
      return this.data.map((key) => {
        return key
      })
    },
    columns() {
      return this.data.length !== 0
        ? Object.keys(this.data[0])
        : []
    }
  }
}
</script>

<style lang="scss">
.widget-table {
  .widget {
    @apply pb-0;
    .el-table tbody tr:last-child td {
      @apply border-b-0;
    }
    .el-table::before {
      @apply hidden;
    }
  }
}
</style>
