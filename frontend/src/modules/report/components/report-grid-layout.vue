<template>
  <div
    class="report-grid-layout flex-grow"
    :class="
      editable ? 'report-grid-layout--editing' : '-m-2'
    "
  >
    <app-widget-cube-builder
      v-if="widgetDrawer.visible === true"
      v-model:widget="widgetDrawer.model"
      v-model:drawer="widgetDrawer.visible"
      @submit="handleWidgetFormSubmit"
    />
    <div
      v-if="loadingCube"
      v-loading="loadingCube"
      class="app-page-spinner"
    ></div>
    <div v-else>
      <div
        v-if="!model.widgets || model.widgets.length === 0"
        class="text-black flex flex-col items-center justify-center rounded border border-dashed border-gray-200 p-12 mx-4 my-8"
      >
        <i
          class="ri-bar-chart-line ri-6x text-gray-200"
        ></i>
        <div class="font-semibold mt-8 mb-4">
          Add your first widget
        </div>
        <div class="text-sm text-gray-600">
          {{
            editable
              ? 'Build a custom widget and start composing your report'
              : 'Edit your report and compose your first custom widget'
          }}
        </div>
        <el-button
          v-if="editable"
          type="button"
          class="btn btn--primary btn--md !h-10 mt-6"
          @click="handleAddWidgetClick"
        >
          Add Widget
        </el-button>
        <router-link
          v-else
          :to="{
            name: 'reportEdit',
            params: { id: modelValue.id }
          }"
          class="btn btn--primary btn--md mt-6 !hover:text-white"
        >
          Edit report
        </router-link>
      </div>
      <div v-else>
        <grid-layout
          v-model:layout="layout"
          :col-num="12"
          :row-height="8"
          :is-draggable="editable"
          :is-resizable="editable"
          :is-mirrored="false"
          :vertical-compact="true"
          :margin="[16, 16]"
          :use-css-transforms="true"
        >
          <grid-item
            v-for="item in layout"
            :key="item.i"
            :x="item.x"
            :y="item.y"
            :w="item.w"
            :h="item.h"
            :i="item.i"
            @move="
              (i, newX, newY) =>
                handleWidgetMove(
                  widgets[item.i],
                  newX,
                  newY
                )
            "
            @resize="
              (i, newH, newW) =>
                handleWidgetResize(
                  widgets[item.i],
                  newH,
                  newW
                )
            "
          >
            <app-widget-cube-renderer
              :editable="editable"
              :widget="widgets[item.i]"
              :chart-options="widgets[item.i]"
              @edit="handleWidgetEdit(widgets[item.i])"
              @duplicate="
                handleWidgetDuplicate(widgets[item.i])
              "
              @delete="handleWidgetDelete(widgets[item.i])"
            ></app-widget-cube-renderer>
          </grid-item>
        </grid-layout>
        <div v-if="editable" class="toolbar">
          <button
            type="button"
            class="btn btn-brand btn-brand--transparent btn--md"
            @click="handleAddWidgetClick"
          >
            <span class="flex items-center text-brand-500">
              <i class="ri-lg ri-add-line mr-1"></i>Add
              Widget
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import WidgetCubeRenderer from '@/modules/widget/components/cube/widget-cube-renderer'
import WidgetCubeBuilder from '@/modules/widget/components/cube/widget-cube-builder'
import { WidgetService } from '@/modules/widget/widget-service'
import { i18n } from '@/i18n'
import ConfirmDialog from '@/shared/confirm-dialog/confirm-dialog.js'

