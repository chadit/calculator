package websocket

import (
	"fmt"
	"log"
	"reflect"
	"sync"
	"time"

	"github.com/chadit/interview/sezzle/cmd/eventd/handlers/memorycache"
	"github.com/gofrs/uuid"
	"github.com/gorilla/websocket"
)

// Client is the properties needed inorder to make websocket calls.
type Client struct {
	ID   string
	Conn *websocket.Conn
	Pool *Pool
	mu   sync.Mutex
}

// Message is the defenition of the message struct that passes between the server and cient.
type Message struct {
	TimeStamp int64  `json:"timeStamp"`
	Body      string `json:"body"`
}

func (c *Client) Read() {
	defer func() {
		c.Pool.Unregister <- c
		c.Conn.Close()
	}()

	for {
		messageType, p, err := c.Conn.ReadMessage()
		if err != nil {
			log.Println(err)
			return
		}

		fmt.Println(reflect.TypeOf(messageType))

		// at this time we are only handling messages of type 1.
		if messageType == 1 {
			nanos := time.Now().UnixNano()
			message := Message{TimeStamp: nanos, Body: string(p)}
			c.Pool.Broadcast <- message
			fmt.Printf("Message Received: %+v\n", message)

			// cache message
			var u1 = uuid.Must(uuid.NewV4())

			_ = c.Pool.Cache.Set(u1.String(), message, memorycache.Forever)
		} else {
			log.Printf("unsupported message type: %d\n", messageType)
		}

	}
}
