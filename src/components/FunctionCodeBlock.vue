<script setup lang="ts">
import hljsVuePlugin from '@highlightjs/vue-plugin'
import { ref, watch } from 'vue'

import { formatJsSnippet } from '@/utils/formatJsSnippet'

const HighlightJs = hljsVuePlugin.component

const props = defineProps<{
  rawCode: string
}>()

const displayCode = ref(props.rawCode)

watch(
  () => props.rawCode,
  async (src) => {
    displayCode.value = await formatJsSnippet(src)
  },
  { immediate: true },
)
</script>

<template>
  <figure class="function-code-block">
    <HighlightJs language="javascript" :code="displayCode" :autodetect="false" />
  </figure>
</template>

<style scoped lang="scss">
@use '@/assets/styles/variables' as *;

.function-code-block {
  margin: 0.5rem 0 0.85rem;
  min-width: 0;

  &:first-child {
    margin-top: 0;
  }

  &:last-child {
    margin-bottom: 0;
  }
}

.function-code-block :deep(pre) {
  margin: 0;
  padding: 0;
  border-radius: 4px;
  background: #f6f8fa;
  box-shadow: 0 1px 0 rgba(27, 31, 35, 0.04);
  overflow: hidden;
}

.function-code-block :deep(code.hljs) {
  display: block;
  overflow-x: auto;
  padding: 0.85rem 1rem;
  font-family: $mono;
  font-size: 0.8125rem;
  line-height: 1.55;
  tab-size: 2;
  font-variant-ligatures: none;
  background: transparent !important;
}
</style>
