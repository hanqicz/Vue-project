<template>
  <v-container>
    <h1>Capacitación de {{ nombreCompleto }}</h1>
  </v-container>
</template>
<script>
export default {
  name: "Detalles de capacitacion",
  data: () => {
    /*usuario: {
    }*/
  },
  created: () => {},
  computed: {
    nombreCompleto() {
      return `${this.usuario.nombres}  ${this.usuario.apellidoPaterno}  ${this.usuario.apellidoMaterno}`;
    }
  },
  methods: {}
};
</script>
