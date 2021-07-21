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
            Proveedores
            <v-btn icon @click="camposVisibles = !camposVisibles">
              <v-icon>mdi-form-dropdown</v-icon>
            </v-btn>
          </h1>
          <v-icon></v-icon>
          <v-row v-if="camposVisibles">
            <v-col cols="12"><h3>General</h3></v-col>
            <v-col cols="1">
              <v-text-field
                label="Código"
                v-model="proveedor.codigo"
                dense
                :rules="rule"
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-text-field
                label="Nombre Comercial"
                v-model="proveedor.nombreComercial"
                dense
                :rules="rule"
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-text-field
                label="Correo Electronico"
                v-model="proveedor.correoElectronico"
                dense
                :rules="rule"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                label="Direccion Principal"
                v-model="proveedor.direccion"
                dense
                :rules="rule"
              ></v-text-field>
            </v-col>
            <v-col cols="1">
              <v-select
                label="Estado"
                :items="estados"
                v-model="proveedor.estado"
                dense
                :rules="rule"
              ></v-select>
            </v-col>
            <v-col cols="2">
              <v-autocomplete
                label="Servicio Externo"
                v-model="proveedor.idServicioExterno"
                :items="serviciosExternos"
                item-value="id"
                item-text="codigo"
                dense
                ><template v-slot:item="data">
                  <v-list-item-content>
                    <v-list-item-title
                      v-html="data.item.codigo"
                    ></v-list-item-title>
                    <v-list-item-subtitle
                      v-html="data.item.descripcion"
                    ></v-list-item-subtitle>
                  </v-list-item-content> </template
              ></v-autocomplete>
            </v-col>
            <v-col cols="2">
              <v-text-field
                label="Telefono"
                v-model="proveedor.telefono"
                dense
                :rules="rule"
              ></v-text-field>
            </v-col>
            <v-col cols="1">
              <v-select
                label="Tipo de Moneda"
                :items="monedas"
                v-model="proveedor.moneda"
                dense
                :rules="rule"
              ></v-select>
            </v-col>
            <v-col cols="6">
              <v-text-field
                label="URL"
                v-model="proveedor.url"
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12"><h3>Contacto</h3></v-col>
            <v-col cols="4">
              <v-text-field
                label="Nombre del Contacto"
                v-model="proveedor.nombreContacto"
                dense
                :rules="rule"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                label="Correo Electronico"
                v-model="proveedor.correoContacto"
                dense
                :rules="rule"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                label="Telefono"
                v-model="proveedor.telefonoContacto"
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12"><h3>Datos Fiscales</h3></v-col>
            <v-col cols="4">
              <v-text-field
                label="Razon Social"
                v-model="proveedor.razonSocial"
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                label="RFC"
                v-model="proveedor.rfc"
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                label="SWIFT"
                v-model="proveedor.swift"
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                label="Banco"
                v-model="proveedor.banco"
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                label="Numero de Cuenta"
                v-model="proveedor.numeroCuenta"
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                label="Clabe Interbancaria"
                v-model="proveedor.clabeInterbancaria"
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
                        proveedor = {};
                      }
                    "
                    block
                    >Cancelar</v-btn
                  ><v-btn class="btns" v-else block @click="proveedor = {}"
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
              <tr v-for="(item, ind) in proveedoresFiltradas" :key="ind">
                <td class="text-left">{{ item.codigo }}</td>
                <td class="text-left">{{ item.nombreComercial }}</td>
                <td class="text-left">{{ item.correoElectronico }}</td>
                <td class="text-left">{{ item.direccion }}</td>
                <td class="text-left">{{ item.estado }}</td>
                <td class="text-left">{{ item.idServicioExterno }}</td>
                <td class="text-left">{{ item.telefono }}</td>
                <td class="text-left">{{ item.moneda }}</td>
                <td class="text-left">{{ item.url }}</td>
                <td class="text-left">{{ item.nombreContacto }}</td>
                <td class="text-left">{{ item.correoContacto }}</td>
                <td class="text-left">{{ item.telefonoContacto }}</td>
                <td class="text-left">{{ item.razonSocial }}</td>
                <td class="text-left">{{ item.rfc }}</td>
                <td class="text-left">{{ item.swift }}</td>
                <td class="text-left">{{ item.banco }}</td>
                <td class="text-left">{{ item.numeroCuenta }}</td>
                <td class="text-left">{{ item.clabeInterbancaria }}</td>
                <td class="text-center">
                  <v-btn
                    title="Editar"
                    icon
                    color="info"
                    @click="
                      () => {
                        getProveedor(item.id);
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
  name: "Proveedores2",
  data: () => ({
    camposVisibles: true,
    isEditing: false,
    dialog: false,
    idEditing: 0,
    headers: [
      { name: "Código", attr: "codigo", search: "" },
      {
        name: "Nombre Comercial",
        attr: "nombreComercial",
        search: ""
      },
      {
        name: "Email General",
        attr: "correoElectronico",
        search: ""
      },
      { name: "Direccion Principal", attr: "direccion", search: "" },
      { name: "Estado", attr: "estado", search: "" },
      { name: "Servicio Externo", attr: "servicioExterno", search: "" },
      { name: "Telefono General", attr: "telefono", search: "" },
      { name: "Tipo de Moneda", attr: "moneda", search: "" },
      { name: "URL", attr: "url", search: "" },
      { name: "Nombre de Contacto", attr: "nombreContacto", search: "" },
      { name: "Email Contacto", attr: "correoContacto", search: "" },
      { name: "Telefono Contacto", attr: "telefonoContacto", search: "" },
      { name: "Razon Social", attr: "razonSocial", search: "" },
      { name: "RFC", attr: "rfc", search: "" },
      { name: "SWIFT", attr: "swift", search: "" },
      { name: "Banco", attr: "banco", search: "" },
      { name: "Numero de Cuenta", attr: "numeroCuenta", search: "" },
      { name: "Clabe Interbancaria", attr: "clabeInterbancaria", search: "" }
    ],
    estados: ["ACTIVO", "INACTIVO"],
    monedas: ["MXN", "USD"],
    serviciosExternos: [],
    proveedores: [],
    proveedor: {},
    valid: false,
    rule: [v => !!v || "Este campo es requerido"],
    deleteCallback: () => {}
  }),
  created() {
    this.initialize();
  },
  computed: {
    proveedoresFiltradas() {
      let filtradas = this.proveedores.filter(hoja => {
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
      this.getProveedores();
      this.getServiciosExternos();
    },
    async getProveedores() {
      this.isLoading = true;

      let myUrl = process.env.VUE_APP_API + "newModules/proveedores.php";
      let respuesta = await axios.post(myUrl, {
        request: 1,
        tipo: "getAll",
        token: localStorage.token
      });
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        this.proveedores = respuesta.data.rows;
        this.isLoading = false;
      }
    },
    async getProveedor(myId) {
      this.isLoading = true;
      let myUrl = process.env.VUE_APP_API + "newModules/proveedores.php";
      let respuesta = await axios.post(myUrl, {
        request: 1,
        id: myId,
        tipo: "getOne",
        token: localStorage.token
      });
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        this.proveedor = respuesta.data.rows[0];
        this.isLoading = false;
        console.log(this.proveedor);
      }
    },
    async getServiciosExternos() {
      this.isLoading = true;

      let myUrl = process.env.VUE_APP_API + "newModules/serviciosExternos.php";
      let respuesta = await axios.post(myUrl, {
        request: 1,
        tipo: "getAll",
        token: localStorage.token
      });
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        this.serviciosExternos = respuesta.data.rows;
        this.isLoading = false;
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
      let myUrl = process.env.VUE_APP_API + "newModules/proveedores.php";
      let respuesta = await axios.post(myUrl, {
        request: 1,
        id: myId,
        items: [this.proveedor],
        tipo: myTipo,
        token: localStorage.token
      });
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        this.$toasted.success("Elemento enviado", {
          duration: 2000,
          position: "bottom-center"
        });

        this.isSending = false;
        this.isEditing = false;
        this.proveedor = {};
        this.getProveedores();
      }
    },

    async descargarReporte() {
      let columnasProcesadas = [];
      var registros = XLSX.utils.json_to_sheet(columnasProcesadas);
      var wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, registros, "registros");
      var sheet = wb.Sheets[wb.SheetNames[0]];
      var offset = 1;

      this.proveedoresFiltradas.map((registro, i) => {
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

      XLSX.writeFile(wb, `Proveedores.xlsx`);
    },
    async eliminar(ind) {
      this.proveedores.splice(ind, 1);
      let myUrl = process.env.VUE_APP_API + "newModules/proveedores.php";
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
        this.getProveedores();
        this.$toasted.success("Elemento eliminado").goAway(2000);
      }
    }
  }
};
</script>

<style scoped></style>
