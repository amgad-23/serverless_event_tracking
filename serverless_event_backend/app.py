from chalice import Chalice, Response
from models.db import Base, engine
from routes import events, summary

app = Chalice(app_name='serverless_event_backend')

# Initialize the database
Base.metadata.create_all(engine)
# Register the routes
app.register_blueprint(events.events_blueprint)
app.register_blueprint(summary.summary_blueprint)

@app.route('/')
def index():
    # return {'hello': 'world'}
    return Response(
        body={'asdsadsad': 'world'},
        status_code=200,
        headers={'Content-Type': 'application/json'}
    )

# The view function above will return {"hello": "world"}
# whenever you make an HTTP GET request to '/'.
#
# Here are a few more examples:
#
# @app.route('/hello/{name}')
# def hello_name(name):
#    # '/hello/james' -> {"hello": "james"}
#    return {'hello': name}
#
# @app.route('/users', methods=['POST'])
# def create_user():
#     # This is the JSON body the user sent in their POST request.
#     user_as_json = app.current_request.json_body
#     # We'll echo the json body back to the user in a 'user' key.
#     return {'user': user_as_json}
#
# See the README documentation for more examples.
#
