# <img src="doc/assets/mess.png" align="left" height="60"/> MESS - Mongo DB Event Sourcing
#### This is a modified clone of the [EventSourcing](https://github.com/zeppaman/mongo-event-sourcing)

Documentation

- [How to install MESS](https://github.com/zeppaman/mongo-event-sourcing/blob/main/README.md#how-to-install-mess)
- [How to configure MESS](https://github.com/zeppaman/mongo-event-sourcing/blob/main/README.md#how-to-configure-mess)
- [License](https://github.com/zeppaman/mongo-event-sourcing/blob/main/README.md#license)

Resources

- [MESS on Docker Hub](https://hub.docker.com/r/idrisakintobi/mongo-event-sourcing)

## What is MESS?

**MESS** is an open-source tool that implement event sourcing listening event from mongodb. For who is used to play with traditional RDMS it's something like triggers, but fire events outside database. This application uses the built-in mongodb feature called ChangeStream.

So, adding MESS in your architecture you can forward event for data changes to applications by using webhook or simply add event to a queue like rabbitMQ or Kibana.

_The acronym MESS stand for MongoDB Event Sourcing. The more pretty will ask what is the meaning of the last S. I can tell stands for System, but the reality is that it sound more cool with 2 S._

## How to install MESS?

There are three scenarios:

1. clone and forget: as every nodejs application you can edit and change as you like. Not recommended old style approach.
2. include in you own project. instal as a module on top of your application, then extend and use it.
3. use ready to go docker images: nothing to do except write your own configuration. You will have any customization opportunity of other scenarios, but with a ready to go option.

### Clone and forget

This approach is not recommended and useful only if you want to for this project and use for building something custom.
If you are aware of the risk to the follow (or see next methods :) )

```
git clone <this repo URL>
npm run serve //for prod
npm run dev // for dev
```

### Use Docker

This is the most common and convenient option. The docker images is ready to go and you can include it in a docker-compose file as the following:

```yaml
version: "3.8"
services:
  node:

    image: idrisakintobi/mongo-event-sourcing
    #these settings overrides the .env file
    environment:
      - NODE_ENV=production
      - PORT=5000
      - MONGODB_URL=<my mongo url>
   volumes:
     - ./config/:/usr/src/app/config/
    ports:
      - 5001:5000
   # command: "npm run serve"
```

Once you have mapped the volume, you can write your own file into `./config/config.js`. Inside this folder you can write and include other plugin or override the default behavior.

## How to configure MESS?

The main configuration file is located into `./config/config.js` and contains a JavaScript object. In this file you can configure and override the default behavior of the system.
The file has the following format

```js
{
    // default settings
    "database name":
    {
        //database level settings
        collection:{
            //collection level settings
        }
    }

}
```

The method or settings more specific are always selected, so when you process a data from a collection the collection scoped settings has priority. Then a fallback takes database related settings if collection related are not preset. Then the default one are used if no database related settings are configured.

### Listen changes

In order to listen changes the database must be added to the settings (just create an empty entry like `"myDb": {}` into the config). If no collection is added, all the collections are listed. If you want to listen only some collection, just add it. Also in this case you just need an empty entry inside the database node with the collection name.

### Overrides methods

Here the list of the override methods and signature.

| Method     | Signature                     | Description                         |
| ---------- | ----------------------------- | ----------------------------------- |
| changeHook | async function (item,context) | listen for the change of a data row |

All other methods in `action.js` can be overridden by adding it in your `./config/config.js`, but are intended for internal use only.

### Plugin pipeline

The event management is composed by a pipeline of actions. Each one is an async function that manipulate data and pass it to the next processor. The system comes out of the box with the following plugins:

| Plugin | configuration                                                  | Description                         |
| ------ | -------------------------------------------------------------- | ----------------------------------- |
| log    | no config                                                      | listen for the change of a data row |
| http   | `config: {"endpoint":"https://enusprb2hskaq.x.pipedream.net"}` | send data to an URL                 |

You can create as many action you want by adding it into the action list inside the plugin list of `./config/config.js` .

```js
plugins:
    {
        "dummy": async function (input,config,context)
        {
            console.log("NOTHING");
            return input;
        }
    },
```

Each action has the following parameters:

- **input:** is the data
- **config:** is the configuration settings (choose using the fallback rule)

The plugin order is defined by the pipeline object. As usual in this library you can specify it at collection, db, or use the default value. The pipeline definition contains the name of the action an the related config. See the next example:

```js
 pipeline: [
        {
            name:"log"

        },
        {
            name:"http",
            config:
            {
                "endpoint":"https://enusprb2hskaq.x.pipedream.net"
            }

        },
        {
            name:"dummy",
            config:
            {

            }

        }
    ],
```

See the [sample configuration](config/config.js) file for more details.

## Parameters

You can change basic application settings by:

- changing the .env file
- setting variable before the node command, ex. `PORT=5000 npm run serve'
- adding the variable as docker environment variables or system wide variables

Inside the [docker example] (samples/docker/docker-compose.yml) you can find a docker example.

The list of variables allowed are:

| Plugin    | Description                     |
| --------- | ------------------------------- |
| PORT      | the server port number          |
| MONGO_URL | connection string to the server |

## License

This project is licensed under the terms of [GPL-3](LICENSE.md).
Make the best of it.

<div>Icons made by <a href="https://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
