PHONY: app api build install run debug
SHELL := /bin/bash

app:
	@cd "client" && \
		npm run build && \
		rm -rf ../bin/public/* && \
		yes | mkdir -p ./bin/public && \
		cp -rip build/* ./../bin/public

api:
	go build -o ./bin/eventd ./cmd/eventd

build: api app

install:
	@cd client && \
		npm install

run: api app
	@cd bin && \
		./eventd

debug-app:
	@cd "client" && \
		REACT_APP_API_URL="//localhost:3000/api" NODE_ENV=development PORT=8080 npm run start &

debug: api debug-app
	@cd bin && \
		./eventd
