<script setup lang="ts">
import type { QaItem, SyntaxHighlightMode } from '@/types/qa-content'

import RichAnswer from '@/components/RichAnswer.vue'

withDefaults(
  defineProps<{
    item: QaItem
    syntaxHighlightMode?: SyntaxHighlightMode
  }>(),
  { syntaxHighlightMode: 'off' },
)
</script>

<template>
  <section :id="item.id" class="qa-block">
    <div class="qa-q-block">
      <h2 class="qa-q">{{ item.question }}</h2>
      <p v-if="item.questionNote" class="qa-q-note">{{ item.questionNote }}</p>
    </div>
    <RichAnswer :paragraphs="item.answer" :syntax-highlight-mode="syntaxHighlightMode" />
  </section>
</template>
