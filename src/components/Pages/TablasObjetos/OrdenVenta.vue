<style>
.myContainer {
  margin: 10px;
}
.btns {
  margin: 0px 5px;
}
</style>
<template>
  <v-form v-model="valid"
    ><div class="myContainer">
      <v-card :loading="isLoading">
        <div class="contenedor">
          <h1>
            Ordenes de Venta
            <v-btn icon @click="camposVisibles = !camposVisibles">
              <v-icon>mdi-form-dropdown</v-icon>
            </v-btn>
          </h1>
          <v-icon></v-icon>
          <v-row v-if="camposVisibles">
            <v-col cols="12"><h3>General</h3></v-col>
            <v-col cols="1">
              <v-text-field
                label="Numero de orden"
                v-model="OrdenVenta.numeroOrden"
                dense
                :rules="rule"
              ></v-text-field>
            </v-col>
            <v-col cols="3">
              <v-text-field
                label="Nombre del cliente"
                v-model="OrdenVenta.nombreCliente"
                dense
                :rules="rule"
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <input
                type="datetime-local"
                class="text--primary"
                :value="OrdenVenta.fecha"
                :rules="rule"
              />
            </v-col>
            <v-col cols="4">
              <v-text-field
                label="Descripción"
                v-model="OrdenVenta.descripcion"
                :rules="rule"
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-text-field
                label="Numero de parte de equipo solicitado"
                v-model="OrdenVenta.numeroParteEquipoSolicitado"
                :rules="rule"
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="1">
              <v-text-field
                label="Cantidad de numeros de parte"
                v-model="OrdenVenta.cantidadNumerosParte"
                :rules="rule"
                dense
                type="number"
              ></v-text-field>
            </v-col>
            <v-col cols="1">
              <v-text-field
                label="Precio Unitario"
                v-model="OrdenVenta.precioUnitario"
                dense
                type="number"
              ></v-text-field>
            </v-col>
            <v-col cols="1">
              <v-select
                label="IVA"
                :items="iva"
                v-model="OrdenVenta.iva"
                dense
              ></v-select>
            </v-col>
            <v-col cols="12" class="d-flex justify-center">
              <v-row
                ><v-col cols="6">
                  <v-btn
                    class="btns"
                    v-if="isEditing"
                    @click="send(idEditing)"
                    block
                    >Editar</v-btn
                  ><v-btn class="btns" v-else block @click="send"
                    >Agregar</v-btn
                  ></v-col
                ><v-col cols="6">
                  <v-btn
                    class="btns"
                    v-if="isEditing"
                    @click="
                      () => {
                        isEditing = !isEditing;
                        OrdenVenta = {};
                      }
                    "
                    block
                    >Cancelar</v-btn
                  ><v-btn class="btns" v-else block @click="OrdenVenta = {}"
                    >Borrar campos</v-btn
                  ></v-col
                ></v-row
              >
            </v-col>
          </v-row>
        </div>

        <v-simple-table fixed-header height="76vh">
          <template>
            <thead>
              <tr>
                <th
                  class="text-center"
                  v-for="(header, ind) in headers"
                  :key="ind"
                >
                  <v-text-field
                    :placeholder="header['name']"
                    append-icon="mdi-table-search"
                    dense
                    v-model="header.search"
                    class="shrink"
                  ></v-text-field>
                </th>
                <th class="text-center">
                  <v-btn
                    title="Descargar reporte excel de los registros filtrados"
                    icon
                    color="success"
                    @click="descargarReporte"
                  >
                    <v-icon small> mdi-google-spreadsheet</v-icon>
                  </v-btn>
                </th>
              </tr>
              <tr>
                <th
                  class="text-left"
                  v-for="(header, ind) in headers"
                  :key="ind"
                >
                  {{ header["name"] }}
                </th>
                <th class="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, ind) in OrdenesVentaFiltradas" :key="ind">
                <td class="text-left">{{ item.numeroOrden }}</td>
                <td class="text-left">{{ item.nombreCliente }}</td>
                <td class="text-left">{{ item.fecha }}</td>
                <td class="text-left">{{ item.descripcion }}</td>
                <td class="text-left">
                  {{ item.numeroParteEquipoSolicitado }}
                </td>
                <td class="text-left">{{ item.cantidadNumerosParte }}</td>
                <td class="text-left">{{ item.precioUnitario }}</td>
                <td class="text-left">{{ item.iva }}</td>
                <td class="text-center">
                  <v-btn
                    title="Editar"
                    icon
                    color="info"
                    @click="
                      () => {
                        getOrdenVenta(item.id);
                        idEditing = item.id;
                        isEditing = true;
                      }
                    "
                  >
                    <v-icon small> mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn
                    title="Eliminar"
                    icon
                    color="error"
                    @click="
                      () => {
                        dialog = true;
                        deleteCallback = () => {
                          idEliminar = item.id;
                          eliminar(ind, item);
                        };
                      }
                    "
                  >
                    <v-icon small> mdi-delete</v-icon>
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card>
      <v-dialog v-model="dialog" max-width="290">
        <v-card>
          <v-card-title class="headline"> Advertencia </v-card-title>

          <v-card-text> Estas por eliminar este elemento </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn color="info" text @click="dialog = false"> Cancelar </v-btn>

            <v-btn
              color="red"
              text
              @click="
                () => {
                  dialog = false;
                  deleteCallback();
                }
              "
            >
              Ok
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div></v-form
  >
