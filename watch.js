const config = require("./action");

const { MongoClient } = require("mongodb");

module.exports = async function watch(uri) {
  let client = new MongoClient(uri);
  client = await client.connect();

  // List all the available database
  let defaultDb = await client.db();
  let adminDb = defaultDb.admin();
  let databases = await adminDb.listDatabases();

  console.log(`Available databases: ${databases.databases}`);
  for (const element of databases.databases) {
    //only selected databases
    let dbConfig = config.databases[element.name];

    if (!dbConfig) {
      console.log(`${element.name} database not selected, skipping...`);
      continue;
    }
    console.log(`Configuring database ${element.name}`);

    let db = client.db(element.name);
    let collections = await db.listCollections().toArray();

    for (const collection of collections) {
      if (
        dbConfig.collections &&
        !dbConfig.collections.hasOwnProperty(collection.name)
      ) {
        console.log(`${collection.name} collection not selected, skipping...`);
        continue;
      }

      let changeStream = db.collection(collection.name).watch();
      console.log(`Watching ${collection.name} for changes...`);
      changeStream.on("change", (next) => config.invoke(next));
    }
  }
};
