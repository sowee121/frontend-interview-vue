<script setup lang="ts">
import { SITE_FOOTER_NOTE, SITE_GITHUB_URL } from '@/config/site'
</script>

<template>
  <footer class="site-footer">
    <p class="site-footer__note">{{ SITE_FOOTER_NOTE }}</p>
    <a
      class="site-footer__github"
      :href="SITE_GITHUB_URL"
      target="_blank"
      rel="noopener noreferrer"
    >
      GitHub 源码
    </a>
  </footer>
</template>
