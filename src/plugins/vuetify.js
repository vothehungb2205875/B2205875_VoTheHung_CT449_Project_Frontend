// src/plugins/vuetify.js
import "vuetify/styles"; // import CSS của Vuetify
import { createVuetify } from "vuetify";

// Import bộ icon Material Design Icons (MDI)
import { aliases, mdi } from "vuetify/iconsets/mdi";

// Khởi tạo Vuetify
export default createVuetify({
  icons: {
    defaultSet: "mdi", // chọn bộ icon mặc định là mdi
    aliases,
    sets: {
      mdi,
    },
  },
  // bạn có thể cấu hình theme, breakpoint,... ở đây nếu cần
});
