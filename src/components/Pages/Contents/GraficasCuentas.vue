<style>
.contenedor {
  margin: 10px;
}
</style>
<template>
  <v-card color="rest" elevation="0" flat>
    <div class="contenedor">
      <v-row>
        <v-col cols="12" sm="12" md="6">
          <v-card>
            <v-container>
              <h4>Cuentas de últimos 12 meses</h4>
              <GChart
                type="ColumnChart"
                :data="barChartData"
                :options="barChartOptions"
                :resizeDebounce="500"
              />
            </v-container>
          </v-card>
        </v-col>
        <v-col cols="12" sm="12" md="6">
          <v-card>
            <v-container>
              <h4>Cuentas por línea</h4>
              <GChart
                type="BarChart"
                :data="barSideChartData"
                :options="barSideChartOptions"
                :resizeDebounce="500"
              />
            </v-container>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-card>
</template>
<script>
import { GChart } from "vue-google-charts";
export default {
  name: "GraficasCuentas",
  components: { GChart },
  props: {
    items: {
      required: false
    }
  },
  watch: {
    items: function() {
      this.initialize();
    }
  },
  data: () => ({
    barChartData: [
      [
        "Mes",
        "Monto total",
        "Cobrado",
        "Facturado",
        "Pendiente",
        "Ejecución",
        "Proyectado"
      ]
    ],
    barSideChartData: [["Línea", "Monto"]],
    barChartOptions: {
      chart: {
        title: "Seguimiento de cobros",
        subtitle: "Cobros",
        width: 300,
        height: 400
      }
    },
    barSideChartOptions: {
      chart: {
        title: "Seguimiento de cobros",
        subtitle: "Cobros",
        width: 300,
        height: 400
      }
    }
  }),
  created() {
    this.initialize();
  },
  methods: {
    initialize() {
      this.barChartData = [
        [
          "Mes",
          "Monto total",
          "Cobrado",
          "Facturado",
          "Pendiente",
          "Ejecución",
          "Proyectado"
        ]
      ];
      this.barSideChartData = [["Línea", "Monto"]];
      this.setBarChart();
      this.setSideBarChart();
    },
    getLastMonths() {
      const monthNames = [
        "Ene",
        "Feb",
        "Mar",
        "Abr",
        "May",
        "Jun",
        "Jul",
        "Ago",
        "Sep",
        "Oct",
        "Nov",
        "Dic"
      ];
      let myMonths = [];
      //Necesito ubicar en que mes estoy
      let d = new Date();
      let n = d.getMonth();
      //Después de eso, necesito un array con los meses anteriores
      for (let i = 0; i < 12; i++) {
        let myNum = n - i;
        let myYear = new Date().getFullYear();
        if (n - i < 0) {
          myNum = myNum + 12;
          myYear -= 1;
        }

        myMonths.unshift({ m: myNum, year: myYear });
      }
      return { monthNames: monthNames, myMonths: myMonths };
      //Después necesito una manera de comparar cada item con ese mes, y agregarle a dicho atributo
    },
    setBarChart() {
      let { monthNames, myMonths } = this.getLastMonths();
      myMonths.forEach(item => {
        let montoTotal = 0,
          cobrado = 0,
          facturado = 0,
          pendiente = 0,
          ejecucion = 0,
          proyectado = 0;

        this.items.forEach(itm => {
          let myDate = new Date(itm.fechaFactura + " 00:00:01");
          let m = myDate.getMonth();
          let year = myDate.getFullYear();
          if (m == item.m && year == item.year) {
            cobrado += parseFloat(itm.cobrado);
            facturado += parseFloat(itm.facturado);
            pendiente += parseFloat(itm.pendFactura);
            ejecucion += parseFloat(itm.enEjecucion);
            proyectado += parseFloat(itm.proyectado);
            montoTotal =
              montoTotal +
              cobrado +
              facturado +
              pendiente +
              ejecucion +
              proyectado;
          }
        });
        this.barChartData.push([
          `${monthNames[item.m]} 
          ${item.year}`,
          montoTotal,
          cobrado,
          facturado,
          pendiente,
          ejecucion,
          proyectado
        ]);
      });
    },
    setSideBarChart() {
      let myLines = [
        "PACKER",
        "INST&REC VTTA",
        "SENSORES",
        "FLOW CONTROL",
        "STE",
        "MAQUINADO",
        "MONITOREO"
      ];
      myLines.forEach((item, ind) => {
        let montoTotal = 0,
          cobrado = 0,
          facturado = 0;

        this.items.forEach(itm => {
          if (itm.linea == myLines[ind]) {
            cobrado += parseFloat(itm.cobrado);
            facturado += parseFloat(itm.facturado);
            montoTotal = montoTotal + cobrado + facturado;
          }
        });
        this.barSideChartData.push([myLines[ind], montoTotal]);
      });
    }
  }
};
</script>
