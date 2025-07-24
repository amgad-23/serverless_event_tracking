from sqlalchemy.orm import Session
from models.event import Event
from datetime import datetime
from typing import Optional, List


class EventService:
    """Service for event creation, querying, and summary logic."""

    @staticmethod
    def create_event(db: Session, user_id: str, event_type: str, timestamp: datetime) -> Event:
        """Create and persist a new event."""
        event = Event(user_id=user_id, event_type=event_type, timestamp=timestamp)
        db.add(event)
        db.commit()
        db.refresh(event)
        return event

    @staticmethod
    def get_event_count(db: Session, user_id: Optional[str] = None, event_type: Optional[str] = None) -> int:
        """Count events matching optional filters."""
        query = db.query(Event)
        if user_id:
            query = query.filter(Event.user_id == user_id)
        if event_type:
            query = query.filter(Event.event_type == event_type)
        return query.count()

    @staticmethod
    def get_recent_events(db: Session, limit: int = 10) -> List[Event]:
        """Return the most recent events, up to the given limit."""
        return db.query(Event).order_by(Event.timestamp.desc()).limit(limit).all()
