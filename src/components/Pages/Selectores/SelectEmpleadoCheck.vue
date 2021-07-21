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
</style>

<template>
  <div>
    <v-text-field
      v-model="search"
      label="Empleado asignado"
      prepend-icon="mdi-badge-account-horizontal"
      append-icon="mdi-magnify"
      color="teal"
      :rules="rules"
      dense
      @keyup="evaluarSearch"
    ></v-text-field>
    <v-card>
      <v-list v-if="open">
        <v-virtual-scroll
          height="200"
          item-height="64"
          :items="empleadosFiltrados"
        >
          <template v-slot:default="{ item }">
            <v-list-item :key="item.id" @click="selectEmpleado(item)" dense>
              <v-list-item-avatar
                :class="
                  `${randomColor({
                    caseBase: item.nombres.toUpperCase()[2]
                  })} white--text`
                "
              >
                {{ item.nombres.toUpperCase()[0]
                }}{{ item.nombres.toUpperCase()[1]
                }}{{ item.nombres.toUpperCase()[2] }}
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title v-html="item.nombres"></v-list-item-title>
                <v-list-item-subtitle> {{ item.cargo }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-virtual-scroll>
      </v-list>
    </v-card>
  </div>
</template>
<script>
import axios from "axios";
import getRandomColor from "../../../tools/randomColor";
import { matchStrings } from "../../../tools/proStrings";
export default {
  name: "SelectEmpleado",
  props: {
    empleado: {
      required: false
    },
    idCheck: {
      required: false
    }
  },
  data: () => ({
    isLoading: false,
    rules: [v => v !== "" || "Selecciona un empleado válido"],
    search: "",
    idEmpleado: null,
    empleados: [],
    open: false
    //itemsNuevaVenta: this.$store.state.itemsNuevaVenta,
  }),
  computed: {
    empleadosFiltrados() {
      let mySearch = this.search;
      return this.empleados.filter(item =>
        matchStrings({ s: mySearch, str: item.nombres })
      );
    }
  },
  created() {
    this.initialize();
  },
  methods: {
    initialize() {
      this.fetchEmpleados();
      this.search = this.empleado.initialSearch;
    },
    async fetchEmpleados() {
      this.isLoading = true;
      let myUrl = process.env.VUE_APP_API + "obtenerUsuarios.php";
      let respuesta = await axios.post(myUrl, {
        request: 1,
        tipo: "getAll",
        token: localStorage.token
      });
      if (respuesta) this.empleados = respuesta.data.rows;
      this.isLoading = false;
    },
    evaluarSearch(event) {
      this.open = true;
      this.$emit("update:empleado", null);
      console.log(event.target.value);
      console.log(this.empleado);
      if (!event.target.value || event.target.value == "") this.open = false;
      // Evaluar la palabra
      // Asignar un objeto
    } /* 
    autoSelectSearch(event) {
      this.open = false;
      if (
        this.empleadosFiltrados.filter((item) =>
          matchStrings({ s: event.target.value, str: item.nombres })
        )[0]
      ) {
        let myObj = this.empleadosFiltrados.filter((item) =>
          matchStrings({ s: event.target.value, str: item.nombres })
        )[0];
        this.search = empleado.nombres.substr(0, empleado.nombres.indexOf(" "))
          ? empleado.nombres.substr(0, empleado.nombres.indexOf(" "))
          : empleado.nombres;
        this.search += " ";
        this.search += empleado.apellidoPaterno ? empleado.apellidoPaterno : "";
        this.$emit("update:empleado", myObj);
      }
    }, */,
    selectEmpleado(employee) {
      this.search = employee.nombres.substr(0, employee.nombres.indexOf(" "))
        ? employee.nombres.substr(0, employee.nombres.indexOf(" "))
        : employee.nombres;
      this.search += " ";
      this.search += employee.apellidoPaterno ? employee.apellidoPaterno : "";

      this.open = false;
      this.$emit("update:empleado", employee);
      this.updateIdResponsable(employee.id);
    },
    randomColor(props) {
      return getRandomColor(props);
    },
    async updateIdResponsable(idEmpleado) {
      this.isInserting = true;
      console.log("idCheck: " + this.idCheck + " idEmpleado: " + idEmpleado);
      let respuesta = await axios.post(
        process.env.VUE_APP_API + "updateNomCheckTemplate.php",
        {
          request: 1,
          idCheck: this.idCheck,
          idResponsable: idEmpleado,
          token: localStorage.token
        }
      );
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        this.$toasted.success("Responsable actualizado").goAway(2000);
      }
    }
  }
};
</script>
