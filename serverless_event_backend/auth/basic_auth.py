from chalice import UnauthorizedError
import base64
import os

USERNAME = os.getenv('BASIC_AUTH_USER', 'admin')
PASSWORD = os.getenv('BASIC_AUTH_PASS', 'changeme')


def check_basic_auth(request):
    # auth = request.headers.get('authorization')
    # if not auth or not auth.lower().startswith('basic '):
    #     raise UnauthorizedError('Missing or invalid Authorization header')
    # encoded = auth.split(' ', 1)[1].strip()
    # decoded = base64.b64decode(encoded).decode('utf-8')
    # user, pwd = decoded.split(':', 1)
    # if user != USERNAME or pwd != PASSWORD:
    #     raise UnauthorizedError('Invalid credentials')
    pass
