<style scoped></style>
<template>
  <v-container>
    <h1>Materia Prima: {{ numDeParte }}</h1>
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
      <v-col cols="12" sm="12" md="12" lg="12">
        <h3>Dimensiones ideales de MP</h3>
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="4">
        <v-text-field
          v-model="diametroExterno"
          label="Diametro Exterior"
          type="number"
          suffix="In"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="4">
        <v-text-field
          v-model="diametroInterno"
          label="Diametro Interior"
          type="number"
          suffix="In"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="4">
        <v-text-field
          v-model="longitud"
          label="Longitud"
          type="number"
          suffix="In"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="12" md="12" lg="12">
        <v-select
          v-model="tags"
          :items="conjuntoTags"
          attach
          chips
          label="#Tags"
          multiple
        ></v-select>
      </v-col>
      <v-col cols="12" sm="12" md="12" lg="12" align-self="center">
        <v-btn>Guardar</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: "MateriaPrima",
  data: () => ({
    numDeParte: "",
    descripcion: "",
    material: "",
    diametroExterno: "",
    diametroInterno: "",
    longitud: "",
    tags: "",
    conjuntoTags: ["Tag 1", "Tag 2", "Tag 3"]
  })
};
</script>
