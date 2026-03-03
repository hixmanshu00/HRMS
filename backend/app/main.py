from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pymongo.errors import ConfigurationError, ServerSelectionTimeoutError

from app.api.routes import attendance, dashboard, employees, system
from app.db.mongo import close_mongo, connect_to_mongo


app = FastAPI(title="HRMS Lite API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(ServerSelectionTimeoutError)
async def mongo_timeout_exception_handler(
    request: Request, exc: ServerSelectionTimeoutError
):
    return JSONResponse(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        content={
            "detail": "Database unavailable. Check MONGO_URL and ensure MongoDB is reachable."
        },
    )


@app.exception_handler(ConfigurationError)
async def mongo_config_exception_handler(request: Request, exc: ConfigurationError):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "Database configuration error. Check MONGO_URL."},
    )


@app.on_event("startup")
async def startup_event() -> None:
    await connect_to_mongo()


@app.on_event("shutdown")
async def shutdown_event() -> None:
    await close_mongo()


app.include_router(system.router)
app.include_router(employees.router)
app.include_router(attendance.router)
app.include_router(dashboard.router)