export default {
  name: 'ReportGridLayout',
  components: {
    'app-widget-cube-builder': WidgetCubeBuilder,
    'app-widget-cube-renderer': WidgetCubeRenderer
  },
  props: {
    modelValue: {
      type: Object,
      default: () => {}
    },
    editable: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close'],

  data() {
    return {
      model: { ...this.modelValue },
      widgetDrawer: {
        visible: false,
        action: null,
        model: {}
      },
      layout: []
    }
  },

  computed: {
    ...mapGetters({
      cubejsToken: 'widget/cubejsToken',
      cubejsApi: 'widget/cubejsApi'
    }),
    loadingCube() {
      return this.cubejsToken === null
    },
    widgets() {
      return this.model.widgets.reduce((acc, item) => {
        item.settings.layout.i = item.id
        acc[item.id] = item
        return acc
      }, {})
    }
  },

  async created() {
    if (this.cubejsApi === null) {
      await this.getCubeToken()
    }
    this.resetWidgetModel()
    this.updateLayout()
  },

  methods: {
    ...mapActions({
      getCubeToken: 'widget/getCubeToken'
    }),
    handleAddWidgetClick() {
      this.widgetDrawer = {
        visible: true,
        action: 'add',
        model: JSON.parse(
          JSON.stringify({
            title: 'Untitled',
            type: 'cubejs',
            reportId: this.modelValue.id
              ? this.modelValue.id
              : undefined,
            settings: {}
          })
        )
      }
    },

    async createWidget(widgetModel, duplicate = false) {
      const length = this.model.widgets.length
      widgetModel.settings.layout = {
        x: (length * 6) % 12,
        y: length + 12, // puts it at the bottom
        w: 6,
        h: widgetModel.settings.layout.h
      }
      return await WidgetService.create({
        title: duplicate
          ? widgetModel.title + ' [Copy]'
          : widgetModel.title,
        type: 'cubejs',
        settings: widgetModel.settings,
        report: widgetModel.reportId
      })
    },

    async handleWidgetFormSubmit(widgetModel) {
      if (this.widgetDrawer.action === 'add') {
        const widget = await this.createWidget(widgetModel)
        this.model.widgets.push(widget)
        this.resetWidgetModel()
      } else {
        const widget = await WidgetService.update(
          widgetModel.id,
          widgetModel
        )
        const index = this.model.widgets.findIndex(
          (w) => w.id === widget.id
        )
        this.model.widgets[index] = widget
        this.resetWidgetModel()
      }

      this.updateLayout()
    },

    async handleWidgetDuplicate(widget) {
      const result = await this.createWidget(widget, true)
      this.model.widgets.push(result)

      this.updateLayout()
    },

    async handleWidgetMove(widget, newX, newY) {
      widget.settings.layout.x = newX
      widget.settings.layout.y = newY

      await WidgetService.update(widget.id, widget)
    },

    async handleWidgetResize(widget, newH, newW) {
      widget.settings.layout.h = newH
      widget.settings.layout.w = newW

      await WidgetService.update(widget.id, widget)
    },

    async handleWidgetEdit(widget) {
      this.widgetDrawer = {
        action: 'edit',
        model: JSON.parse(JSON.stringify(widget))
      }

      setTimeout(() => {
        this.widgetDrawer.visible = true
      }, 200)
    },
    async handleWidgetDelete(widget) {
      try {
        await ConfirmDialog({
          title: i18n('common.confirm'),
          message: i18n('common.areYouSure'),
          confirmButtonText: i18n('common.yes'),
          cancelButtonText: i18n('common.no')
        })

        await WidgetService.destroyAll([widget.id])
        const index = this.model.widgets.findIndex(
          (w) => w.id === widget.id
        )
        this.model.widgets.splice(index, 1)
        this.updateLayout()
      } catch (error) {
        // no
      }
    },
    resetWidgetModel() {
      this.widgetDrawer.model = {
        title: 'Untitled',
        type: 'cubejs',
        reportId: this.modelValue.id
          ? this.modelValue.id
          : undefined
      }
    },
    updateLayout() {
      this.layout = this.model.widgets.map((w) => {
        return {
          ...w.settings.layout,
          i: w.id
        }
      })
      for (const widget of this.layout) {
        this.widgets[widget.i].settings.layout = widget
      }
    }
  }
}
</script>

<style lang="scss">
.report-grid-layout {
  @apply min-h-40 relative;
}
.vue-grid-item:not(.vue-grid-placeholder) {
  touch-action: none;
}
.vue-grid-item.vue-grid-placeholder {
  background: green !important;
}
.vue-grid-item .resizing {
  opacity: 0.9;
}
.vue-grid-item .static {
  background: #cce;
}
.vue-grid-item .text {
  font-size: 24px;
  text-align: center;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  height: 100%;
  width: 100%;
}
.vue-grid-item .no-drag {
  height: 100%;
  width: 100%;
}
.vue-grid-item .minMax {
  font-size: 12px;
}
.vue-grid-item .add {
  cursor: pointer;
}
.vue-draggable-handle {
  position: absolute;
  width: 20px;
  height: 20px;
  top: 0;
  left: 0;
  background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10'><circle cx='5' cy='5' r='5' fill='#999999'/></svg>")
    no-repeat;
  background-position: bottom right;
  padding: 0 8px 8px 0;
  background-repeat: no-repeat;
  background-origin: content-box;
  box-sizing: border-box;
  cursor: pointer;
}
.vue-grid-item > .vue-resizable-handle {
  position: absolute;
  width: 20px;
  height: 20px;
  bottom: 5px;
  right: -8px;
}

.toolbar {
  @apply flex items-center justify-center pb-4;
}
</style>
