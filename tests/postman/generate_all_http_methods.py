import json
import uuid
import requests

collection_id = str(uuid.uuid4())

def make_req(name, method, url_path, headers=None, body_obj=None, tests=None, prerequest=None):
    h_list = []
    if headers:
        for k, v in headers.items():
            h_list.append({"key": k, "value": v})
            
    item = {
        "name": f"[{method}] {name}",
        "request": {
            "method": method,
            "header": h_list,
            "url": {
                "raw": f"{{{{baseUrl}}}}/{url_path}",
                "host": ["{{baseUrl}}"],
                "path": url_path.split("?")[0].split("/")
            }
        }
    }

    if "?" in url_path:
        q_str = url_path.split("?")[1]
        q_list = []
        for pair in q_str.split("&"):
            if "=" in pair:
                qk, qv = pair.split("=", 1)
                q_list.append({"key": qk, "value": qv})
        item["request"]["url"]["query"] = q_list

    if body_obj is not None:
        item["request"]["body"] = {
            "mode": "raw",
            "raw": json.dumps(body_obj, indent=2)
        }

    events = []
    if prerequest:
        events.append({"listen": "prerequest", "script": {"exec": prerequest, "type": "text/javascript"}})
    if tests:
        events.append({"listen": "test", "script": {"exec": tests, "type": "text/javascript"}})
    if events:
        item["event"] = events

    return item

