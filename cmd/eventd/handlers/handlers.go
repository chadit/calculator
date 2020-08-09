package handlers

import (
	"fmt"
	"log"
	"net/http"

	"github.com/chadit/interview/sezzle/cmd/eventd/handlers/websocket"
	"github.com/chadit/interview/sezzle/internal/sys/web"
	"github.com/julienschmidt/httprouter"
)

// App represents the application and has the configuration
// and router.
type App struct {
	handler http.Handler
}

// NewApp returns a new instance of the with routes loaded.
func NewApp() (*App, error) {
	var a App

	a.initHandler()

	return &a, nil
}

// Shutdown shuts down the app and disconnects the mqtt client.
func (a *App) Shutdown() {
}

// ServeHTTP is the handler interface to handle serving up the handlers.
func (a *App) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	a.handler.ServeHTTP(w, r)
}

// home route for api
func (a *App) home(w http.ResponseWriter, r *http.Request) {
	web.Respond(w, map[string]interface{}{}, http.StatusOK)
}

// initHandler creates a new router initializes all the routes.
// and wraps them in a global middleware.
func (a *App) initHandler() {
	r := httprouter.New()

	// serve static files for react js
	r.ServeFiles("/static/*filepath", http.Dir("public/static/"))
	r.ServeFiles("/app/*filepath", http.Dir("public/"))

	// Redirect / to /app
	home := func(w http.ResponseWriter, r *http.Request) {
		http.Redirect(w, r, "/app", http.StatusMovedPermanently)
	}
	r.Handler("GET", "/", http.HandlerFunc(home))

	// setup and start web sockets
	pool := websocket.NewPool()
	go pool.Start()

	r.GET("/ws", func(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
		a.serveWs(pool, w, r)
	})

	// handle 404 error
	// TODO: handle as 404 page
	nf := func(w http.ResponseWriter, r *http.Request) {
		err := web.NewHTTPErr(http.StatusNotFound, "not found")
		web.RespondError(w, err)
	}
	r.NotFound = http.HandlerFunc(nf)

	// handle Method Not Allowed
	na := func(w http.ResponseWriter, r *http.Request) {
		err := web.NewHTTPErr(http.StatusMethodNotAllowed, "method not allowed")
		web.RespondError(w, err)
	}
	r.MethodNotAllowed = http.HandlerFunc(na)

	// handle panics with a 500 error.
	se := func(w http.ResponseWriter, r *http.Request, i interface{}) {
		log.Printf("panic:\n %+v", i)

		err := web.NewHTTPErr(http.StatusInternalServerError, "internal server error")
		web.RespondError(w, err)
	}
	r.PanicHandler = se

	// ready handler to be used by kubernetes.
	ready := func(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
		web.Respond(w, nil, http.StatusOK)
	}
	r.GET("/ready", ready)

	// Wrap all the routes with a global middleware.
	a.handler = web.RequestMW(r)
}

func (a *App) serveWs(pool *websocket.Pool, w http.ResponseWriter, r *http.Request) {
	fmt.Println("WebSocket Endpoint Hit")
	conn, err := websocket.Upgrade(w, r)
	if err != nil {
		fmt.Fprintf(w, "%+v\n", err)
	}

	client := &websocket.Client{
		Conn: conn,
		Pool: pool,
	}

	pool.Register <- client
	client.Read()
}
