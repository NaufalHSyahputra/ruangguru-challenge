FROM golang:1.16-alpine

WORKDIR /app/go

COPY ./back/go.mod .
COPY ./back/go.sum .
RUN go mod download

COPY ./back .

RUN go build -o ./rg_backend

EXPOSE 8080

CMD [ "./rg_backend" ]