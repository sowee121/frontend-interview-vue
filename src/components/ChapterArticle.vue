<script setup lang="ts">
import type { ChapterPayload } from '@/types/qa-content'

import QaSection from '@/components/QaSection.vue'

defineProps<{
  payload: ChapterPayload
}>()
</script>

<template>
  <h1>{{ payload.title }}</h1>
  <p class="article__lead">
    {{ payload.lead }}
    <a
      v-if="payload.leadLink"
      :href="payload.leadLink.href"
      target="_blank"
      rel="noopener noreferrer"
    >{{ payload.leadLink.label }}</a>
  </p>
  <QaSection
      v-for="q in payload.items"
      :key="q.id"
      :item="q"
      :syntax-highlight-mode="'coding-functions'"
    />
</template>
