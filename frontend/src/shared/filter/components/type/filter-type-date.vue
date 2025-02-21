<template>
  <div class="filter-with-operator-and-input">
    <app-inline-select-input
      v-model="operator"
      popper-placement="bottom-start"
      prefix="Date:"
      class="mb-2"
      :options="computedOperatorOptions"
    />
    <el-date-picker
      ref="inputRef"
      v-model="model"
      placeholder="Select a date"
      value-format="YYYY-MM-DD"
      format="YYYY-MM-DD"
      class="custom-date-picker"
      popper-class="date-picker-popper"
      v-bind="betweenProps"
      :disabled="
        operator === 'is_empty' ||
        operator === 'is_not_empty'
      "
    ></el-date-picker>
  </div>
</template>

<script>
export default {
  name: 'AppFilterTypeDate'
}
</script>

<script setup>
import {
  computed,
  defineEmits,
  defineProps,
  watch,
  ref
} from 'vue'

import filterOperators from '../../helpers/operators'

const props = defineProps({
  value: {
    type: String,
    default: null
  },
  operator: {
    type: String,
    default: null
  },
  isExpanded: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits([
  'update:value',
  'update:operator'
])

const betweenProps = computed(() => {
  return operator.value !== 'between'
    ? {}
    : {
        type: 'daterange',
        'range-separator': 'To',
        'start-placeholder': 'Start date',
        'end-placeholder': 'End date'
      }
})

const model = computed({
  get() {
    return props.value
  },
  set(v) {
    emit('update:value', v)
  }
})
const operator = computed({
  get() {
    return props.operator
  },
  set(v) {
    emit('update:operator', v)
  }
})
const expanded = computed(() => props.isExpanded)
const computedOperatorOptions = computed(() => {
  return Object.keys(filterOperators.date.operator).map(
    (o) => {
      return {
        value: o,
        label: filterOperators.date.operator[o]
      }
    }
  )
})
const inputRef = ref(null)

watch(expanded, async (newValue) => {
  setTimeout(() => {
    if (newValue) {
      inputRef.value.handleOpen()
    }
  }, 500)
})
</script>
