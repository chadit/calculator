# build binary
FROM golang as builder
COPY . /go/src/github.com/chadit/sezzle
WORKDIR /go/src/github.com/chadit/sezzle
ARG VERSION=0.0.0
ENV TAG_VERSION=$VERSION

RUN CGO_ENABLED=0 go build -a -ldflags "-X main.Build=$VERSION-`date -u +.%Y%m%d.%H%M%S`" -o ./bin/eventd ./cmd/eventd

FROM node:10-alpine

COPY ./bin /go/src/github.com/chadit/sezzle
WORKDIR /go/src/github.com/chadit/sezzle

COPY --from=builder /go/src/github.com/chadit/sezzle/bin/eventd /go/src/github.com/chadit/sezzle/eventd
RUN ls /go/src/github.com/chadit/sezzle -ll

CMD [ "/go/src/github.com/chadit/sezzle/eventd"]