<template>
  <el-select
    ref="input"
    :disabled="disabled"
    :loading="loading"
    :remote-method="handleSearch"
    :model-value="modelValue"
    :clearable="true"
    :default-first-option="true"
    :filterable="true"
    :multiple="true"
    :placeholder="placeholder || ''"
    :remote="true"
    :reserve-keyword="false"
    :allow-create="allowCreate"
    value-key="id"
    :class="inputClass"
    @change="onChange"
    @remove-tag="(tag) => $emit('remove-tag', tag)"
  >
    <el-option
      v-show="showCreateSuggestion"
      :label="currentQuery"
      :created="true"
    >
      <span class="prefix">{{ createPrefix }}</span>
      <span>{{ currentQuery }}</span>
    </el-option>
    <el-option
      v-for="record in localOptions"
      :key="record.id"
      :label="record.label"
      :value="record"
    >
    </el-option>
  </el-select>
</template>

<script>
import isString from 'lodash/isString'

const AUTOCOMPLETE_SERVER_FETCH_SIZE = 100

export default {
  name: 'AppAutocompleteManyInput',

  props: {
    modelValue: {
      type: Array,
      default: () => []
    },
    placeholder: {
      type: String,
      default: null
    },
    fetchFn: {
      type: Function,
      default: () => {}
    },
    mapperFn: {
      type: Function,
      default: () => {}
    },
    createFn: {
      type: Function,
      default: () => {}
    },
    disabled: {
      type: Boolean,
      default: false
    },
    createIfNotFound: {
      type: Boolean,
      default: false
    },
    createPrefix: {
      type: String,
      default: 'Create'
    },
    inputClass: {
      type: String,
      default: ''
    },
    allowCreate: {
      type: Boolean,
      default: false
    },
    options: {
      type: Array,
      default: () => []
    }
  },
  emits: ['remove-tag', 'update:modelValue'],
  data() {
    return {
      loading: false,
      localOptions: this.options ? this.options : [],
      currentQuery: ''
    }
  },

  computed: {
    showCreateSuggestion() {
      return (
        this.createIfNotFound &&
        this.currentQuery !== '' &&
        !this.localOptions.some(
          (o) =>
            o.label === this.currentQuery ||
            o === this.currentQuery
        )
      )
    }
  },

  async created() {
    await this.fetchAllResults()
  },

  methods: {
    async onChange(value) {
      const query = this.$refs.input.query
      if (value.length === 0) {
        this.$emit('update:modelValue', [])
      }
      const promises = value.map(async (item) => {
        if (
          item === false &&
          query !== '' &&
          this.createIfNotFound
        ) {
          // item is created/typed from user
          const newItem = await this.createFn(query)
          this.localOptions.push(newItem)
          return newItem
        } else {
          return item
        }
      })
      Promise.all(promises).then((values) => {
        this.$emit('update:modelValue', values)
      })
    },

    async handleSearch(value) {
      if (!isString(value) && value === '') {
        return
      }

      await this.handleServerSearch(value)
      this.localOptions.filter((item) =>
        String(item.label || '')
          .toLowerCase()
          .includes(String(value || '').toLowerCase())
      )
    },

    async fetchAllResults() {
      this.loading = true

      try {
        this.localOptions = await this.fetchFn()
        this.loading = false
      } catch (error) {
        console.error(error)
        this.loading = false
      }
    },

    async handleServerSearch(value) {
      if (value === this.currentQuery) {
        return
      }

      this.currentQuery = value
      this.loading = true

      try {
        this.localOptions = await this.fetchFn(
          value,
          AUTOCOMPLETE_SERVER_FETCH_SIZE
        )

        this.loading = false
      } catch (error) {
        console.error(error)
        this.localOptions = []
        this.loading = false
      }
    }
  }
}
</script>

<style></style>
