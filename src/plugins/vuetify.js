import Vue from "vue";
import Vuetify from "vuetify/lib";
import colors from "vuetify/lib/util/colors";
Vue.use(Vuetify);
export default new Vuetify({
  options: {
    customProperties: true
  },
  theme: {
    themes: {
      light: {
        primary: colors.red.darken2,
        secondary: colors.blueGrey.darken1,
        rest: colors.grey.lighten3,
        accent: colors.red.lighten2,
        error: colors.red.darken1,
        danger: colors.red.darken1,
        info: colors.blue.darken1,
        warning: colors.yellow.darken1,
        success: colors.green.darken1,
        textColor: "#000"
      },
      monokai: {
        primary: "#ab9df2",
        secondary: "#78dce8",
        rest: colors.grey.darken3,
        accent: "#ff6188",
        error: "#fc9867",
        danger: "#ff6188",
        info: "#78dce8",
        warning: "#ffd866",
        success: "#a9dc76"
      },
      dark: {
        primary: colors.red.darken2,
        secondary: colors.blueGrey.lighten2,
        rest: colors.grey.darken3,
        accent: colors.red.lighten2,
        error: colors.red.lighten1,
        danger: colors.red.lighten1,
        info: colors.blue.lighten1,
        warning: colors.yellow.lighten1,
        success: colors.green.lighten1,
        textColor: "#fff"
      }
    }
  }
});
