<template>
  <Button
    ref="button"
    :color="color"
    :toggled="toggled"
    :data-clipboard-text="content"
    >{{ currentLabel }}</Button
  >
</template>

<script>
import Clipboard from 'clipboard';
import Button from './Button.vue';

export default {
  name: 'copy-button',

  components: {
    Button,
  },

  props: {
    color: String,
    toggled: Boolean,
    label: String,
    content: String,
  },

  data() {
    return {
      currentLabel: this.label,
    };
  },

  mounted() {
    this.clipboard = new Clipboard(this.$refs.button.$el);
    this.clipboard.on('success', () => {
      this.setLabel('Copied!');
    });
    this.clipboard.on('error', () => {
      this.setLabel('Copy failed');
    });
  },

  beforeDestroy() {
    if (this.clipboard) {
      this.clipboard.destroy();
    }
    if (this.labelTimeout) {
      clearTimeout(this.labelTimeout);
      this.labelTimeout = undefined;
    }
  },

  methods: {
    setLabel(label) {
      this.currentLabel = label;

      if (this.labelTimeout) {
        clearTimeout(this.labelTimeout);
        this.labelTimeout = undefined;
      }

      this.labelTimeout = setTimeout(() => {
        this.currentLabel = 'Copy link';
        this.labelTimeout = undefined;
      }, 2000);
    },
  },
};
</script>
