import { createVuetify } from "vuetify";
import "vuetify/styles";

export default createVuetify({
  theme: {
    defaultTheme: "light",
    themes: {
      light: {
        colors: {
          primary: "#5e72e4",
          secondary: "#8392ab",
          success: "#2dce89",
          info: "#11cdef",
          warning: "#fb6340",
          danger: "#f53939",
          light: "#f8f9fa",
          dark: "#212529",
          default: "#121827",
        },
      },
    },
  },
});

