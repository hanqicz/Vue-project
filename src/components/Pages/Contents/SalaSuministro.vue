<style scoped>
.contenedor {
  margin: 10px;
}
.scan {
  background-color: #e3e3e3;
  height: 200px;
  width: 200px;
  border-radius: 5px;
}
</style>
<template>
  <v-form v-model="valid">
    <div class="contenedor">
      <v-card>
        <div class="contenedor">
          <h1 class="text-center">Sala suministros</h1>
          <v-row justify="center">
            <v-col md="6" sm="12">
              <center>
                <div class="scan" v-if="false">
                  <div class="info--text pt-16">Lector QR (En desarrollo)</div>
                </div>
              </center>
            </v-col>
          </v-row>
          <v-row justify="center">
            <v-col md="6" sm="12" xsm="12">
              <form ref="form" autocomplete="off">
                <v-text-field
                  label="Código por texto"
                  :rules="rules.codigoRules"
                  v-model="codigo"
                  autocomplete="off"
                ></v-text-field>

                <v-text-field
                  label="Nombre del material"
                  :rules="rules.nombreRules"
                  v-if="material"
                  v-model="material.nombreMaterial"
                  readonly
                  autocomplete="off"
                ></v-text-field>

                <v-text-field
                  autocomplete="off"
                  label="Cantidad"
                  type="number"
                  :rules="rules.cantidadRules"
                  v-model="cantidad"
                ></v-text-field>

                <v-text-field
                  label="Usuario"
                  :rules="rules.usuarioRules"
                  v-model="usuario"
                  autocomplete="off"
                ></v-text-field>

                <v-text-field
                  label="Contraseña"
                  :append-icon="canSeePassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="canSeePassword ? 'text' : 'password'"
                  @click:append="canSeePassword = !canSeePassword"
                  :rules="rules.contrasenaRules"
                  v-model="password"
                  autocomplete="off"
                ></v-text-field>

                <div class="text-center">
                  <v-btn @click="access">Confirmar</v-btn>
                </div>
              </form>
              <br />
            </v-col>
          </v-row>
        </div>
        <div class="contenedor">
          <v-simple-table fixed-header height="50vh">
            <template>
              <thead>
                <tr>
                  <th
                    class="text-center"
                    v-for="(header, ind) in headers.filter(filtrarTipo)"
                    :key="ind"
                  >
                    <v-text-field
                      autocomplete="off"
                      :placeholder="header['name']"
                      append-icon="mdi-table-search"
                      dense
                      v-model="header.search"
                      class="shrink"
                    ></v-text-field>
                  </th>
                  <th class="text-center" v-if="isMP == true"></th>
                </tr>
                <tr>
                  <th
                    class="text-left"
                    v-for="(header, ind) in headers.filter(filtrarTipo)"
                    :key="ind"
                  >
                    {{ header["name"] }}
                  </th>
                  <th class="text-center" v-if="isMP == true">
                    Dimensiones
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, ind) in inventarioFiltrado" :key="ind">
                  <td class="text-left">{{ item.idRandom }}</td>
                  <td class="text-left" v-if="isMake">{{ item.job }}</td>
                  <td class="text-left" v-if="isMP">
                    <v-icon small v-if="item.metalico == 1">mdi-anvil</v-icon>
                  </td>
                  <td class="text-left">
                    {{ item.nombreMaterial }}
                  </td>
                  <td class="text-left" v-if="isBuy">{{ item.po }}</td>
                  <td class="text-left">{{ item.fecha }}</td>
                  <td class="text-left" v-if="isBuy">{{ item.lote }}</td>
                  <td class="text-left" v-if="isBuy">{{ item.descuento }}</td>
                  <td class="text-left" v-if="isMP">
                    <span v-if="item.forma">
                      Longitud: {{ item.longitud }}<br
                    /></span>
                    <span v-if="item.forma == 'placa'">
                      Altura: {{ item.height }}<br
                    /></span>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </div>
      </v-card>
    </div>
  </v-form>
</template>