items = [
    # ---------------- 1. GET METHOD TESTS ----------------
    {
        "name": "1. GET Method Tests",
        "item": [
            make_req(
                "Fetch Services Catalog",
                "GET",
                "services",
                tests=[
                    "pm.test('Status code is 200', () => pm.response.to.have.status(200));",
                    "var res = pm.response.json();",
                    "pm.test('GET returned services array', () => {",
                    "    pm.expect(res.success).to.be.true;",
                    "    pm.expect(res.data).to.be.an('array');",
                    "    pm.expect(res.data.length).to.be.above(0);",
                    "});",
                    "pm.collectionVariables.set('serviceId', res.data[0]._id);"
                ]
            ),
            make_req(
                "Fetch Service by ID",
                "GET",
                "services/{{serviceId}}",
                tests=[
                    "pm.test('Status code is 200', () => pm.response.to.have.status(200));",
                    "pm.test('GET single item by ID verified', () => {",
                    "    pm.expect(pm.response.json().data._id).to.eql(pm.collectionVariables.get('serviceId'));",
                    "});"
                ]
            ),
            make_req(
                "Fetch Service Categories",
                "GET",
                "categories",
                tests=[
                    "pm.test('Status code is 200', () => pm.response.to.have.status(200));",
                    "pm.test('GET categories returned array', () => pm.expect(pm.response.json().data.length).to.be.above(0));"
                ]
            ),
            make_req(
                "Fetch Verified Providers",
                "GET",
                "providers",
                tests=[
                    "pm.test('Status code is 200', () => pm.response.to.have.status(200));",
                    "var res = pm.response.json();",
                    "pm.test('GET verified providers returned', () => pm.expect(res.data.length).to.be.above(0));",
                    "pm.collectionVariables.set('providerId', res.data[0].userId._id);"
                ]
            )
        ]
    },

    # ---------------- 2. POST METHOD TESTS ----------------
    {
        "name": "2. POST Method Tests",
        "item": [
            make_req(
                "Admin Authentication & Token Generation",
                "POST",
                "auth/login",
                headers={"Content-Type": "application/json"},
                body_obj={"email": "admin@gharseva.com", "password": "password123"},
                tests=[
                    "pm.test('Status code is 200', () => pm.response.to.have.status(200));",
                    "var res = pm.response.json();",
                    "pm.test('POST login generated JWT token', () => {",
                    "    pm.expect(res.data.token).to.be.a('string');",
                    "    pm.expect(res.data.role).to.eql('ADMIN');",
                    "});",
                    "pm.collectionVariables.set('adminToken', res.data.token);"
                ]
            ),
            make_req(
                "Customer Authentication & Token Generation",
                "POST",
                "auth/login",
                headers={"Content-Type": "application/json"},
                body_obj={"email": "rahul@example.com", "password": "password123"},
                tests=[
                    "pm.test('Status code is 200', () => pm.response.to.have.status(200));",
                    "var res = pm.response.json();",
                    "pm.test('POST customer login success', () => pm.expect(res.data.role).to.eql('CUSTOMER'));",
                    "pm.collectionVariables.set('customerToken', res.data.token);"
                ]
            ),
            make_req(
                "Create New Customer Address",
                "POST",
                "addresses",
                headers={"Content-Type": "application/json", "Authorization": "Bearer {{customerToken}}"},
                body_obj={
                    "label": "Home",
                    "addressLine": "Flat 704, Royal Palms",
                    "area": "Gomti Nagar",
                    "city": "Lucknow",
                    "state": "Uttar Pradesh",
                    "pincode": "226010"
                },
                tests=[
                    "pm.test('Status code is 201 Created', () => pm.response.to.have.status(201));",
                    "var res = pm.response.json();",
                    "pm.test('POST created address with ID', () => pm.expect(res.data._id).to.be.a('string'));",
                    "pm.collectionVariables.set('tempAddressId', res.data._id);"
                ]
            ),
            make_req(
                "Create New Service Category",
                "POST",
                "categories",
                headers={"Content-Type": "application/json", "Authorization": "Bearer {{adminToken}}"},
                prerequest=["pm.collectionVariables.set('catTitle', 'Appliance Care ' + Math.floor(Math.random() * 9999));"],
                body_obj={
                    "name": "{{catTitle}}",
                    "description": "Appliance maintenance and diagnostics",
                    "icon": "FaPlug"
                },
                tests=[
                    "pm.test('Status code is 201 Created', () => pm.response.to.have.status(201));",
                    "var res = pm.response.json();",
                    "pm.test('POST created category with ID', () => pm.expect(res.data._id).to.be.a('string'));",
                    "pm.collectionVariables.set('tempCategoryId', res.data._id);"
                ]
            )
        ]
    },

    # ---------------- 3. PUT METHOD TESTS ----------------
    {
        "name": "3. PUT Method Tests",
        "item": [
            make_req(
                "Full Update Address Entity",
                "PUT",
                "addresses/{{tempAddressId}}",
                headers={"Content-Type": "application/json", "Authorization": "Bearer {{customerToken}}"},
                body_obj={
                    "label": "Home",
                    "addressLine": "Flat 704 (Renovated), Royal Palms",
                    "area": "Gomti Nagar Extn",
                    "city": "Lucknow",
                    "state": "Uttar Pradesh",
                    "pincode": "226010"
                },
                tests=[
                    "pm.test('Status code is 200', () => pm.response.to.have.status(200));",
                    "var res = pm.response.json();",
                    "pm.test('PUT updated address details', () => {",
                    "    pm.expect(res.data.addressLine).to.include('(Renovated)');",
                    "    pm.expect(res.data.area).to.eql('Gomti Nagar Extn');",
                    "});"
                ]
            ),
            make_req(
                "Full Update Category Entity",
                "PUT",
                "categories/{{tempCategoryId}}",
                headers={"Content-Type": "application/json", "Authorization": "Bearer {{adminToken}}"},
                body_obj={
                    "name": "Appliance Care & Smart Tech",
                    "description": "Updated category description through PUT"
                },
                tests=[
                    "pm.test('Status code is 200', () => pm.response.to.have.status(200));",
                    "pm.test('PUT category update confirmed', () => pm.expect(pm.response.json().success).to.be.true);"
                ]
            )
        ]
    },

    # ---------------- 4. PATCH METHOD TESTS ----------------
    {
        "name": "4. PATCH Method Tests",
        "item": [
            make_req(
                "Partial Update User Profile Name",
                "PATCH",
                "users/profile",
                headers={"Content-Type": "application/json", "Authorization": "Bearer {{customerToken}}"},
                body_obj={"name": "Rahul Sharma (Verified Client)"},
                tests=[
                    "pm.test('Status code is 200 OK', () => pm.response.to.have.status(200));",
                    "var res = pm.response.json();",
                    "pm.test('PATCH partially updated profile name', () => {",
                    "    pm.expect(res.data.name).to.eql('Rahul Sharma (Verified Client)');",
                    "});"
                ]
            ),
            make_req(
                "Partial Update Address Line Only",
                "PATCH",
                "addresses/{{tempAddressId}}",
                headers={"Content-Type": "application/json", "Authorization": "Bearer {{customerToken}}"},
                body_obj={"addressLine": "Flat 704-B, Royal Palms"},
                tests=[
                    "pm.test('Status code is 200 OK', () => pm.response.to.have.status(200));",
                    "var res = pm.response.json();",
                    "pm.test('PATCH updated single field addressLine', () => {",
                    "    pm.expect(res.data.addressLine).to.eql('Flat 704-B, Royal Palms');",
                    "});"
                ]
            ),
            make_req(
                "Revert User Profile Name (PATCH)",
                "PATCH",
                "users/profile",
                headers={"Content-Type": "application/json", "Authorization": "Bearer {{customerToken}}"},
                body_obj={"name": "Rahul Sharma"},
                tests=[
                    "pm.test('Status code is 200 OK', () => pm.response.to.have.status(200));",
                    "pm.test('Profile name restored', () => pm.expect(pm.response.json().data.name).to.eql('Rahul Sharma'));"
                ]
            )
        ]
    },

    # ---------------- 5. DELETE METHOD TESTS ----------------
    {
        "name": "5. DELETE Method Tests",
        "item": [
            make_req(
                "Delete Test Address Entity",
                "DELETE",
                "addresses/{{tempAddressId}}",
                headers={"Authorization": "Bearer {{customerToken}}"},
                tests=[
                    "pm.test('Status code is 200 OK', () => pm.response.to.have.status(200));",
                    "pm.test('DELETE removed address successfully', () => pm.expect(pm.response.json().success).to.be.true);"
                ]
            ),
            make_req(
                "Delete Test Category Entity",
                "DELETE",
                "categories/{{tempCategoryId}}",
                headers={"Authorization": "Bearer {{adminToken}}"},
                tests=[
                    "pm.test('Status code is 200 OK', () => pm.response.to.have.status(200));",
                    "pm.test('DELETE removed category successfully', () => pm.expect(pm.response.json().success).to.be.true);"
                ]
            )
        ]
    },

    # ---------------- 6. HEAD METHOD TESTS ----------------
    {
        "name": "6. HEAD Method Tests",
        "item": [
            make_req(
                "Check Services Headers & Content-Length (HEAD)",
                "HEAD",
                "services",
                tests=[
                    "pm.test('Status code is 200 OK', () => pm.response.to.have.status(200));",
                    "pm.test('HEAD response body is empty', () => pm.expect(pm.response.text()).to.eql(''));",
                    "pm.test('HEAD contains Content-Type header', () => pm.expect(pm.response.headers.has('Content-Type')).to.be.true);"
                ]
            ),
            make_req(
                "Check Categories Headers (HEAD)",
                "HEAD",
                "categories",
                tests=[
                    "pm.test('Status code is 200 OK', () => pm.response.to.have.status(200));",
                    "pm.test('HEAD contains Content-Length header', () => pm.expect(pm.response.headers.has('Content-Length')).to.be.true);"
                ]
            )
        ]
    },

    # ---------------- 7. OPTIONS METHOD TESTS ----------------
    {
        "name": "7. OPTIONS Method Tests",
        "item": [
            make_req(
                "CORS Pre-Flight & Supported Methods (OPTIONS)",
                "OPTIONS",
                "services",
                tests=[
                    "pm.test('Status code is 204 No Content or 200 OK', () => pm.expect([200, 204]).to.include(pm.response.code));",
                    "pm.test('Access-Control-Allow-Methods header present', () => {",
                    "    pm.expect(pm.response.headers.has('Access-Control-Allow-Methods')).to.be.true;",
                    "    var methods = pm.response.headers.get('Access-Control-Allow-Methods');",
                    "    pm.expect(methods).to.include('GET');",
                    "    pm.expect(methods).to.include('POST');",
                    "    pm.expect(methods).to.include('PUT');",
                    "    pm.expect(methods).to.include('PATCH');",
                    "    pm.expect(methods).to.include('DELETE');",
                    "});"
                ]
            )
        ]
    }
]

