<style scoped></style>
<template>
  <v-container>
    <h1>Make Item: {{ makeItem.noParte }}</h1>
    <v-row>
      <v-col cols="12" sm="12" md="6" lg="4">
        <v-text-field
          v-model="makeItem.noParte"
          label="No. de parte"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="4">
        <v-text-field
          v-model="makeItem.noDibujo"
          label="No. de dibujo"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="4">
        <v-text-field
          v-model="makeItem.revision"
          label="Revisión"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="4">
        <v-text-field
          v-model="makeItem.descripcion"
          label="Descripción"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="4">
        <v-select v-model="makeItem.idMaterial" label="Material"></v-select>
      </v-col>
      <v-col cols="12" sm="12" md="12" lg="12">
        <h3>Dimensiones ideales de MP</h3>
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="4">
        <v-text-field
          v-model="makeItem.odm"
          label="Diametro Exterior"
          type="number"
          suffix="In"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="4">
        <v-text-field
          v-model="makeItem.idm"
          label="Diametro Interior"
          type="text"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="4">
        <v-text-field
          v-model="makeItem.lg"
          label="Longitud"
          type="number"
          suffix="In"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="12" md="12" lg="12" align-self="center">
        <v-btn @click="guardar">Guardar</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import axios from "axios";
export default {
  name: "MakeItem",
  data: () => ({
    makeItem: {},
    isLoading: false,
    isSaving: false
  }),
  methods: {
    guardar: async function() {
      this.id = this.$route.params.id;
      this.isSaving = true;
      this.$toasted.show("Guardando... No cierres la página").goAway(2000);
      let respuesta = await axios.post(
        process.env.VUE_APP_API + "actualizarMakeItem.php",
        {
          request: 1,
          id: this.id,
          makeItem: this.makeItem,
          token: localStorage.token
        }
      );
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        this.$toasted.success("Cambios guardados").goAway(2000);
        this.isSaving = false;
      }
    }
  },
  mounted: async function() {
    this.id = this.$route.params.id;
    this.isLoading = true;
    let respuesta = await axios.post(
      process.env.VUE_APP_API + "obtenerMakeItem.php",
      {
        request: 1,
        id: this.id,
        token: localStorage.token
      }
    );
    localStorage.token = respuesta.data.token;
    if (respuesta.data.status == "Ok") {
      this.makeItem = respuesta.data.rows[0];
      this.isLoadingLista = false;
    }
  }
};
</script>
