<style>
.myContainer {
  margin: 10px;
}
.btns {
  margin: 0px 5px;
}
</style>
<template>
  <div class="myContainer">
    <v-card :loading="isLoading">
      <div class="contenedor">
        <h1>
          Permisos
        </h1>
      </div>
      <div>
        <modal-permisos-2
          :isOpen="isOpen"
          :idEditing="idEditing"
          :usuario="usuario"
          v-on:cerrar="
            () => {
              isOpen = false;
              idEditing = 0;
            }
          "
        />
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
              <th class="text-left" v-for="(header, ind) in headers" :key="ind">
                {{ header["name"] }}
              </th>
              <th class="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, ind) in usuariosFiltrados" :key="ind">
              <td class="text-left">{{ item.id }}</td>
              <td class="text-left">
                {{ item.nombres }} {{ item.apellidoPaterno }}
                {{ item.apellidoMaterno }}
              </td>
              <td class="text-center">
                <v-btn
                  title="Editar"
                  icon
                  color="info"
                  @click="
                    () => {
                      idEditing = item.id;
                      usuario = {
                        nombre: item.nombres,
                        apellido1: item.apellidoPaterno,
                        apellido2: item.apellidoMaterno
                      };

                      isOpen = true;
                    }
                  "
                >
                  <v-icon small> mdi-pencil</v-icon>
                </v-btn>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>
  </div>
</template>

<script>
import axios from "axios";
import XLSX from "xlsx";
import { matchStrings } from "../../../tools/proStrings";
import ModalPermisos2 from "../Modals/ModalPermisos2.vue";

export default {
  components: { ModalPermisos2 },
  name: "Permisos",
  data: () => ({
    isEditing: false,
    isLoading: false,
    isOpen: false,
    idEditing: 0,
    headers: [
      { name: "ID", attr: "id", search: "" },
      {
        name: "Nombre del Usuario",
        attr: "nombres",
        search: ""
      }
    ],
    usuarios: [],
    usuario: {}
  }),
  created() {
    this.initialize();
  },
  computed: {
    usuariosFiltrados() {
      let filtradas = this.usuarios.filter(hoja => {
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
      this.getUsuarios();
    },
    async getUsuarios() {
      this.isLoading = true;
      let myUrl = process.env.VUE_APP_API + "obtenerUsuarios.php";
      let respuesta = await axios.post(
        myUrl,
        {
          request: 1,
          token: localStorage.token
        },
        { timeout: 10000 }
      );
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        this.usuarios = respuesta.data.rows;
        this.isLoading = false;
      }
    },
    async descargarReporte() {
      let columnasProcesadas = [];
      var registros = XLSX.utils.json_to_sheet(columnasProcesadas);
      var wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, registros, "registros");
      var sheet = wb.Sheets[wb.SheetNames[0]];
      var offset = 1;

      this.clasesFiltradas.map((registro, i) => {
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

      XLSX.writeFile(wb, `Clases.xlsx`);
    }
  }
};
</script>

<style scoped></style>
