<script setup lang="ts">
import ChapterCard from '@/components/ChapterCard.vue'
import SiteFooter from '@/components/SiteFooter.vue'
import SiteHeader from '@/components/SiteHeader.vue'
import { chapters } from '@/data/chapters'
</script>

<template>
  <SiteHeader />
  <div class="layout-home">
    <div class="layout-home-inner">
      <main class="content">
        <article>
          <h1>目录</h1>
          <p class="lead">每章几道常考题，直白好记。章内目录可跳转。</p>
          <div class="home-grid">
            <ChapterCard v-for="ch in chapters" :key="ch.slug" :chapter="ch" />
          </div>
        </article>
      </main>
    </div>
  </div>
  <SiteFooter />
</template>
