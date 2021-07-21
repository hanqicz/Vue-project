<style>
.parent {
  position: relative;
  overflow: visible;
}
.parent > div {
  position: absolute;
  top: 0;
  left: 0;
}
.izquierda {
  text-align: left;
}
</style>

<template>
  <div>
    <v-autocomplete
      v-model="selected"
      :disabled="isUpdating"
      :items="empleados"
      chips
      label="Selecciona responsables"
      multiple
      item-value="id"
      prepend-inner-icon="mdi-account-multiple"
      append-outer-icon="mdi-content-save"
      @click:append-outer="save"
    >
      <template v-slot:selection="data">
        <v-chip
          v-bind="data.attrs"
          :input-value="data.selected"
          close
          @click="data.select"
          @click:close="remove(data.item)"
        >
          <v-avatar
            left
            :class="
              `${randomColor({
                caseBase: data.item.nombres.toUpperCase()[2]
              })} white--text`
            "
          >
            {{ data.item.nombres.toUpperCase()[0]
            }}{{ data.item.nombres.toUpperCase()[1] }}
          </v-avatar>
          {{ data.item.nombres }}
        </v-chip>
      </template>
      <template v-slot:item="data">
        <template v-if="testIfObject(data.item)">
          <v-list-item-content v-text="data.item"></v-list-item-content>
        </template>
        <template v-else>
          <v-list-item-avatar
            :class="
              `${randomColor({
                caseBase: data.item.nombres.toUpperCase()[2]
              })} white--text`
            "
          >
            {{ data.item.nombres.toUpperCase()[0]
            }}{{ data.item.nombres.toUpperCase()[1] }}
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title v-html="data.item.nombres"></v-list-item-title>
            <v-list-item-subtitle
              v-html="data.item.puesto"
            ></v-list-item-subtitle>
          </v-list-item-content>
        </template>
      </template>
    </v-autocomplete>
  </div>
</template>
<script>
import axios from "axios";
import getRandomColor from "../../../tools/randomColor";
export default {
  name: "SelectEmpleado",
  props: {
    isPublicada: { type: Boolean, default: false },
    seleccionados: { type: Array },
    idCheck: { type: [Number, String] }
  },
  data: () => ({
    isLoading: false,
    isUpdating: false,
    rules: [v => v !== "" || "Selecciona un empleado válido"],
    search: "",
    idEmpleado: null,
    empleados: [],
    selected: [],
    open: false
    //itemsNuevaVenta: this.$store.state.itemsNuevaVenta,
  }),
  computed: {},
  created() {
    this.initialize();
    if (this.seleccionados)
      this.selected = this.seleccionados.map(item => item.id);
  },
  methods: {
    initialize() {
      this.fetchEmpleados();
    },
    testIfObject(item) {
      return typeof item !== "object";
    },
    async fetchEmpleados() {
      this.isLoading = true;
      let myUrl = process.env.VUE_APP_API + "obtenerUsuarios.php";
      let respuesta = await axios.post(myUrl, {
        request: 1,
        tipo: "getAll",
        token: localStorage.token
      });
      if (respuesta) {
        this.empleados = respuesta.data.rows.map(item => {
          item.idCheck = this.idCheck;
          return item;
        });
      }
    },
    evaluarSearch(event) {
      this.open = true;
      this.$emit("update:empleado", null);
      console.log(event.target.value);
      console.log(this.empleado);
      if (!event.target.value || event.target.value == "") this.open = false;
      // Evaluar la palabra
      // Asignar un objeto
    },
    randomColor(props) {
      return getRandomColor(props);
    },
    async save() {
      console.log("idCheck: " + this.idCheck);
      console.log("Responsables:");
      console.log(this.selected);
      let myUrl = process.env.VUE_APP_API + "updateNomCheckTemplate.php";
      if (this.isPublicada) {
        myUrl = process.env.VUE_APP_API + "updateNomCheck.php";
      }
      console.log("URL:");
      console.log(myUrl);
      let respuesta = await axios.post(myUrl, {
        request: 1,
        idCheck: this.idCheck,
        responsables: this.selected,
        token: localStorage.token
      });
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        this.$toasted.success("Responsables actualizados").goAway(2000);
      }
    },

    remove(item) {
      const index = this.selected.indexOf(item.id);
      if (index >= 0) this.selected.splice(index, 1);
    }
  }
};
</script>
