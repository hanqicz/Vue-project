<template>
  <v-container>
    <h1>Buy Item: {{ numDeParte }}</h1>
    <v-row>
      <v-col cols="12" sm="12" md="6" lg="4">
        <v-text-field v-model="numDeParte" label="No. de parte"></v-text-field>
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="4">
        <v-text-field v-model="descripcion" label="Descripcion"></v-text-field>
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="4">
        <v-select v-model="material" label="Material"></v-select>
      </v-col>
      <v-col cols="12" sm="12" md="12" lg="12" align-self="center">
        <v-btn>Guardar</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: "BuyItem",
  data: () => ({
    numDeParte: "",
    descripcion: "",
    material: ""
  })
};
</script>
