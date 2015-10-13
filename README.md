# Thingsee 3D Demo

Display basic parameters from a Thingsee One in a web app.

## Usage

Run `node server.js` to start a HTTP-to-WebSocket proxy and a web server to serve the static assets for the demo.

Create a Purpose for your Thingsee One to send acceleration & environmental data to the custom URL of your server instance: `http://servername:8000/api/events

Access the webapp at `http://servername:8080`. The view for a specific device is found at http://servername:8080#`[INSERT_DEVICEUUID]`. The UUID for your device can be found in the CLOUD.JSN file on your Thingsee One root drive.

#### Ports
The webapp is served from the port :8080 and should be accessible from any device in your network.
The HTTP API end point for Thingsee One data is served from the port :8000.

## 3D Demo Purpose Example

```
{
  "pId": "1",
  "apiVersion": "00.18",
  "initPuId": 1,
  "purposes": [
    {
      "puId": 1,
      "name": "3D Demo",
      "initStId": 0,
      "states": [
        {
          "stId": 0,
          "name": "Env",
          "events": [
            {
              "evId": 1,
              "name": "Environment",
              "actions": {
                "cloud": {
                  "sendEvent": true,
                  "host": "172.20.10.3",
                  "api": "api/events",
                  "port": 8000
                }
              },
              "causes": [
                {
                  "sId": "0x00060100",
                  "threshold": {
                    "count": 1
                  },
                  "measurement": {
                    "log": false,
                    "interval": 3000
                  },
                  "thresholds": {
                    "isAny": true
                  }
                },
                {
                  "sId": "0x00060200",
                  "threshold": {
                    "count": 1
                  },
                  "measurement": {
                    "log": false,
                    "interval": 3000
                  },
                  "thresholds": {
                    "isAny": true
                  }
                },
                {
                  "sId": "0x00060400",
                  "threshold": {
                    "count": 1
                  },
                  "measurement": {
                    "log": false,
                    "interval": 3000
                  },
                  "thresholds": {
                    "isAny": true
                  }
                },
                {
                  "sId": "0x00030200",
                  "threshold": {
                    "count": 1
                  },
                  "measurement": {
                    "log": false,
                    "interval": 3000
                  },
                  "thresholds": {
                    "isAny": true
                  }
                }
              ]
            }
          ]
        },
        {
          "stId": 1,
          "name": "Acceleration",
          "events": [
            {
              "evId": 0,
              "name": "Go Back",
              "actions": {
                "engine": {
                  "gotoStId": 0
                },
                "cloud": {
                  "sendEvent": true,
                  "sendPush": false,
                  "host": "172.20.10.3",
                  "api": "api/events"
                }
              },
              "causes": [
                {
                  "sId": "0x00050100",
                  "threshold": {
                    "count": 1
                  },
                  "measurement": {
                    "log": false
                  },
                  "thresholds": {
                    "isAny": true
                  }
                },
                {
                  "sId": "0x00050200",
                  "threshold": {
                    "count": 1
                  },
                  "measurement": {
                    "log": false
                  },
                  "thresholds": {
                    "isAny": true
                  }
                },
                {
                  "sId": "0x00050300",
                  "threshold": {
                    "count": 1
                  },
                  "measurement": {
                    "log": false
                  },
                  "thresholds": {
                    "isAny": true
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```