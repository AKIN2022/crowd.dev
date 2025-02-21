<template>
  <div class="member-view-header panel relative">
    <div class="flex items-start justify-between">
      <div class="flex items-start">
        <app-avatar
          :entity="member"
          size="xl"
          class="mr-4"
        />
        <div>
          <h5>{{ member.displayName }}</h5>
          <app-member-organizations
            class="mt-2"
            :member="member"
            orientation="horizontal"
          />
        </div>
      </div>
      <div class="flex items-center">
        <app-member-sentiment
          :member="member"
          class="mr-4"
        />
        <app-member-engagement-level
          :member="member"
          class="mr-4"
        />
        <app-member-dropdown
          :member="member"
          :show-view-member="false"
        />
      </div>
    </div>
    <div
      class="text-sm text-gray-600 py-6 border-b border-gray-200 mb-4"
    >
      {{ member.attributes.bio?.default }}
    </div>

    <div class="grid grid-rows-2 grid-flow-col gap-4">
      <div>
        <p class="text-gray-400 font-medium text-2xs">
          # of activities
        </p>
        <p class="mt-1 text-gray-900 text-xs">
          {{
            formattedInformation(
              member.activityCount,
              'number'
            )
          }}
        </p>
      </div>
      <div>
        <p class="text-gray-400 font-medium text-2xs">
          Location
        </p>
        <p class="mt-1 text-gray-900 text-xs">
          {{
            formattedInformation(
              member.attributes.location?.default,
              'string'
            )
          }}
        </p>
      </div>
      <div>
        <p class="text-gray-400 font-medium text-2xs">
          Member since
        </p>
        <p class="mt-1 text-gray-900 text-xs">
          {{
            formattedInformation(member.joinedAt, 'date')
          }}
        </p>
      </div>
      <div>
        <p class="text-gray-400 font-medium text-2xs">
          Reach
        </p>
        <p class="mt-1 text-gray-900 text-xs">
          {{
            formattedInformation(
              member.reach.total,
              'number'
            )
          }}
        </p>
      </div>
      <div>
        <p class="text-gray-400 font-medium text-2xs">
          Last activity
        </p>
        <p class="mt-1 text-gray-900 text-xs">
          {{
            formattedInformation(
              member.lastActivity?.createdAt,
              'relative'
            )
          }}
        </p>
      </div>
    </div>

    <div
      class="absolute inset-x-0 bottom-0 rounded-b-md bg-gray-50 p-6 mt-9"
    >
      <div class="text-sm">
        <app-tags :long="true" :member="member" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppMemberViewHeader'
}
</script>

<script setup>
import { defineProps } from 'vue'
import moment from 'moment/moment'

import AppMemberSentiment from '@/modules/member/components/member-sentiment'
import AppMemberEngagementLevel from '@/modules/member/components/member-engagement-level'
import AppMemberDropdown from '@/modules/member/components/member-dropdown'
import AppMemberOrganizations from '@/modules/member/components/member-organizations.vue'

import AppTags from '@/modules/tag/components/tag-list'

defineProps({
  member: {
    type: Object,
    default: () => {}
  }
})

const formattedDate = (timestamp) => {
  // If the timestamp is 1970, we show "-"
  if (
    moment(timestamp).isBefore(
      moment().subtract(40, 'years')
    )
  ) {
    return '-'
  }
  return moment(timestamp).format('YYYY-MM-DD')
}

const timeAgo = (timestamp) => {
  return moment(timestamp).fromNow()
}

const formattedNumber = (number) => {
  return number.toLocaleString('en-US')
}

const formattedInformation = (value, type) => {
  // Show dash for empty information
  if (
    value === undefined ||
    value === null ||
    value === -1
  ) {
    return '-'
  }

  // Render inforamation depending on type
  if (type === 'date') {
    return formattedDate(value)
  } else if (type === 'number') {
    return formattedNumber(value)
  } else if (type === 'relative') {
    return timeAgo(value)
  }

  return value
}
</script>

<style lang="scss">
.member-view-header.panel {
  @apply pb-24;
}
</style>
