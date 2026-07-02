from datetime import date, datetime
from enum import Enum
from uuid import UUID

from pydantic import BaseModel, Field


class Level(str, Enum):
    LOW = "baixa"
    MEDIUM = "media"
    HIGH = "alta"


class TaskCreate(BaseModel):
    name: str = Field(..., min_length=3, max_length=120)
    due_date: date
    difficulty: Level
    importance: Level


class StoredTask(TaskCreate):
    id: UUID
    created_at: datetime


class TaskResponse(StoredTask):
    priority_label: Level
    priority_score: int = Field(..., ge=0, le=100)
    rationale: str
