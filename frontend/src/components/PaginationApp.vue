<template>
  <div class="text-center">
    <v-pagination
      :length="pages"
      v-model="localPage"
      @input="onChange"
    ></v-pagination>
  </div>
</template>

<script>
export default {
  props: {
    total: { type: Number, default: 0 },
    page: { type: Number, default: 1 },
    limit: { type: Number, default: 10 },
  },
  data() {
    return { localPage: this.page };
  },
  computed: {
    pages() {
      return Math.max(1, Math.ceil(this.total / this.limit));
    },
  },
  watch: {
    page(v) {
      this.localPage = v;
    },
  },
  methods: {
    onChange(p) {
      this.$emit("update:page", p);
      this.$emit("change", p);
    },
  },
};
</script>
