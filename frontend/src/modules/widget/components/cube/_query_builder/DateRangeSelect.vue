<template>
  <div class="w-full">
    <label
      class="block text-xs leading-none font-semibold mb-1"
      >Date Range
      <span class="text-brand-500 ml-0.5">*</span></label
    >
    <el-select
      :model-value="
        timeDimensions[0] &&
        dateRangeItems.find(
          (o) => o.value === timeDimensions[0].dateRange
        ).label
      "
      filterable
      value-key="label"
      class="w-full"
      @change="changeHandler"
    >
      <el-option
        v-for="item in dateRangeItems"
        :key="item.label"
        :value="item.value"
        :label="item.label"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  name: 'DateRangeSelect',
  props: {
    timeDimensions: {
      type: Array,
      default: () => []
    }
  },
  emits: ['change'],
  data() {
    return {
      dateRangeItems: [
        {
          value: 'Today',
          label: 'Today'
        },
        {
          value: 'Yesterday',
          label: 'Yesterday'
        },
        {
          value: 'This week',
          label: 'This week'
        },
        {
          value: 'This month',
          label: 'This month'
        },
        {
          value: 'This quarter',
          label: 'This quarter'
        },
        {
          value: 'This year',
          label: 'This year'
        },
        {
          value: 'Last 30 days',
          label: 'Last 30 days'
        },
        {
          value: 'Last year',
          label: 'Last year'
        },
        {
          value: undefined,
          label: 'All time'
        }
      ]
    }
  },
  methods: {
    changeHandler(item) {
      this.$emit('change', [
        {
          dimension: this.timeDimensions[0].dimension.name,
          granularity: this.timeDimensions[0].granularity,
          ...(item ? { dateRange: item } : null)
        }
      ])
    }
  }
}
</script>
