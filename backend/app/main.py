from pathlib import Path

from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from .models import TaskCreate, TaskResponse
from .store import task_store

app = FastAPI(title="Organizador de Tarefas")

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_headers=["*"],
    allow_methods=["*"],
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
)


@app.get("/api/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/api/tasks", response_model=list[TaskResponse])
def list_tasks() -> list[TaskResponse]:
    return task_store.list_tasks()


@app.post(
    "/api/tasks",
    response_model=TaskResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_task(task: TaskCreate) -> TaskResponse:
    return task_store.create_task(task)


dist_dir = Path(__file__).resolve().parents[2] / "dist"

if dist_dir.exists():
    assets_dir = dist_dir / "assets"
    if assets_dir.exists():
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}", include_in_schema=False)
    def serve_frontend(full_path: str) -> FileResponse:
        requested_file = dist_dir / full_path

        if requested_file.is_file():
            return FileResponse(requested_file)

        return FileResponse(dist_dir / "index.html")
