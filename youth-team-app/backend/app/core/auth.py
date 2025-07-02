from fastapi import Request, HTTPException

SECRET_TOKEN = "token11235813!!*"


def check_token(request: Request):
    token = request.headers.get("Authorization")
    if token != f"Bearer {SECRET_TOKEN}":
        raise HTTPException(status_code=401, detail="Unauthorized")
