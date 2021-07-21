<template>
  <div v-if="!Number.isNaN(parseInt(percent))">
    <svg height="40" width="120">
      <line
        x1="25"
        y1="15"
        x2="90"
        y2="15"
        :style="'stroke:' + strokeColor + ';stroke-width:2'"
      />
      <polygon
        :points="'25,10 15,30 ' + changed[1] + ',30 ' + changed[0] + ',10'"
        :fill="colors[Math.round((percentM / 80) * 4)]"
      />
      <polygon
        :points="'15,30 20,35 ' + changed[3] + ',35 ' + changed[2] + ',30'"
        :fill="colors[Math.round((percentM / 80) * 4)]"
      />
      <polygon
        :points="
          changed[0] +
            ',10 ' +
            changed[1] +
            ',30 ' +
            changed[3] +
            ',35 ' +
            changed[4] +
            ',15 '
        "
        :fill="colors[Math.round((percentM / 80) * 4)]"
      />
      <polygon
        :points="
          changed[0] +
            ',10 ' +
            changed[1] +
            ',30 ' +
            changed[3] +
            ',35 ' +
            changed[4] +
            ',15 '
        "
        style="fill:#135;stroke:#333;opacity:0.4;stroke-width:1"
      />
      <polygon
        points="25,10 15,30 75,30 85,10"
        fill="transparent"
        :stroke="strokeColor"
        stroke-width="2"
        style="stroke-linejoin: round;"
      />
      <polygon
        points="15,30 20,35 80,35 75,30"
        fill="transparent"
        :stroke="strokeColor"
        stroke-width="2"
        style="stroke-linejoin: round;"
      />
      <polygon
        points="85,10 75,30 80,35 90,15"
        fill="transparent"
        :stroke="strokeColor"
        stroke-width="2"
        style="stroke-linejoin: round;"
      />
    </svg>
    <p class="text-center">{{ parseInt(percent) }}%</p>
  </div>
</template>
<script>
export default {
  name: "DibujoPlaca",
  props: ["percent"],
  data: () => ({
    colors: ["#212121", "#D32F2F", "#FDD835", "#00695C", "#0097A7"],
    changed: []
  }),
  created() {
    this.initialize();
  },
  computed: {
    strokeColor() {
      if (this.$vuetify.theme.dark == false) {
        return "#333";
      } else {
        return "#e5e5e5";
      }
    },
    percentM() {
      let percentM = 20 + this.percent * 0.6;
      return percentM;
    }
  },
  watch: {
    percent() {
      this.changePoints();
    }
  },
  methods: {
    initialize() {
      this.changePoints();
    },
    changePoints() {
      let origen = [25, 15, 15, 20, 30];
      let miPorcentaje = this.percent;
      this.changed = origen.map(valor => {
        return valor + Math.round((0.6 * miPorcentaje * 100) / 100);
      });
      this.rightColor =
        miPorcentaje == 100 ? "fill:#0097A7" : "fill:transparent";
    }
  }
};
</script>