<script>
import axios from "axios";
import { generateRandomId } from "../../../tools/randomStrGus";
import { matchStrings } from "../../../tools/proStrings";
export default {
  data: () => ({
    canSeePassword: false,
    accessVal: false,
    isMake: false,
    isBuy: true,
    isMP: false,
    valid: false,
    usuario: "",
    password: "",
    codigo: "",
    cantidad: 0,
    idCulpable: 0,
    rules: {
      codigoRules: [v => !!v || "El código de registro es necesario"],
      nombreRules: [v => !!v || "El nombre de registro es necesario"],
      cantidadRules: [
        v => !!v || "Es necesario especificar una cantidad a retirar",
        v => v >= 0 || "La cantidad debe ser mayor o igual a 0"
      ],
      usuarioRules: [],
      contrasenaRules: []
    },
    salida: {
      codigo: 0
    },
    headers: [
      { name: "Id", attr: "idRandom", search: "", tipo: "both", tipo2: "" },
      { name: "Job", attr: "job", search: "", tipo: "MAKE", tipo2: "" },
      {
        name: "Metalico",
        attr: "metalico",
        search: "",
        tipo: "MP",
        tipo2: ""
      },
      {
        name: "Nombre",
        attr: "nombreMaterial",
        search: "",
        tipo: "both",
        tipo2: ""
      },
      { name: "PO", attr: "po", search: "", tipo: "BUY", tipo2: "MP" },
      { name: "Fecha", attr: "fecha", search: "", tipo: "both", tipo2: "" },
      { name: "Lote", attr: "lote", search: "", tipo: "BUY", tipo2: "MP" },
      {
        name: "Descuento",
        attr: "descuento",
        search: "",
        tipo: "BUY",
        tipo2: "MP"
      }
    ],
    visible: "BUY",
    tipo: ["BUY"],
    inventario: [],
    materiales: []
  }),
  watch: {
    visible(tipo) {
      if (tipo == "BUY") {
        this.isBuy = true;
        this.isMake = false;
        this.isMP = false;
      }
      if (tipo == "MAKE") {
        this.isBuy = false;
        this.isMake = true;
        this.isMP = false;
      }
      if (tipo == "MP") {
        this.isBuy = true;
        this.isMake = false;
        this.isMP = true;
      }
    }
  },
  computed: {
    material() {
      return this.materiales?.length
        ? this.materiales.filter(
            item => this.codigo == item.idRegistroMaterial
          )[0]
        : null;
    },
    inventarioFiltrado() {
      let filtradas = this.inventario.filter(item => item.tipo == this.visible);
      filtradas = filtradas.filter(hoja => {
        let isIn = false;
        let countMatches = 0;
        this.headers.map(header => {
          if (matchStrings({ s: header.search, str: hoja[header.attr] }))
            countMatches++;
          else if (header.search == "") {
            countMatches++;
          }
        });
        if (countMatches == this.headers.length) isIn = true;
        return isIn;
      });
      return filtradas.slice(Math.max(filtradas.length - 5, 0));
    }
  },
  created() {
    this.initialize();
  },
  methods: {
    initialize() {
      this.getMateriales();
      this.getInventario();
    },
    filtrarTipo(header) {
      if (
        header.tipo == "both" ||
        header.tipo == this.visible ||
        header.tipo2 == this.visible
      ) {
        return header;
      }
    },
    async getInventario(options) {
      // Esto solamente setea el tipo de la tabla, no tiene que ver con la api
      let { tipoMateriales } = { tipoMateriales: "BUY", ...options };
      this.visible = tipoMateriales;
      // Esto solamente setea el tipo de la tabla, no tiene que ver con la api

      let myUrl = process.env.VUE_APP_API + "newModules/almacen.php";
      let respuesta = await axios.post(myUrl, {
        request: 1,
        tipo: "getAllSalidas",
        token: localStorage.token
      });
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        this.inventario = respuesta.data.rows;
        this.inventario = this.inventario.filter(elemento =>
          /^SSU-/.test(elemento.idRandom)
        );
      }
    },
    async access() {
      if (this.valid == false) {
        this.$toasted.error("Revisar campos incorrectos", {
          duration: 2000,
          position: "bottom-center"
        });
        return;
      }
      this.$toasted.show("Guardando...", {
        duration: 2000,
        position: "bottom-center"
      });
      if (this.usuario != "" && this.password != "") {
        let respuesta = await axios.post(
          process.env.VUE_APP_API + "iniciarSesion.php",
          {
            request: 1,
            correo: this.usuario,
            password: this.password
          }
        );
        this.isLoading = false;
        if (respuesta.data.status == "Ok") {
          this.accessVal = true;
          this.idCulpable = respuesta.data.usuario.id;
          this.send();
          console.log("Accesos validados");
        }
      } else {
        this.isLoading = false;
        this.accessVal = false;
        this.$toasted.error("El usuario y/o la contraseña no son correctos", {
          duration: 2000,
          position: "bottom-center"
        });
      }
    },
    async getMateriales() {
      let myUrl = process.env.VUE_APP_API + "newModules/almacen.php";
      let respuesta = await axios.post(myUrl, {
        request: 1,
        tipo: "getAll",
        token: localStorage.token
      });
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        this.materiales = respuesta.data.rows;
      }
    },
    async send() {
      this.isSending = true;
      let myUrl = process.env.VUE_APP_API + "newModules/almacen.php";
      this.salida.idRandom = "SSU-" + generateRandomId();
      this.salida.idRegistroMaterial = this.codigo;
      this.salida.cantidad = this.cantidad;

      let respuesta = await axios.post(myUrl, {
        request: 1,
        salida: this.salida,
        idCulpable: this.idCulpable,
        tipo: "insertSalidaSuministro",
        token: localStorage.token
      });
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        this.$toasted.success("Salida registrada", {
          duration: 2000,
          position: "bottom-center"
        });
        this.getInventario();
        this.usuario = "";
        this.password = "";
        this.idCulpable = 0;
        this.cantidad = 0;
      }
    }
  }
};
</script>
