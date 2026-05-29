<script setup lang="ts">
import {
  SITE_FOOTER_STACK,
  SITE_GITHUB_URL,
  SITE_PAGES_URL,
} from '@/config/site'
</script>

<template>
  <footer class="site-footer">
    <p class="site-footer__line">{{ SITE_FOOTER_STACK }}</p>
    <p class="site-footer__line">
      <a
        class="site-footer__link"
        :href="SITE_PAGES_URL"
        target="_blank"
        rel="noopener noreferrer"
      >
        Deploy to GitHub Pages
      </a>
      <span class="site-footer__sep" aria-hidden="true">·</span>
      <a
        class="site-footer__link"
        :href="SITE_GITHUB_URL"
        target="_blank"
        rel="noopener noreferrer"
      >
        GitHub
      </a>
    </p>
  </footer>
</template>
