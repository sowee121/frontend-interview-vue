<script setup lang="ts">
import { computed } from 'vue'
import type { RichSegment, SyntaxHighlightMode } from '@/types/qa-content'

import FunctionCodeBlock from '@/components/FunctionCodeBlock.vue'
import {
  isNumberedStepParagraph,
  splitNumberedParagraphs,
} from '@/utils/splitNumberedParagraphs'

const props = withDefaults(
  defineProps<{
    paragraphs: RichSegment[][]
    syntaxHighlightMode?: SyntaxHighlightMode
  }>(),
  { syntaxHighlightMode: 'off' },
)

const displayParagraphs = computed(() =>
  splitNumberedParagraphs(props.paragraphs),
)

function shouldRenderFunctionBlock(segments: RichSegment[]): boolean {
  if (props.syntaxHighlightMode !== 'coding-functions') return false
  if (segments.length !== 1) return false
  const s = segments[0]!
  if (s.type !== 'code') return false
  if (s.highlight === false) return false
  // 编程题答案全部为 code：单段一律块级展示（说明写在源码注释里）
  return true
}
</script>

<template>
  <div class="qa-block__answer">
    <template v-for="(segments, pi) in displayParagraphs" :key="pi">
      <FunctionCodeBlock
        v-if="shouldRenderFunctionBlock(segments)"
        :raw-code="(segments[0] as Extract<RichSegment, { type: 'code' }>).value"
      />
      <p
        v-else
        :class="{ 'qa-block__answer-step': isNumberedStepParagraph(segments) }"
      >
        <template v-for="(seg, si) in segments" :key="`${pi}-${si}`">
          <strong v-if="seg.type === 'strong'">{{ seg.value }}</strong>
          <code v-else-if="seg.type === 'code'">{{ seg.value }}</code>
          <template v-else>{{ seg.value }}</template>
        </template>
      </p>
    </template>
  </div>
</template>
