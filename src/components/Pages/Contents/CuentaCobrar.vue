<style scoped>
.centrado {
  text-align: center;
}
.overflowY {
  overflow-y: auto;
}
.izquierdado {
  text-align: left;
}
.contenedor {
  margin: 10px;
}
</style>
<template>
  <div class="contenedor">
    <h1>
      {{ cuenta.id ? "Cuenta por cobrar" : "Agregar cuenta por cobrar" }} :
      {{ cuenta.descripcion }}
    </h1>
    <v-row>
      <v-col cols="12" sm="12" md="6" lg="4">
        <v-select
          v-model="cuenta.cliente"
          :items="clientes"
          :rules="[rules.required]"
          label="Cliente"
          required
        ></v-select>
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="4">
        <v-select
          v-model="cuenta.base"
          :items="bases"
          :rules="[rules.required]"
          label="Base"
          required
        ></v-select>
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="4">
        <v-select
          v-model="cuenta.linea"
          :items="lineas"
          :rules="[rules.required]"
          label="Línea"
          required
        ></v-select>
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="4">
        <v-text-field v-model="cuenta.po" label="PO"></v-text-field>
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="4">
        <v-text-field
          v-model="cuenta.documento"
          label="Documento"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="4">
        <v-select
          v-model="cuenta.estatus"
          :items="estatus"
          :rules="[rules.required]"
          label="Estatus"
          required
        ></v-select>
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="4">
        <v-text-field v-model="cuenta.ov" label="OV"></v-text-field>
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="4">
        <v-text-field
          v-model="cuenta.cotizacion"
          label="Cotización"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="4">
        <v-text-field
          v-model="cuenta.descripcion"
          label="Descripción"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="4">
        <v-text-field
          v-model="cuenta.cobrado"
          label="Cobrado"
          type="number"
          value="0.00"
          prefix="$"
          suffix="MXN"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="4">
        <v-text-field
          v-model="cuenta.facturado"
          label="Facturado"
          type="number"
          value="0.00"
          prefix="$"
          suffix="MXN"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="4">
        <v-text-field
          v-model="cuenta.pendFactura"
          label="Pendiente de factura"
          type="number"
          value="0.00"
          prefix="$"
          suffix="MXN"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="4">
        <v-text-field
          v-model="cuenta.enEjecucion"
          label="En ejecución"
          type="number"
          value="0.00"
          prefix="$"
          suffix="MXN"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="4">
        <v-text-field
          v-model="cuenta.proyectado"
          label="Proyectado"
          type="number"
          value="0.00"
          prefix="$"
          suffix="MXN"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="4">
        <v-menu
          v-model="dateMenu1"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="cuenta.fechaFactura"
              label="Fecha de factura"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            locale="es"
            v-model="cuenta.fechaFactura"
            @input="dateMenu1 = false"
          ></v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="4">
        <v-menu
          v-model="dateMenu2"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="cuenta.fechaIngresoFactura"
              label="Ingreso de factura"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            locale="es"
            v-model="cuenta.fechaIngresoFactura"
            @input="dateMenu2 = false"
          ></v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="4">
        <v-text-field
          v-model="cuenta.pIngresoFactura"
          label="P de ingreso de factura"
          required
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="4">
        <v-menu
          v-model="dateMenu3"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="cuenta.fechaPagado"
              label="Fecha pagado"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            locale="es"
            v-model="cuenta.fechaPagado"
            @input="dateMenu3 = false"
          ></v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="4">
        <v-text-field
          v-model="cuenta.pPago"
          label="P de pago"
          required
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="4">
        <v-menu
          v-model="dateMenu4"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="cuenta.vence"
              label="Vence"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            locale="es"
            v-model="cuenta.vence"
            @input="dateMenu4 = false"
          ></v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="4">
        <v-menu
          v-model="dateMenu5"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="cuenta.fechaTerminoOperacion"
              label="Fecha de termino de operación"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            locale="es"
            v-model="cuenta.fechaTerminoOperacion"
            @input="dateMenu5 = false"
          ></v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="4">
        <v-text-field
          v-model="cuenta.refacturado"
          label="Refacturado"
          required
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="4">
        <v-text-field
          v-model="cuenta.pEjecutado"
          label="P ejecutado"
          required
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="12" md="12" lg="12" align-self="center">
        <v-btn @click="guardar">{{ cuenta.id ? "Guardar" : "Agregar" }}</v-btn>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "Cuenta",
  data: () => ({
    cuenta: {
      id: null
    },
    rules: {
      required: value => !!value || "Requerido",
      counter: value => value.length > 4 || "Pocos caracteres",
      cantidad: v => {
        if (!isNaN(parseFloat(v)) && v >= 1) return true;
        return "Valores mayores a 1";
      }
    },
    indexIzq: null,
    indexDer: null,
    conjuntoTags: [],
    partes: [],
    dateMenu1: false,
    dateMenu2: false,
    dateMenu3: false,
    dateMenu4: false,
    dateMenu5: false,
    clientes: [
      "MAR",
      "BH",
      "BH-USA",
      "EPS",
      "GRUPOR",
      "LATINA",
      "LIF",
      "MAREN",
      "SLB",
      "TYP",
      "WFT",
      "AKAL"
    ],
    bases: ["MID", "CDC"],
    lineas: [
      "PACKER",
      "INST&REC VTTA",
      "SENSORES",
      "FLOW CONTROL",
      "STE",
      "MAQUINADO",
      "MONITOREO"
    ],
    estatus: [
      "CANCELADA",
      "COBRADO",
      "EN EJECUCIÓN",
      "FACTPENDINGRESO",
      "FACTURADO",
      "PENDFACT",
      "PROYECCIÓN"
    ],
    partesEnCuenta: [],
    isSaving: false,
    isLoading: false,
    isLoadingEnCuenta: false
  }),
  methods: {
    guardar: async function() {
      this.id = this.$route.params.id;
      this.isSaving = true;
      this.$toasted.show("Guardando... No cierres la página").goAway(2000);
      myURL = process.env.VUE_APP_API + "actualizarCuentaCobrar.php";
      let myURL = process.env.VUE_APP_API + "actualizarCuentaCobrar.php";
      if (!this.id) myURL = process.env.VUE_APP_API + "agregarCuentaCobrar.php";
      let respuesta = await axios.post(myURL, {
        request: 1,
        id: this.id,
        cuenta: this.cuenta,
        token: localStorage.token
      });
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        this.isSaving = false;
        this.$toasted.success("Guardando correctamente").goAway(2000);
      }
    }
  },
  mounted: async function() {
    this.id = this.$route.params.id;
    this.isLoading = true;
    this.isLoadingEnCuenta = true;
    if (!this.id) {
      this.isLoading = false;
      return;
    }
    let respuesta = await axios.post(
      process.env.VUE_APP_API + "obtenerCuentaCobrar.php",
      {
        request: 1,
        id: this.id,
        token: localStorage.token
      }
    );
    localStorage.token = respuesta.data.token;
    if (respuesta.data.status == "Ok") {
      this.cuenta = respuesta.data.rows[0];
      this.isLoading = false;
    }
  }
};
</script>
