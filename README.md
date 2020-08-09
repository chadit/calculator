# Calculator Applicaton

React Application that is served up with a `Go` api server.

### Before you start

Make sure you have the following items installed:

- [Go](https://golang.org/dl/)

- [NPM & Node.js](https://www.npmjs.com/get-npm)

Once the above items are installed. Initalize all the npm modules for the

react via `make install`

### Building

`make build` builds the react app and api.

`make app` builds the react app.

`make api` builds the api server.

The artifacts from the build are copied to `bin/`

### Running the app

`make run` builds and runs the application. Go to http://localhost:3000

once the app is running.

`make debug` builds and runs the application separately from the react app. React dev server will be started on http://localhost:8080 and the server on http://localhost:3000

### React application

The react application source files are stored in `./client`.
