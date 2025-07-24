from chalice import Response, Blueprint
from models.db import SessionLocal
from schemas.event import SummaryOut
from auth.basic_auth import check_basic_auth
from typing import Any

from services.event_service import EventService

summary_blueprint = Blueprint(__name__)


@summary_blueprint.route('/summary', methods=['GET'], cors=True)
def get_summary() -> Any:
    check_basic_auth(summary_blueprint.current_request)
    try:
        req = summary_blueprint.current_request
        user_id = req.query_params.get('user_id') if req.query_params else None
        event_type = req.query_params.get('event_type') if req.query_params else None
        db = SessionLocal()
        count = EventService.get_event_count(db, user_id, event_type)
        db.close()
        return SummaryOut(total_events=count).dict()
    except Exception as e:
        return Response(body={'error': str(e)}, status_code=500)
