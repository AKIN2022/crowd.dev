<template>
  <app-cube-render
    :query="sentimentQuery(period, platform)"
  >
    <template #loading>
      <div class="pb-3">
        <app-loading height="8px"></app-loading>
      </div>
      <div class="flex justify-between pb-2">
        <p class="text-sm font-medium">Positive</p>
        <app-loading
          class="py-1"
          height="12px"
          width="40px"
        ></app-loading>
      </div>
      <div class="flex justify-between pb-2">
        <p class="text-sm font-medium">Negative</p>
        <app-loading
          class="py-1"
          height="12px"
          width="40px"
        ></app-loading>
      </div>
    </template>
    <template #default="{ resultSet }">
      <div>
        <div v-if="!loadingData(resultSet)">
          <div class="flex w-full pb-3">
            <div
              v-for="data of compileData(resultSet)"
              :key="data.type"
              class="h-2 border-l border-r rounded-sm transition"
              :style="{
                width: `${calculatePercentage(data.count)}%`
              }"
              :class="[
                hoverSentimentClass(data.type),
                typeClasses[data.type]
              ]"
              @mouseover="hoveredSentiment = data.type"
              @mouseleave="hoveredSentiment = ''"
            ></div>
          </div>
          <div>
            <div
              v-for="data of compileData(resultSet)"
              :key="data.type"
              class="flex justify-between pb-2"
              :class="hoverSentimentClass(data.type)"
              @mouseover="hoveredSentiment = data.type"
              @mouseleave="hoveredSentiment = ''"
            >
              <p class="text-sm font-medium capitalize">
                {{ data.type }}
              </p>
              <p class="text-xs text-gray-600 text-right">
                {{ data.count }}・{{
                  calculatePercentage(data.count)
                }}%
              </p>
            </div>
          </div>
        </div>
        <div
          v-else-if="noData"
          class="text-xs italic text-gray-400"
        >
          No data
        </div>
      </div>
    </template>
  </app-cube-render>
</template>

<script>
import { mapGetters } from 'vuex'
import { sentimentQuery } from '@/modules/dashboard/dashboard.cube'
import AppCubeRender from '@/shared/cube/cube-render'
import AppLoading from '@/shared/loading/loading-placeholder'
export default {
  name: 'AppDashboardActivitySentiment',
  components: {
    AppLoading,
    AppCubeRender
  },
  data() {
    return {
      hoveredSentiment: '',
      sentimentQuery,
      total: 0,
      typeClasses: {
        positive: 'bg-green-500',
        negative: 'bg-red-500',
        neutral: 'bg-gray-300'
      }
    }
  },
  computed: {
    ...mapGetters('dashboard', ['period', 'platform'])
  },
  methods: {
    calculatePercentage(count) {
      return Math.round((count / this.total) * 100)
    },
    hoverSentimentClass(type) {
      return this.hoveredSentiment !== type &&
        this.hoveredSentiment !== ''
        ? 'opacity-50'
        : ''
    },
    loadingData(resultSet) {
      return (
        !resultSet || resultSet.loadResponse === undefined
      )
    },
    noData(resultSet) {
      return this.loadingData(resultSet) && this.total === 0
    },
    compileData(resultSet) {
      const seriesNames = resultSet.seriesNames()
      const pivot = resultSet.chartPivot()
      let series = []
      seriesNames.forEach((e) => {
        const data = pivot.map((p) => [p['x'], p[e.key]])
        series = [...series, ...data]
      })
      const seriesObject = series.reduce(
        (a, [key, value]) => ({
          ...a,
          [key]: value
        }),
        {}
      )
      const result = {
        positive: seriesObject['positive'] || 0,
        negative: seriesObject['negative'] || 0,
        neutral: seriesObject['neutral'] || 0
      }
      const finalResult = Object.entries(result)
        .sort(([, a], [, b]) => b - a)
        .map(([type, count]) => ({
          type,
          count
        }))
        .filter(({ count }) => count > 0)

      this.total = finalResult.reduce((a, b) => {
        return a + b.count
      }, 0)

      return finalResult
    }
  }
}
</script>
