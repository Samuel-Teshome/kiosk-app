export default ({ config }) => {
  const ENV = process.env.APP_ENV || "development";

  const BASE_URLS = {
    development: "http://localhost:3000",
    staging: "http://local.kiosk.ati.gov.et:3000",
    production: "https://kiosk.ati.gov.et:3000",
  };

  return {
    ...config,
    extra: {
      BASE_URL: BASE_URLS[ENV],
      APP_ENV: ENV,
    },
  };
};
