cd "$(dirname "$0")"
openssl genrsa -out $1.server.key 2048
openssl req -new -out $1.server.csr -key $1.server.key -subj "/CN=$1"
openssl req -text -noout -in $1.server.csr
openssl x509 -req -days 1024 -in $1.server.csr -signkey $1.server.key -out $1.server.crt -extfile generate.ext