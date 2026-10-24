<script setup lang="ts">
withDefaults(defineProps<{
  sizeClass?: string;
  color?: string;
}>(), {
  sizeClass: 'w-6 h-6',
  color: '#0A89CB'
});
</script>

<template>
  <svg 
    :class="sizeClass" 
    viewBox="16 12 169 176" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <g :fill="color">
      <!-- Outer Hexagonal Frame -->
      <path 
        fill-rule="evenodd" 
        clip-rule="evenodd" 
        d="M 100.5,16 L 173,58 L 173,142 L 100.5,184 L 28,142 L 28,58 Z M 100.5,27 L 37,63.5 L 37,136.5 L 100.5,173 L 164,136.5 L 164,63.5 Z" 
      />
      <!-- Center Building -->
      <polygon points="100.5,52 119,63 119,162.5 110,167.5 110,68 100.5,62.5 91,68 91,167.5 82,162.5 82,63" />
      <!-- Left Building -->
      <polygon points="73,89 82,94.5 82,104 73,99 64,104 64,152 55,147 55,99" />
      <!-- Right Building -->
      <polygon points="128,89 146,99 146,147 137,152 137,104 128,99 119,104 119,94.5" />
    </g>
  </svg>
</template>
