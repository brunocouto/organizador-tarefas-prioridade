from datetime import date, datetime, timedelta
from uuid import uuid4

from .models import Level, StoredTask, TaskCreate, TaskResponse
from .priority import calculate_priority


class TaskStore:
    def __init__(self) -> None:
        self._tasks: list[StoredTask] = []
        self._seed()

    def list_tasks(self) -> list[TaskResponse]:
        return [self._to_response(task) for task in self._tasks]

    def create_task(self, task: TaskCreate) -> TaskResponse:
        stored_task = StoredTask(
            created_at=datetime.now(),
            id=uuid4(),
            **task.model_dump(),
        )
        self._tasks.insert(0, stored_task)

        return self._to_response(stored_task)

    def _to_response(self, task: StoredTask) -> TaskResponse:
        priority = calculate_priority(task)

        return TaskResponse(
            **task.model_dump(),
            priority_label=priority.priority_label,
            priority_score=priority.priority_score,
            rationale=priority.rationale,
        )

    def _seed(self) -> None:
        today = date.today()
        examples = [
            TaskCreate(
                difficulty=Level.HIGH,
                due_date=today + timedelta(days=1),
                importance=Level.HIGH,
                name="Finalizar entrega da avaliacao",
            ),
            TaskCreate(
                difficulty=Level.MEDIUM,
                due_date=today + timedelta(days=5),
                importance=Level.HIGH,
                name="Revisar README do projeto",
            ),
            TaskCreate(
                difficulty=Level.LOW,
                due_date=today + timedelta(days=12),
                importance=Level.MEDIUM,
                name="Organizar tarefas da semana",
            ),
        ]

        for task in examples:
            self._tasks.append(
                StoredTask(
                    created_at=datetime.now(),
                    id=uuid4(),
                    **task.model_dump(),
                )
            )


task_store = TaskStore()
