import { createDiscreteApi } from "naive-ui";
// import NaiveUiThemeData from "@/assets/json/naive-ui-theme-overrides.json";

const { message, dialog, notification, modal } = createDiscreteApi(
  ["message", "dialog", "notification", "modal"],
  {
    // configProviderProps: {
    //   themeOverrides: NaiveUiThemeData,
    // },
    messageProviderProps:{
      max:10,
      duration:5000,
      keepAliveOnHover: true,
    }
  }
);

export { message, dialog, notification, modal };
