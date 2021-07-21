<style>
.myContainer {
  margin: 10px;
}
.btns {
  margin: 0px 5px;
}
</style>
<template>
  <v-form v-model="valid">
    <div class="myContainer">
      <v-card :loading="isLoading">
        <div class="contenedor">
          <h1>
            Clientes
            <v-btn icon @click="camposVisibles = !camposVisibles">
              <v-icon>mdi-form-dropdown</v-icon>
            </v-btn>
          </h1>
          <v-row v-if="camposVisibles">
            <v-col cols="12"><h3>Datos Generales</h3></v-col>
            <v-col cols="12" sm="12" md="3">
              <v-text-field
                label="Código de cliente"
                v-model="cliente.codigoCliente"
                :rules="rule"
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="3">
              <v-text-field
                label="Nombre Comercial"
                v-model="cliente.nombreComercial"
                :rules="rule"
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="3">
              <v-text-field
                label="Dirección Principal"
                v-model="cliente.direccionPrincipal"
                :rules="rule"
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="3">
              <v-text-field
                label="Teléfono"
                v-model="cliente.telefono"
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="3">
              <v-text-field
                label="Correo Electronico"
                v-model="cliente.correoCliente"
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="3">
              <v-autocomplete
                label="Tipo de moneda"
                :items="['USD', 'MXN']"
                v-model="cliente.tipoMoneda"
                dense
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" sm="12" md="3">
              <v-text-field
                label="URL"
                v-model="cliente.url"
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="3">
              <v-autocomplete
                label="Estado"
                :items="['Activo', 'Inactivo']"
                v-model="cliente.estado"
                dense
              ></v-autocomplete>
            </v-col>
            <v-col cols="12"><h3>Contacto</h3></v-col>
            <v-col cols="12" sm="12" md="3">
              <v-text-field
                label="Nombre del Contacto"
                v-model="cliente.nombreContacto"
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="3">
              <v-text-field
                label="Teléfono del Contacto"
                v-model="cliente.telefonoContacto"
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="3">
              <v-text-field
                label="Correo Electrónico del Contacto"
                v-model="cliente.correoContacto"
                dense
              ></v-text-field>
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
                        cliente = {};
                      }
                    "
                    block
                    >Cancelar</v-btn
                  ><v-btn class="btns" v-else block @click="cliente = {}"
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
              <tr v-for="(item, ind) in clientesFiltradas" :key="ind">
                <td class="text-left">{{ item.codigoCliente }}</td>
                <td class="text-left">{{ item.nombreComercial }}</td>
                <td class="text-left">{{ item.direccionPrincipal }}</td>
                <td class="text-left">{{ item.telefono }}</td>
                <td class="text-left">{{ item.correoCliente }}</td>
                <td class="text-left">{{ item.tipoMoneda }}</td>
                <td class="text-left">{{ item.url }}</td>
                <td class="text-left">{{ item.estado }}</td>
                <td class="text-left">{{ item.nombreContacto }}</td>
                <td class="text-left">{{ item.telefonoContacto }}</td>
                <td class="text-left">{{ item.correoContacto }}</td>
                <td class="text-center">
                  <v-btn
                    title="Editar"
                    icon
                    color="info"
                    @click="
                      () => {
                        getCliente(item.id);
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
    </div>
  </v-form>
</template>

<script>
import axios from "axios";
import XLSX from "xlsx";
import { matchStrings } from "../../../tools/proStrings";

export default {
  name: "Clientes",
  data: () => ({
    camposVisibles: true,
    valid: false,
    isEditing: false,
    dialog: false,
    idEditing: 0,
    headers: [
      { name: "Código Cliente", attr: "codigoCliente", search: "" },
      {
        name: "Nombre Comercial",
        attr: "nombreComercial",
        search: ""
      },
      {
        name: "Dirección Principal",
        attr: "direccionPrincipal",
        search: ""
      },
      {
        name: "Teléfono",
        attr: "telefono",
        search: ""
      },
      {
        name: "Correo Electrónico",
        attr: "correoCliente",
        search: ""
      },
      {
        name: "Tipo de Moneda",
        attr: "tipoMoneda",
        search: ""
      },
      {
        name: "URL",
        attr: "url",
        search: ""
      },
      {
        name: "Estado",
        attr: "estado",
        search: ""
      },
      {
        name: "Nombre Contacto",
        attr: "nombreContacto",
        search: ""
      },
      {
        name: "Teléfono Contacto",
        attr: "telefonoContacto",
        search: ""
      },
      {
        name: "Correo Contacto",
        attr: "correoContacto",
        search: ""
      }
    ],
    clientes: [],
    cliente: {
      codigoCliente: "",
      estado: "Inactivo",
      tipoMoneda: "USD"
    },
    rule: [v => !!v || "Este campo es requerido"],
    deleteCallback: () => {}
  }),
  created() {
    this.initialize();
  },
  computed: {
    clientesFiltradas() {
      let filtradas = this.clientes.filter(hoja => {
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
      this.getClientes();
    },
    async getClientes() {
      this.isLoading = true;

      let myUrl = process.env.VUE_APP_API + "newModules/clientes.php";
      let respuesta = await axios.post(myUrl, {
        request: 1,
        tipo: "getAll",
        token: localStorage.token
      });
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        this.clientes = respuesta.data.rows;
        this.isLoading = false;
      }
    },
    async getCliente(myId) {
      this.isLoading = true;
      let myUrl = process.env.VUE_APP_API + "newModules/clientes.php";
      let respuesta = await axios.post(myUrl, {
        request: 1,
        id: myId,
        tipo: "getOne",
        token: localStorage.token
      });
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        this.cliente = respuesta.data.rows[0];
        this.isLoading = false;
        console.log(this.cliente);
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
      let myUrl = process.env.VUE_APP_API + "newModules/clientes.php";
      let respuesta = await axios.post(myUrl, {
        request: 1,
        id: myId,
        items: [this.cliente],
        tipo: myTipo,
        token: localStorage.token
      });
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        this.$toasted.success("Elemento enviado", {
          duration: 2000,
          position: "bottom-center"
        });

        console.table(this.cliente);
        this.isSending = false;
        this.isEditing = false;
        this.cliente = {};
        this.getClientes();
      }
    },

    async descargarReporte() {
      let columnasProcesadas = [];
      var registros = XLSX.utils.json_to_sheet(columnasProcesadas);
      var wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, registros, "registros");
      var sheet = wb.Sheets[wb.SheetNames[0]];
      var offset = 1;

      this.clientesFiltradas.map((registro, i) => {
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

      XLSX.writeFile(wb, `Clientes.xlsx`);
    },
    async eliminar(ind) {
      this.clientes.splice(ind, 1);
      let myUrl = process.env.VUE_APP_API + "newModules/clientes.php";
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
        this.getClientes();
        this.$toasted.success("Elemento eliminado").goAway(2000);
      }
    }
  }
};
</script>

<style scoped></style>
