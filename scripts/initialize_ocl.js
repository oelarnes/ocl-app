const { initializeDb, syncData } = require("ocl-data");

if (!module.parent) {
  initializeDb().then(syncData).then(() => {
    console.log("Initialization Complete");
    process.exit();
  });
}
