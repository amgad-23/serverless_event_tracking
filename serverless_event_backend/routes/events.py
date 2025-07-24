from datetime import datetime
from typing import Any
from chalice import Response, Blueprint
from models.db import SessionLocal
from models.event import Event
from schemas.event import EventIn, EventOut
from auth.basic_auth import check_basic_auth

from services.event_service import EventService

events_blueprint = Blueprint(__name__)


def serialize_event(event):
    return {
        'user_id': event.user_id,
        'event_type': event.event_type,
        'timestamp': event.timestamp.isoformat() if isinstance(event.timestamp, datetime) else str(event.timestamp)
    }


@events_blueprint.route('/events', methods=['POST'], cors=True)
def create_event() -> Any:
    check_basic_auth(events_blueprint.current_request)
    try:
        data = events_blueprint.current_request.json_body
        event_in = EventIn(**data)
        db = SessionLocal()
        EventService.create_event(db, event_in.user_id, event_in.event_type, event_in.timestamp)
        db.close()
        return {'message': 'Event created'}
    except Exception as e:
        return Response(body={'error': str(e)}, status_code=400)


@events_blueprint.route('/events', methods=['GET'], cors=True)
def list_events():
    try:
        db = SessionLocal()
        # Get all events (add .order_by if you want reverse-chronological)
        events = db.query(Event).order_by(Event.timestamp.desc()).all()
        db.close()
        return {'events': [serialize_event(e) for e in events]}
    except Exception as e:
        return Response(body={'error': str(e)}, status_code=500)