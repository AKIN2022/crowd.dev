<template>
  <div class="member-view-aside panel">
    <div>
      <div class="flex items-center justify-between">
        <div class="font-medium text-black">Identities</div>
        <el-button
          class="btn btn-link btn-link--primary"
          @click="identitiesDrawer = true"
          ><i class="ri-pencil-line" /><span
            >Edit</span
          ></el-button
        >
      </div>
      <div class="-mx-6 mt-6">
        <a
          v-for="platform of Object.keys(member.username)"
          :key="platform"
          class="px-6 py-2 flex justify-between items-center relative"
          :class="
            member.attributes.url &&
            member.attributes.url[platform] !== undefined
              ? 'hover:bg-gray-50 transition-colors cursor-pointer'
              : ''
          "
          :href="
            member.attributes.url &&
            member.attributes.url[platform]
          "
          target="_blank"
        >
          <div>
            <span
              class="btn cursor-auto p-2 bg-gray-100 border border-gray-200 mr-3"
              :class="`btn--${platform}`"
            >
              <img
                :src="findIcon(platform)"
                :alt="`${platform}-icon`"
                class="w-4 h-4"
              />
            </span>
            <span class="text-gray-900 text-xs">
              {{ member.username[platform] }}</span
            >
          </div>
          <i
            v-if="
              member.attributes.url &&
              member.attributes.url[platform]
            "
            class="ri-external-link-line text-gray-300"
          ></i>
        </a>
      </div>
    </div>
    <div class="mt-10">
      <div class="flex items-center justify-between">
        <div class="font-medium text-black">Attributes</div>
        <el-button
          class="btn btn-link btn-link--primary"
          @click="attributesDrawer = true"
          ><i class="ri-pencil-line" /><span
            >Edit</span
          ></el-button
        >
      </div>
      <div
        v-if="!computedCustomAttributes.length"
        class="py-3 text-gray-500 text-xs italic"
      >
        No attributes defined
      </div>
      <div
        v-for="attribute of computedCustomAttributes"
        v-else
        :key="attribute.id"
        class="py-3 border-b border-gray-200 last:border-none"
      >
        <p class="text-gray-400 font-medium text-2xs">
          {{ attribute.label }}
        </p>
        <p class="mt-1 text-gray-900 text-xs">
          {{
            formattedComputedAttributeValue(
              member.attributes[attribute.name].default
            )
          }}
        </p>
      </div>
    </div>
    <app-member-manage-identities-drawer
      v-model="identitiesDrawer"
      :member="member"
    />
    <app-member-manage-attributes-drawer
      v-if="attributesDrawer"
      v-model="attributesDrawer"
      :member="member"
    />
  </div>
</template>

<script>
export default {
  name: 'AppMemberViewAside'
}
</script>

<script setup>
import { useStore } from 'vuex'
import { computed, defineProps, ref } from 'vue'
import integrationsJsonArray from '@/jsons/integrations.json'
import AppMemberManageIdentitiesDrawer from '../member-manage-identities-drawer'
import AppMemberManageAttributesDrawer from '../member-manage-attributes-drawer'
import moment from 'moment'

const store = useStore()

const props = defineProps({
  member: {
    type: Object,
    default: () => {}
  }
})

const identitiesDrawer = ref(false)
const attributesDrawer = ref(false)

const computedCustomAttributes = computed(() => {
  return Object.values(
    store.state.member.customAttributes
  ).filter((attribute) => {
    return (
      attribute.show &&
      attribute.canDelete &&
      props.member.attributes[attribute.name]
    )
  })
})

const findIcon = (platform) => {
  return integrationsJsonArray.find(
    (p) => p.platform === platform
  ).image
}

const formattedComputedAttributeValue = (value) => {
  const dateFormat = 'YYYY-MM-DD'
  return moment(value, dateFormat, true).isValid()
    ? moment(value).format('YYYY-MM-DD')
    : value
}
</script>
