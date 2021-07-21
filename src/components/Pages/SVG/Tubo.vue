<template>
  <div v-if="!Number.isNaN(parseInt(percent))">
    <svg width="120" height="40">
      <path
        :d="
          `
                      M 80 10 
                      L 20 10 
                      A 8 10 0 0 0 20 30 
                      L ${percentM} 30 
                      A 8 10 0 0 1 ${percentM} 10 
                      `
        "
        stroke-width="0"
        :fill="colors[Math.round((percentM / 80) * 4)]"
      />
      <ellipse
        rx="8"
        ry="10"
        :cx="`${percentM}`"
        cy="20"
        stroke-width="0"
        :fill="colors[Math.round((percentM / 80) * 4)]"
      />
      <ellipse
        rx="8"
        ry="10"
        :cx="`${percentM}`"
        cy="20"
        stroke-width="0"
        fill="#135"
        opacity="0.4"
      />
      <ellipse
        rx="4"
        ry="5"
        :cx="`${percentM}`"
        cy="20"
        :stroke="strokeColor"
        stroke-width="2"
        :fill="strokeColor"
        opacity="0.5"
      />

      <path
        d="
                      M 80 10 
                      L 20 10 
                      A 8 10 0 0 0 20 30 
                      L 80 30 
                      A 8 10 0 0 0 80 10 
                      A 8 10 0 0 0 80 30 
                      "
        :stroke="strokeColor"
        stroke-width="2"
        fill="none"
      />
    </svg>
    <p class="text-center">{{ parseInt(percent) }}%</p>
  </div>
</template>

<script>
export default {
  name: "Tubo",
  props: ["percent"],
  data: () => ({
    colors: ["#212121", "#D32F2F", "#FDD835", "#00695C", "#0097A7"]
  }),
  computed: {
    percentM() {
      let percentM = 20 + this.percent * 0.6;
      return percentM;
    },
    strokeColor() {
      if (this.$vuetify.theme.dark == false) {
        return "#333";
      } else {
        return "#e5e5e5";
      }
    }
  }
};
</script>

<style scoped></style>
