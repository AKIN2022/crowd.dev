<template>
  <el-drawer
    v-model="drawerModel"
    size="35%"
    :custom-class="
      isEditingAttributes
        ? 'test'
        : 'manage-attribute-drawer'
    "
  >
    <template #header>
      <div>
        <el-button
          v-if="isEditingAttributes"
          class="btn btn-link btn-link--md btn-link--secondary mb-2"
          @click="onCloseManageAttributes"
          ><i class="ri-arrow-left-s-line"></i
          ><span>Edit attributes</span></el-button
        >
        <h5 class="text-black">
          {{
            !isEditingAttributes
              ? 'Edit attributes'
              : 'Manage global attributes'
          }}
        </h5>
        <el-button
          v-if="!isEditingAttributes"
          class="btn btn-link btn-link--sm btn-link--primary"
          @click="onOpenManageAttributes"
          >Manage global attributes</el-button
        >
      </div>
    </template>
    <template #default>
      <div v-if="!isEditingAttributes">
        <app-member-form-attributes
          v-model="memberModel"
          :show-header="false"
          :attributes="computedAttributes"
          :record="member"
        />
      </div>
      <app-member-form-global-attributes
        v-else
        v-model="isEditingAttributes"
      />
    </template>
    <template v-if="!isEditingAttributes" #footer>
      <div
        class="flex w-full justify-end"
        :class="
          hasFormChanged ? 'justify-between' : 'justify-end'
        "
      >
        <el-button
          v-if="hasFormChanged"
          class="btn btn-link btn-link--primary"
          @click="handleReset"
          ><i class="ri-arrow-go-back-line"></i>
          <span>Reset changes</span></el-button
        >
        <div class="flex gap-4">
          <el-button
            :disabled="loading"
            class="btn btn--md btn--bordered"
            @click="handleCancel"
            >Cancel</el-button
          >
          <el-button
            :disabled="!hasFormChanged || loading"
            type="primary"
            class="btn btn--md btn--primary"
            :loading="loading"
            @click="handleSubmit"
            >Update</el-button
          >
        </div>
      </div>
    </template>
  </el-drawer>
</template>

<script>
export default {
  name: 'AppMemberManageIdentitiesDrawer'
}
</script>

<script setup>
import { useStore } from 'vuex'
import {
  ref,
  defineEmits,
  defineProps,
  computed
} from 'vue'
import Message from '@/shared/message/message'
import AppMemberFormAttributes from './form/member-form-attributes'
import AppMemberFormGlobalAttributes from './form/member-form-global-attributes'
import { MemberService } from '@/modules/member/member-service'
import getAttributesModel from '@/shared/attributes/get-attributes-model.js'
import getParsedAttributes from '@/shared/attributes/get-parsed-attributes.js'
import isEqual from 'lodash/isEqual'
import cloneDeep from 'lodash/cloneDeep'

const store = useStore()
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  member: {
    type: Object,
    default: () => {}
  }
})
const emit = defineEmits(['update:modelValue'])

const loading = ref(false)
const isEditingAttributes = ref(false)

const computedAttributes = computed(() =>
  Object.values(store.state.member.customAttributes).filter(
    (attribute) => attribute.show
  )
)
const drawerModel = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})
const initialModel = computed(() => {
  const attributes = getAttributesModel(props.member)

  return {
    ...props.member,
    ...(Object.keys(attributes).length && attributes)
  }
})
const memberModel = ref(cloneDeep(initialModel.value))

const hasFormChanged = computed(() => {
  return !isEqual(
    cloneDeep(initialModel.value),
    memberModel.value
  )
})

const handleReset = () => {
  memberModel.value = cloneDeep(initialModel.value)
}

const handleCancel = () => {
  emit('update:modelValue', false)
}

const handleSubmit = async () => {
  loading.value = true

  const formattedAttributes = getParsedAttributes(
    computedAttributes.value,
    memberModel.value
  )

  await MemberService.update(props.member.id, {
    attributes: formattedAttributes
  })
  await store.dispatch('member/doFind', props.member.id)
  Message.success('Member attributes updated successfully')
  emit('update:modelValue', false)
}

const onOpenManageAttributes = () => {
  isEditingAttributes.value = true
}

const onCloseManageAttributes = () => {
  isEditingAttributes.value = false
}
</script>

<style lang="scss">
.manage-attribute-drawer {
  .el-form-item,
  .el-form-item__content {
    @apply mb-0;
  }
}

.test {
  & .el-drawer__header {
    @apply p-6;
  }

  & .el-drawer__body {
    @apply p-0;
  }

  & .el-drawer__footer {
    @apply w-full p-6 border-t border-gray-200;
  }

  & .attribute-type {
    width: 100px;
  }

  & .el-form-item,
  .el-form .el-form-item__content {
    @apply mb-0;
  }
}
</style>