</template>

<script>
import axios from "axios";
import XLSX from "xlsx";
import { matchStrings } from "../../../tools/proStrings";

export default {
  name: "OrdenVenta",
  data: () => ({
    camposVisibles: true,
    isEditing: false,
    dialog: false,
    idEditing: 0,
    headers: [
      { name: "Numero de orden", attr: "numeroOrden", search: "" },
      {
        name: "Nombre del cliente",
        attr: "nombreCliente",
        search: ""
      },
      { name: "Fecha", attr: "fecha", search: "" },
      { name: "Descripcion", attr: "descripcion", search: "" },
      {
        name: "Numero de parte de equipo solicitado",
        attr: "numeroParteEquipoSolicitado",
        search: ""
      },
      {
        name: "Cantidad de numeros de parte",
        attr: "cantidadNumerosParte",
        search: ""
      },
      { name: "Precio unitario", attr: "precioUnitario", search: "" },
      { name: "IVA", attr: "iva", search: "" }
    ],
    iva: ["0%", "8%", "16%"],
    OrdenesVenta: [],
    OrdenVenta: {},
    valid: false,
    rule: [v => !!v || "Este campo es requerido"],
    deleteCallback: () => {}
  }),
  created() {
    this.initialize();
  },
  computed: {
    OrdenesVentaFiltradas() {
      let filtradas = this.OrdenesVenta.filter(hoja => {
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
      return filtradas;
    },
    token() {
      return localStorage.token;
    }
  },
  methods: {
    initialize() {
      this.getOrdenesVenta();
    },
    async getOrdenesVenta() {
      this.isLoading = true;

      let myUrl = process.env.VUE_APP_API + "newModules/OrdenesVenta.php";
      let respuesta = await axios.post(myUrl, {
        request: 1,
        tipo: "getAll",
        token: localStorage.token
      });
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        this.OrdenesVenta = respuesta.data.rows;
        this.isLoading = false;
      }
    },
    async getOrdenVenta(myId) {
      this.isLoading = true;
      let myUrl = process.env.VUE_APP_API + "newModules/OrdenesVenta.php";
      let respuesta = await axios.post(myUrl, {
        request: 1,
        id: myId,
        tipo: "getOne",
        token: localStorage.token
      });
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        this.OrdenVenta = respuesta.data.rows[0];
        this.isLoading = false;
        console.log(this.OrdenVenta);
      }
    },
    async send(myId) {
      if (this.valid == false) {
        this.$toasted.error("Revisar campos incorrectos", {
          duration: 2000,
          position: "bottom-center"
        });
        return;
      }
      let myTipo = "insert";
      if (this.isEditing) {
        myTipo = "update";
      }
      this.isSending = true;
      this.$toasted.show("Guardando...", {
        duration: 2000,
        position: "bottom-center"
      });
      let myUrl = process.env.VUE_APP_API + "newModules/OrdenesVenta.php";
      let respuesta = await axios.post(myUrl, {
        request: 1,
        id: myId,
        items: [this.OrdenVenta],
        tipo: myTipo,
        token: localStorage.token
      });
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        this.$toasted.success("Elemento enviado", {
          duration: 2000,
          position: "bottom-center"
        });

        console.table(this.OrdenVenta);
        this.isSending = false;
        this.isEditing = false;
        this.OrdenVenta = {};
        this.getOrdenesVenta();
      }
    },

    async descargarReporte() {
      let columnasProcesadas = [];
      var registros = XLSX.utils.json_to_sheet(columnasProcesadas);
      var wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, registros, "registros");
      var sheet = wb.Sheets[wb.SheetNames[0]];
      var offset = 1;

      this.OrdenesVentaFiltradas.map((registro, i) => {
        let col = 0;
        this.headers.map(header => {
          if (i == 0) {
            XLSX.utils.sheet_add_aoa(sheet, [[header.name]], {
              origin: XLSX.utils.encode_cell({ r: i, c: col })
            });
          }
          if (Object.prototype.hasOwnProperty.call(registro, header.attr)) {
            XLSX.utils.sheet_add_aoa(sheet, [[registro[header.attr]]], {
              origin: XLSX.utils.encode_cell({ r: i + offset, c: col })
            });
          }
          col++;
        });
      });

      XLSX.writeFile(wb, `OrdenesVenta.xlsx`);
    },
    async eliminar(ind) {
      this.OrdenesVenta.splice(ind, 1);
      let myUrl = process.env.VUE_APP_API + "newModules/OrdenesVenta.php";
      let respuesta = await axios.post(myUrl, {
        request: 1,
        id: this.idEliminar,
        value: 1,
        column: "eliminado",
        tipo: "updateColumn",
        token: localStorage.token
      });
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        this.getOrdenesVenta();
        this.$toasted.success("Elemento eliminado").goAway(2000);
      }
    }
  }
};
</script>

<style scoped></style>
