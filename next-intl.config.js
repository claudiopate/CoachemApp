module.exports = {
  locales: ["en", "it"], // Ensure 'it' is included
  defaultLocale: "en",
  messages: {
    en: require("./messages/en.json"),
    it: require("./messages/it.json"), // Ensure this file exists
  },
};
