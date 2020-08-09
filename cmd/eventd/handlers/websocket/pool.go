package websocket

import (
	"fmt"
	"log"
	"sort"

	"github.com/chadit/interview/sezzle/cmd/eventd/handlers/memorycache"
)

// Pool definition for websockets.
type Pool struct {
	Register   chan *Client
	Unregister chan *Client
	Clients    map[*Client]bool
	Broadcast  chan Message
	Cache      memorycache.Cache
}

// NewPool initializer.
func NewPool() *Pool {
	cache, err := memorycache.NewWithOption(memorycache.Option{
		MaxEntrySize:       1024,
		MaxEntriesKey:      10,
		MaxEntriesInWindow: 1024 * 1024,
		OnRemove: func(key string, value interface{}) {
			fmt.Printf("Key %s is removed\n", key)
		},
		OnRemoveWithReason: func(key string, reason string) {
			fmt.Printf("Key %s is removed because of %s\n", key, reason)
		},
	})
	if err != nil {
		fmt.Println(err)
	}

	return &Pool{
		Register:   make(chan *Client),
		Unregister: make(chan *Client),
		Clients:    make(map[*Client]bool),
		Broadcast:  make(chan Message),
		Cache:      cache,
	}
}

// Start listens for pool changes.
func (pool *Pool) Start() {
	for {
		select {
		case client := <-pool.Register:
			pool.Clients[client] = true

			cachedItems, err := pool.Cache.GetAll()
			if err != nil {
				log.Fatalf("fetched cached items: %+v", err)
			}

			log.Println("Loop cached items -->")
			for i := range cachedItems {
				log.Println(cachedItems[i])
			}
			log.Println("<-- end loop cached items")

			//	pool.Cache.data
			// if err := client.Conn.WriteJSON(message); err != nil {
			// 	fmt.Println(err)
			// 	return
			// }
			fmt.Println("Size of Connection Pool: ", len(pool.Clients))
			for client := range pool.Clients {
				fmt.Println(client)
				//client.Conn.WriteJSON(Message{Type: 1, Body: "New User Joined..."})
			}
			break
		case client := <-pool.Unregister:
			delete(pool.Clients, client)
			fmt.Println("Size of Connection Pool: ", len(pool.Clients))
			for client := range pool.Clients {
				fmt.Println(client)
				//client.Conn.WriteJSON(Message{Type: 1, Body: "User Disconnected..."})
			}
			break
		case message := <-pool.Broadcast:
			fmt.Println("Broadcast message to all clients in Pool")
			fmt.Println("message:", message)

			cachedItems, err := pool.Cache.GetAll()
			if err != nil {
				log.Fatalf("1fetched cached items: %+v", err)
			}

			log.Println("1Loop cached items -->")
			var messages []Message
			for i := range cachedItems {
				messages = append(messages, cachedItems[i].(Message))
				//log.Println(cachedItems[i])
			}

			sort.SliceStable(messages, func(i, j int) bool { return messages[i].TimeStamp > messages[j].TimeStamp })

			for i := range messages {
				log.Println(messages[i])
			}

			log.Println("<-- 1end loop cached items")

			for client := range pool.Clients {
				if err := client.Conn.WriteJSON(messages); err != nil {
					fmt.Println(err)
					return
				}
			}
		}
	}
}
