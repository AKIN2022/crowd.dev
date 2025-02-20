<template>
  <div v-if="activity.title || activity.body">
    <div v-if="activity.title && displayTitle">
      <span class="block title" :class="titleClasses">{{
        activity.title
      }}</span>
    </div>
    <div
      v-if="activity.title && activity.body && displayTitle"
      class="mt-3"
    ></div>
    <div class="content">
      <app-activity-discord-content
        v-if="
          activity.body && activity.platform === 'discord'
        "
        ref="content"
        :activity="activity"
        :display-body="displayBody"
        :display-thread="displayThread"
        :body-class="
          showMore && !more ? `text-limit-${limit}` : ''
        "
      />
      <app-activity-devto-content
        v-else-if="
          activity.body && activity.platform === 'devto'
        "
        ref="content"
        :activity="activity"
        :display-body="displayBody"
        :display-thread="displayThread"
        :body-class="
          showMore && !more ? `text-limit-${limit}` : ''
        "
      />
      <div v-else-if="activity.body">
        <blockquote
          v-if="activity.thread && displayThread"
          class="relative px-3 border-l-4 text-gray-500 border-gray-200 text-xs leading-5 mb-4"
          v-html="activity.thread.body"
        />
        <span
          v-if="
            activity.type === 'reaction_added' &&
            displayBody
          "
          v-html="renderEmoji(activity.body)"
        />
        <span
          v-else-if="displayBody"
          ref="body"
          class="block whitespace-pre-wrap custom-break-all activity-body"
          :class="
            showMore && !more ? `text-limit-${limit}` : ''
          "
          v-html="activity.body"
        />
      </div>
    </div>
    <div class="flex justify-between items-center">
      <div>
        <div
          v-if="displayShowMore"
          class="text-sm text-brand-500 mt-6 cursor-pointer"
          @click.stop="more = !more"
        >
          Show {{ more ? 'less' : 'more' }}
        </div>
      </div>
      <div>
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
import joypixels from 'emoji-toolkit'
import integrationsJsonArray from '@/jsons/integrations.json'
import AppActivityDiscordContent from '@/modules/activity/components/integrations/discord/activity-discord-content'
import AppActivityDevtoContent from '@/modules/activity/components/integrations/devto/activity-devto-content'

export default {
  name: 'AppActivityContent',
  components: {
    AppActivityDevtoContent,
    AppActivityDiscordContent
  },
  props: {
    activity: {
      type: Object,
      required: true
    },
    // classes to bind to title
    titleClasses: {
      type: String,
      required: false,
      default: ''
    },
    // if display show more and limit content
    showMore: {
      type: Boolean,
      required: false,
      default: false
    },
    // number of lines limited when showMore is enabled
    limit: {
      type: Number,
      required: false,
      default: 4
    },
    // if title is displayed
    displayTitle: {
      type: Boolean,
      required: false,
      default: true
    },
    // if thread is displayed
    displayThread: {
      type: Boolean,
      required: false,
      default: true
    },
    // if body is displayed
    displayBody: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  data() {
    return {
      more: false,
      displayShowMore: false
    }
  },
  computed: {
    platform() {
      return integrationsJsonArray.find(
        (i) => i.platform === this.activity.platform
      )
    }
  },
  mounted() {
    if (this.showMore) {
      if (this.$refs.body) {
        const body = this.$refs.body
        const height = body.clientHeight
        const scrollHeight = body.scrollHeight
        this.displayShowMore = scrollHeight > height
      } else if (this.$refs.content) {
        const content = this.$refs.content
        if (content.$refs.body) {
          const body = content.$refs.body
          const height = body.clientHeight
          const scrollHeight = body.scrollHeight
          this.displayShowMore = scrollHeight > height
        }
      }
    }
  },
  methods: {
    renderEmoji(message) {
      return joypixels.toImage(`:${message}:`)
    }
  }
}
</script>

<style scoped lang="scss">
.content::v-deep {
  a {
    @apply text-brand-500;
  }
}
</style>
