import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.core.database import SessionLocal
from app.models.member import Member
from app.core.settings import settings


@pytest.mark.asyncio
async def test_create_member():
    transport = ASGITransport(app=app)
    headers = {
        "Authorization": f"Bearer {settings.API_TOKEN}"
    }
    async with AsyncClient(transport=transport, base_url="http://test", headers=headers) as ac:

        response = await ac.post("/members/", json={"name": "Test Member", "birthday": "1990-07-15"})
        assert response.status_code == 201
        data = response.json()
        assert data["name"] == "Test Member"
        assert data["birthday"] == "1990-07-15"


@pytest.mark.asyncio
async def test_get_members():
    transport = ASGITransport(app=app)
    headers = {
        "Authorization": f"Bearer {settings.API_TOKEN}"
    }
    async with AsyncClient(transport=transport, base_url="http://test", headers=headers) as ac:
        response = await ac.get("/members/")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert any("Test Member" in m["name"] for m in data)


@pytest.mark.asyncio
async def test_get_individual_member():
    transport = ASGITransport(app=app)
    headers = {
        "Authorization": f"Bearer {settings.API_TOKEN}"
    }

    async with AsyncClient(transport=transport, base_url="http://test", headers=headers) as ac:
        # Step 1: Create a test member
        create_res = await ac.post("/members/", json={"name": "Fetch Me", "birthday": "1988-03-25"})
        assert create_res.status_code == 201
        member_id = create_res.json()["id"]

        # Step 2: Fetch the individual member by ID
        fetch_res = await ac.get(f"/members/{member_id}")
        assert fetch_res.status_code == 200

        data = fetch_res.json()
        assert data["id"] == member_id
        assert data["name"] == "Fetch Me"
        assert data["birthday"] == "1988-03-25"


@pytest.mark.asyncio
async def test_update_member():
    # First, create a member
    transport = ASGITransport(app=app)
    headers = {
        "Authorization": f"Bearer {settings.API_TOKEN}"
    }
    async with AsyncClient(transport=transport, base_url="http://test", headers=headers) as ac:
        create_response = await ac.post("/members/", json={"name": "Update Me", "birthday": "1980-01-01"})
        member_id = create_response.json()["id"]

        # Now update it
        update_payload = {"name": "Updated Name", "birthday": "1981-02-02"}
        update_response = await ac.put(f"/members/{member_id}", json=update_payload)
        assert update_response.status_code == 200
        data = update_response.json()
        assert data["name"] == "Updated Name"
        assert data["birthday"] == "1981-02-02"


@pytest.mark.asyncio
async def test_delete_member():
    # First, create a member
    transport = ASGITransport(app=app)
    headers = {
        "Authorization": f"Bearer {settings.API_TOKEN}"
    }
    async with AsyncClient(transport=transport, base_url="http://test", headers=headers) as ac:
        create_response = await ac.post("/members/", json={"name": "Delete Me", "birthday": "1995-05-05"})
        member_id = create_response.json()["id"]

        # Then delete it
        delete_response = await ac.delete(f"/members/{member_id}")
        assert delete_response.status_code == 204

        # Verify it's gone
        get_response = await ac.get("/members/")
        assert all(m["id"] != member_id for m in get_response.json())
