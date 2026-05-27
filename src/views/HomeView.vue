<script setup lang="ts">
import ChapterCard from '@/components/ChapterCard.vue'
import SiteFooter from '@/components/SiteFooter.vue'
import SiteHeader from '@/components/SiteHeader.vue'
import { chapters } from '@/data/chapters'
</script>

<template>
  <SiteHeader />
  <div class="layout-home">
    <div class="layout-home__inner">
      <main class="layout-home__content">
        <article>
          <h1 class="layout-home__title">目录</h1>
          <p class="layout-home__lead">每章精选高频面试题，配清晰答案，并附章内目录一键跳转。</p>
          <div class="layout-home__grid">
            <ChapterCard v-for="ch in chapters" :key="ch.slug" :chapter="ch" />
          </div>
        </article>
      </main>
    </div>
  </div>
  <SiteFooter />
</template>
