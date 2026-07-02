from datetime import date

from pydantic import BaseModel

from .models import Level, StoredTask


class PriorityResult(BaseModel):
    priority_label: Level
    priority_score: int
    rationale: str


IMPORTANCE_POINTS = {
    Level.LOW: 10,
    Level.MEDIUM: 22,
    Level.HIGH: 35,
}

DIFFICULTY_POINTS = {
    Level.LOW: 5,
    Level.MEDIUM: 10,
    Level.HIGH: 15,
}


def calculate_priority(task: StoredTask, today: date | None = None) -> PriorityResult:
    reference_date = today or date.today()
    days_left = (task.due_date - reference_date).days
    urgency_points = _urgency_points(days_left)
    score = min(
        100,
        urgency_points + IMPORTANCE_POINTS[task.importance] + DIFFICULTY_POINTS[task.difficulty],
    )

    if score >= 75:
        label = Level.HIGH
    elif score >= 50:
        label = Level.MEDIUM
    else:
        label = Level.LOW

    return PriorityResult(
        priority_label=label,
        priority_score=score,
        rationale=_build_rationale(task, days_left, label),
    )


def _urgency_points(days_left: int) -> int:
    if days_left < 0:
        return 45
    if days_left == 0:
        return 42
    if days_left <= 2:
        return 35
    if days_left <= 7:
        return 25
    if days_left <= 14:
        return 15

    return 5


def _build_rationale(task: StoredTask, days_left: int, label: Level) -> str:
    deadline = _deadline_text(days_left)
    importance = f"importancia {task.importance.value}"
    difficulty = f"dificuldade {task.difficulty.value}"

    return (
        f"Prioridade {label.value}: {deadline}, {importance} e {difficulty}. "
        "Resultado gerado por regra simulada, sem uso de LLM."
    )


def _deadline_text(days_left: int) -> str:
    if days_left < 0:
        return "prazo vencido"
    if days_left == 0:
        return "vence hoje"
    if days_left == 1:
        return "vence em 1 dia"

    return f"vence em {days_left} dias"
