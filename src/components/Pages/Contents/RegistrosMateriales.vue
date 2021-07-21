<template>
  <v-form v-model="valid">
    <div class="myContainer">
      <v-card>
        <div class="myContainer">
          <h1>
            Materiales
            <v-btn icon @click="camposVisibles = !camposVisibles">
              <v-icon>mdi-form-dropdown</v-icon>
            </v-btn>
          </h1>
          <v-row v-if="camposVisibles">
            <v-col cols="12"><h3>General</h3></v-col>
            <v-col cols="12" sm="12" md="3">
              <v-text-field
                label="Numero de parte"
                v-model="material.noParte"
                :rules="rule"
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="3">
              <v-text-field
                label="Descripción corta"
                v-model="material.descripcionCorta"
                :rules="rule"
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="3">
              <v-text-field
                label="Descripción extendida"
                v-model="material.descripcion"
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="3">
              <v-autocomplete
                label="Tipo Material"
                :items="['MAKE', 'BUY', 'MP', 'HERRAMIENTA']"
                @change="cambiarTipoMaterial"
                v-model="material.tipo"
                dense
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" sm="12" md="3">
              <v-autocomplete
                label="Clase"
                :items="['USD', 'MXN']"
                v-model="material.clase"
                :rules="rule"
                dense
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" sm="12" md="3">
              <v-text-field
                label="Ubicación"
                v-model="material.ubicacion"
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12"><h3>Detalle</h3></v-col>

            <v-col cols="12" sm="12" md="3" v-if="isMake || isBuy">
              <v-text-field
                label="Numero de dibujo"
                v-model="material.numeroDibujo"
                :rules="rule"
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="3" v-if="isMake || isBuy">
              <v-text-field
                label="Revisión"
                v-model="material.revision"
                :rules="rule"
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="3" v-if="isMake">
              <v-text-field
                label="Diámetro Exterior Máximo"
                v-model="material.diametroExteriorMaximo"
                :rules="rule"
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="3" v-if="isMake">
              <v-text-field
                label="Diámetro Interior Máximo"
                v-model="material.diametroInteriorMaximo"
                :rules="rule"
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="3" v-if="isMake">
              <v-text-field
                label="Longitud máxima"
                v-model="material.longitudMaxima"
                :rules="rule"
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="3" v-if="isMP">
              <v-autocomplete
                label="Forma del material"
                :items="['Tubo', 'Barra', 'Placa', 'Otro']"
                v-model="material.forma"
                :rules="rule"
                @change="cambiarForma"
                dense
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" sm="12" md="3" v-if="isMP && (isTubo || isBarra)">
              <v-text-field
                label="Diametro Exterior"
                v-model="material.diametroExterior"
                :rules="rule"
                dense
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="12" md="3" v-if="isMP && isTubo">
              <v-text-field
                label="Diametro Interior"
                v-model="material.diametroInterior"
                :rules="rule"
                dense
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="12" md="3" v-if="isMP && !isOtro">
              <v-text-field
                label="Longitud"
                v-model="material.longitud"
                :rules="rule"
                dense
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="12" md="3" v-if="isMP && isPlaca">
              <v-text-field
                label="Alto"
                v-model="material.alto"
                :rules="rule"
                dense
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="12" md="3" v-if="isMP && isPlaca">
              <v-text-field
                label="Ancho"
                v-model="material.ancho"
                :rules="rule"
                dense
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="12" md="3" v-if="isMP && isOtro">
              <v-text-field
                label="Dimensiones"
                v-model="material.dimensiones"
                :rules="rule"
                dense
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="12" md="3" v-if="isMake || isBuy || isMP">
              <v-text-field
                label="Especificación de Material"
                v-model="material.especificacionMaterial"
                :rules="rule"
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="3" v-if="isBuy || isMP">
              <v-text-field
                label="Proveedor Sugerido"
                v-model="material.proveedorSugerido"
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="3" v-if="isHerramienta">
              <v-text-field
                label="Modelo"
                v-model="material.modelo"
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="3" v-if="isHerramienta">
              <v-text-field
                label="Marca"
                v-model="material.marca"
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="3" v-if="isHerramienta">
              <v-text-field
                label="Tipo de herramienta"
                v-model="material.tipoHerramienta"
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="3" v-if="isHerramienta">
              <v-autocomplete
                label="Proveedor Primario"
                :items="['Proveedor primario']"
                v-model="material.proveedorPrimario"
                dense
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" sm="12" md="3" v-if="isHerramienta">
              <v-autocomplete
                label="Proveedor Secundario"
                :items="['Proveedor secundario']"
                v-model="material.proveedorSecundario"
                dense
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" sm="12" md="3" v-if="isHerramienta">
              <v-text-field
                label="Ubicacion"
                v-model="material.ubicacion"
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="3" v-if="isHerramienta">
              <v-text-field
                label="Costo"
                v-model="material.costo"
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
                        material = {};
                      }
                    "
                    block
                    >Cancelar</v-btn
                  ><v-btn class="btns" v-else block @click="material = {}"
                    >Borrar campos</v-btn
                  ></v-col
                ></v-row
              >
            </v-col>
          </v-row>
        </div>
        <v-simple-table fixed-header height="70vh">
          <template v-slot:default>
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
                <th></th>
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
                <th class="text-center">QR</th>
                <th class="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, ind) in materialesFiltrados" :key="ind">
                <td class="text-left">{{ item.idRegistroMaterial }}</td>
                <td class="text-left">{{ item.noParte }}</td>
                <td class="text-left">{{ item.descripcioncorta }}</td>
                <td class="text-left">{{ item.descripcion }}</td>
                <td class="text-left">{{ item.tipo }}</td>
                <td class="text-left">{{ item.clase }}</td>
                <td class="text-left">{{ item.ubicacion }}</td>
                <td>
                  <div class="tableSpacer"></div>
                  <img
                    class="tableImage"
                    :src="
                      `https://chart.googleapis.com/chart?chs=500x500&cht=qr&chl=${item.nombreMaterial}`
                    "
                    :lazy-src="
                      `https://chart.googleapis.com/chart?chs=10x10&cht=qr&chl=${item.nombreMaterial}`
                    "
                    alt="QR"
                  />
                </td>
                <td class="text-center">
                  <v-btn
                    title="Editar"
                    icon
                    color="info"
                    @click="
                      () => {
                        getMaterial(item.idRegistroMaterial);
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
                          idEliminar = item.idRegistroMaterial;
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

          <v-card-text> Estas por eliminar esta cotizacion </v-card-text>

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
  name: "RegistroMateriales",
  data: () => ({
    valid: false,
    isEditing: false,
    dialog: false,
    camposVisibles: true,
    isBuy: false,
    isMake: true,
    isMP: false,
    isHerramienta: false,
    isTubo: true,
    isBarra: false,
    isPlaca: false,
    isOtro: false,
    idEditing: 0,
    headers: [
      { name: "Id", attr: "idRegistroMaterial", search: "" },
      { name: "No. Parte", attr: "noParte", search: "" },
      { name: "Descripción Corta", attr: "descripcionCorta", search: "" },
      {
        name: "Descripción Extendida",
        attr: "descripcionExtendida",
        search: ""
      },
      { name: "Tipo", attr: "tipo", search: "" },
      { name: "Clase", attr: "clase", search: "" },
      { name: "Ubicacion", attr: "ubicacion", search: "" }
    ],
    rule: [v => !!v || "Este campo es requerido"],
    material: {
      tipo: "MAKE",
      forma: "Tubo"
    },
    materiales: [],
    deleteCallback: () => {}
  }),
  created() {
    this.initialize();
  },
  computed: {
    materialesFiltrados() {
      let filtradas = this.materiales;
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
      return filtradas;
    }
  },
  methods: {
    initialize() {
      this.getMateriales();
    },
    cambiarTipoMaterial() {
      this.isMake = false;
      this.isBuy = false;
      this.isMP = false;
      this.isHerramienta = false;
      console.log(this.material.tipo);
      if (this.material.tipo == "MAKE") this.isMake = true;
      if (this.material.tipo == "BUY") this.isBuy = true;
      if (this.material.tipo == "MP") this.isMP = true;
      if (this.material.tipo == "HERRAMIENTA") this.isHerramienta = true;
    },
    cambiarForma() {
      this.isTubo = false;
      this.isPlaca = false;
      this.isBarra = false;
      this.isOtro = false;
      if (this.material.tipoMaterial == "Tubo") this.isTubo = true;
      if (this.material.tipoMaterial == "Barra") this.isBarra = true;
      if (this.material.tipoMaterial == "Placa") this.isPlaca = true;
      if (this.material.tipoMaterial == "Otro") this.isOtro = true;
    },
    async getMaterial(myId) {
      this.isLoading = true;
      console.log("id material: " + myId);
      let myUrl = process.env.VUE_APP_API + "newModules/materiales.php";
      let respuesta = await axios.post(myUrl, {
        request: 1,
        id: myId,
        tipo: "getOne",
        token: localStorage.token
      });
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        this.material = respuesta.data.rows[0];
        this.isLoading = false;
      }
    },
    async getMateriales() {
      let myUrl = process.env.VUE_APP_API + "newModules/materiales.php";
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
    async eliminar(ind) {
      this.materiales.splice(ind, 1);
      let myUrl = process.env.VUE_APP_API + "newModules/materiales.php";
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
        this.$toasted.success("Material eliminado").goAway(2000);
        console.log(this.idEliminar);
      }
    },

    async descargarReporte() {
      let columnasProcesadas = [];
      var registros = XLSX.utils.json_to_sheet(columnasProcesadas);
      var wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, registros, "registros");
      var sheet = wb.Sheets[wb.SheetNames[0]];
      var offset = 1;

      this.materialesFiltrados.map((registro, i) => {
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

      XLSX.writeFile(wb, `RegistrosMateriales.xlsx`);
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
    }
  }
};
</script>

<style scoped>
.myContainer {
  margin: 10px;
}
</style>
