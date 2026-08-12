import http.server
import socketserver

PORT = 8000

Handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
	print("Serving HTTP on port", PORT)
	try:
		httpd.serve_forever()
	except KeyboardInterrupt:
		print("\nServer stopped")
