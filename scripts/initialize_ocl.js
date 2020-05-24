const { initializeDb, dataSync } = require("ocl-data");

if (!module.parent) {
  initializeDb().then(dataSync).then(() => {
    console.log("Initialization Complete");
    process.exit();
  });
}