final_collection = {
    "info": {
        "_postman_id": collection_id,
        "name": "GharSeva - Complete HTTP Methods Test Suite (GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS)",
        "description": "Comprehensive Postman collection dedicated to testing EVERY HTTP method: GET, POST, PUT, PATCH, DELETE, HEAD, and OPTIONS on GharSeva backend.",
        "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    "variable": [
        {"key": "baseUrl", "value": "http://localhost:5000/api", "type": "string"},
        {"key": "adminToken", "value": "", "type": "string"},
        {"key": "customerToken", "value": "", "type": "string"},
        {"key": "serviceId", "value": "", "type": "string"},
        {"key": "providerId", "value": "", "type": "string"},
        {"key": "tempAddressId", "value": "", "type": "string"},
        {"key": "tempCategoryId", "value": "", "type": "string"},
        {"key": "catTitle", "value": "", "type": "string"}
    ],
    "item": items
}

collection_file = "tests/postman/GharSeva_All_HTTP_Methods_Collection.json"
with open(collection_file, "w", encoding="utf-8") as f:
    json.dump(final_collection, f, indent=2)

print(f"Generated {collection_file} successfully!")

# Upload to Postman Cloud API if environment variable is provided
import os
API_KEY = os.environ.get("POSTMAN_API_KEY")
workspace_id = os.environ.get("POSTMAN_WORKSPACE_ID")
if API_KEY and workspace_id:
    headers = {"X-Api-Key": API_KEY, "Content-Type": "application/json"}
    r_upload = requests.post(
        f"https://api.getpostman.com/collections?workspace={workspace_id}",
        headers=headers,
        json={"collection": final_collection}
    )
    print("Postman Cloud Upload Status:", r_upload.status_code)
