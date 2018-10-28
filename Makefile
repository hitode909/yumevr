start:
	python -m SimpleHTTPServer 3005 &
	ngrok http 3005
deploy:
	aws s3 cp index.html s3://yumevr --profile private
	aws s3 cp yumevr.js  s3://yumevr --profile private