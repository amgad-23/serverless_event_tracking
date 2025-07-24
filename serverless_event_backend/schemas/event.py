from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class EventIn(BaseModel):
    user_id: str = Field(...)
    event_type: str = Field(...)
    timestamp: datetime = Field(...)

class EventOut(BaseModel):
    user_id: str
    event_type: str
    timestamp: datetime

class SummaryOut(BaseModel):
    total_events: int 