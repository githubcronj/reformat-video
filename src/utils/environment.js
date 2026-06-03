function getAppEnv() {
  return process.env.APP_ENV || "prod";
}

function isDevEnv() {
  return getAppEnv() === "dev";
}

function getBackendUrl() {
  const appEnv = getAppEnv();

  const backendUrl =
    appEnv === "dev"
      ? process.env.BACKEND_URL_DEV
      : process.env.BACKEND_URL_PROD;

  if (!backendUrl) {
    throw new Error(`Missing BACKEND_URL for APP_ENV=${appEnv}`);
  }

  return backendUrl;
}

module.exports = {
  getAppEnv,
  isDevEnv,
  getBackendUrl,
};