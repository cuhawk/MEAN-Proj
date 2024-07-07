build:
	docker build -f ./api.Dockerfile -t cuhawk-mean-api .
	docker build -f ./client.Dockerfile -t cuhawk-mean-client .

containerize:
	docker-compose -D -f docker-compose.yml up -d

open-macosx:
	open -a firefox -g http://localhost:4200
	open -a "Google Chrome" -g http://localhost:4200

all: build containerize open-macosx
