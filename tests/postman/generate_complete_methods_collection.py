import json
import uuid

collection_id = "75c12949-f86d-4e0c-b1b6-3497550d8d69"

def req_item(name, method, url_path, headers=None, body_obj=None, tests=None, prerequest=None):
    header_list = []
    if headers:
        for k, v in headers.items():
            header_list.append({"key": k, "value": v})
            
    item = {
        "name": name,
        "request": {
            "method": method,
            "header": header_list,
            "url": {
                "raw": f"{{{{baseUrl}}}}/{url_path}",
                "host": ["{{baseUrl}}"],
                "path": url_path.split("?")[0].split("/")
            }
        }
    }
    
    if "?" in url_path:
        query_str = url_path.split("?")[1]
        query_list = []
        for pair in query_str.split("&"):
            if "=" in pair:
                qk, qv = pair.split("=", 1)
                query_list.append({"key": qk, "value": qv})
        item["request"]["url"]["query"] = query_list

    if body_obj is not None:
        item["request"]["body"] = {
            "mode": "raw",
            "raw": json.dumps(body_obj, indent=2)
        }

    events = []
    if prerequest:
        events.append({
            "listen": "prerequest",
            "script": {
                "exec": prerequest,
                "type": "text/javascript"
            }
        })
    if tests:
        events.append({
            "listen": "test",
            "script": {
                "exec": tests,
                "type": "text/javascript"
            }
        })
    if events:
        item["event"] = events

    return item

folders = [
    # ---------------- 1. Authentication ----------------
    {
        "name": "1. Authentication (GET, POST)",
        "item": [
            req_item(
                "POST - Admin Login",
                "POST",
                "auth/login",
                headers={"Content-Type": "application/json"},
                body_obj={"email": "admin@gharseva.com", "password": "password123"},
                tests=[
                    "pm.test('Status code is 200', () => pm.response.to.have.status(200));",
                    "var res = pm.response.json();",
                    "pm.test('Admin logged in', () => {",
                    "    pm.expect(res.success).to.be.true;",
                    "    pm.expect(res.data.token).to.be.a('string');",
                    "    pm.expect(res.data.role).to.eql('ADMIN');",
                    "});",
                    "pm.collectionVariables.set('adminToken', res.data.token);"
                ]
            ),
            req_item(
                "POST - Customer Login",
                "POST",
                "auth/login",
                headers={"Content-Type": "application/json"},
                body_obj={"email": "rahul@example.com", "password": "password123"},
                tests=[
                    "pm.test('Status code is 200', () => pm.response.to.have.status(200));",
                    "var res = pm.response.json();",
                    "pm.test('Customer logged in', () => {",
                    "    pm.expect(res.success).to.be.true;",
                    "    pm.expect(res.data.role).to.eql('CUSTOMER');",
                    "});",
                    "pm.collectionVariables.set('customerToken', res.data.token);"
                ]
            ),
            req_item(
                "POST - Provider Login",
                "POST",
                "auth/login",
                headers={"Content-Type": "application/json"},
                body_obj={"email": "amit@provider.com", "password": "password123"},
                tests=[
                    "pm.test('Status code is 200', () => pm.response.to.have.status(200));",
                    "var res = pm.response.json();",
                    "pm.test('Provider logged in', () => {",
                    "    pm.expect(res.success).to.be.true;",
                    "    pm.expect(res.data.role).to.eql('PROVIDER');",
                    "});",
                    "pm.collectionVariables.set('providerToken', res.data.token);"
                ]
            ),
            req_item(
                "POST - Register New Dynamic User",
                "POST",
                "auth/register",
                headers={"Content-Type": "application/json"},
                prerequest=[
                    "var ts = Date.now();",
                    "pm.collectionVariables.set('dynamicEmail', 'user_' + ts + '@postmantest.com');"
                ],
                body_obj={
                    "name": "Postman Auto User",
                    "email": "{{dynamicEmail}}",
                    "phone": "9876500000",
                    "password": "password123",
                    "role": "CUSTOMER"
                },
                tests=[
                    "pm.test('Status code is 201', () => pm.response.to.have.status(201));",
                    "var res = pm.response.json();",
                    "pm.test('User registered successfully', () => {",
                    "    pm.expect(res.success).to.be.true;",
                    "    pm.expect(res.data._id).to.be.a('string');",
                    "});",
                    "pm.collectionVariables.set('testUserId', res.data._id);"
                ]
            ),
            req_item(
                "GET - Current Authenticated User (Me)",
                "GET",
                "auth/me",
                headers={"Authorization": "Bearer {{customerToken}}"},
                tests=[
                    "pm.test('Status code is 200', () => pm.response.to.have.status(200));",
                    "var res = pm.response.json();",
                    "pm.test('Profile returned', () => pm.expect(res.data.email).to.eql('rahul@example.com'));"
                ]
            )
        ]
    },

    # ---------------- 2. Categories ----------------
    {
        "name": "2. Service Categories (GET, POST, PUT, DELETE)",
        "item": [
            req_item(
                "GET - All Categories",
                "GET",
                "categories",
                tests=[
                    "pm.test('Status code is 200', () => pm.response.to.have.status(200));",
                    "var res = pm.response.json();",
                    "pm.test('Categories list not empty', () => pm.expect(res.data.length).to.be.above(0));"
                ]
            ),
            req_item(
                "POST - Admin Create Category",
                "POST",
                "categories",
                headers={"Content-Type": "application/json", "Authorization": "Bearer {{adminToken}}"},
                prerequest=[
                    "pm.collectionVariables.set('catName', 'Category ' + Math.floor(Math.random() * 99999));"
                ],
                body_obj={"name": "{{catName}}", "description": "Category for automated testing", "icon": "FaTools"},
                tests=[
                    "pm.test('Status code is 201', () => pm.response.to.have.status(201));",
                    "var res = pm.response.json();",
                    "pm.collectionVariables.set('categoryId', res.data._id);"
                ]
            ),
            req_item(
                "PUT - Admin Update Category",
                "PUT",
                "categories/{{categoryId}}",
                headers={"Content-Type": "application/json", "Authorization": "Bearer {{adminToken}}"},
                body_obj={"description": "Updated category description"},
                tests=[
                    "pm.test('Status code is 200', () => pm.response.to.have.status(200));",
                    "pm.test('Category updated', () => pm.expect(pm.response.json().success).to.be.true);"
                ]
            ),
            req_item(
                "DELETE - Admin Delete Category",
                "DELETE",
                "categories/{{categoryId}}",
                headers={"Authorization": "Bearer {{adminToken}}"},
                tests=[
                    "pm.test('Status code is 200', () => pm.response.to.have.status(200));",
                    "pm.test('Category removed', () => pm.expect(pm.response.json().success).to.be.true);"
                ]
            )
        ]
    },

    # ---------------- 3. Services Management ----------------
    {
        "name": "3. Services Management (GET, POST, PUT, DELETE)",
        "item": [
            req_item(
                "GET - All Services",
                "GET",
                "services",
                tests=[
                    "pm.test('Status code is 200', () => pm.response.to.have.status(200));",
                    "var res = pm.response.json();",
                    "pm.test('Returns services array', () => pm.expect(res.data.length).to.be.above(0));",
                    "pm.collectionVariables.set('activeServiceId', res.data[0]._id);"
                ]
            ),
            req_item(
                "GET - Search Services (Query Param)",
                "GET",
                "services?search=Cleaning",
                tests=[
                    "pm.test('Status code is 200', () => pm.response.to.have.status(200));",
                    "pm.test('Search returns filtered services', () => pm.expect(pm.response.json().success).to.be.true);"
                ]
            ),
            req_item(
                "POST - Admin Create Service",
                "POST",
                "services",
                headers={"Content-Type": "application/json", "Authorization": "Bearer {{adminToken}}"},
                prerequest=[
                    "pm.collectionVariables.set('servName', 'Auto Test Service ' + Date.now());"
                ],
                body_obj={
                    "name": "{{servName}}",
                    "categoryId": "6abbcef3a2a84586a6bc5ffe",
                    "basePrice": 399,
                    "estimatedDuration": 45,
                    "description": "Created for testing all methods"
                },
                tests=[
                    "pm.test('Status code is 201', () => pm.response.to.have.status(201));",
                    "var res = pm.response.json();",
                    "pm.collectionVariables.set('tempServiceId', res.data._id);"
                ]
            ),
            req_item(
                "GET - Service By ID",
                "GET",
                "services/{{tempServiceId}}",
                tests=[
                    "pm.test('Status code is 200', () => pm.response.to.have.status(200));",
                    "pm.test('Matches service ID', () => pm.expect(pm.response.json().data._id).to.eql(pm.collectionVariables.get('tempServiceId')));"
                ]
            ),
            req_item(
                "PUT - Admin Update Service",
                "PUT",
                "services/{{tempServiceId}}",
                headers={"Content-Type": "application/json", "Authorization": "Bearer {{adminToken}}"},
                body_obj={"basePrice": 499},
                tests=[
                    "pm.test('Status code is 200', () => pm.response.to.have.status(200));",
                    "pm.test('Base price updated', () => pm.expect(pm.response.json().data.basePrice).to.eql(499));"
                ]
            ),
            req_item(
                "DELETE - Admin Delete Service",
                "DELETE",
                "services/{{tempServiceId}}",
                headers={"Authorization": "Bearer {{adminToken}}"},
                tests=[
                    "pm.test('Status code is 200', () => pm.response.to.have.status(200));",
                    "pm.test('Service deleted', () => pm.expect(pm.response.json().success).to.be.true);"
                ]
            )
        ]
    },

    # ---------------- 4. Providers & Availability ----------------
    {
        "name": "4. Providers & Availability (GET, POST, PUT)",
        "item": [
            req_item(
                "GET - List Verified Providers",
                "GET",
                "providers",
                tests=[
                    "pm.test('Status code is 200', () => pm.response.to.have.status(200));",
                    "var res = pm.response.json();",
                    "pm.test('Providers found', () => pm.expect(res.data.length).to.be.above(0));",
                    "pm.collectionVariables.set('targetProviderId', res.data[0].userId._id);"
                ]
            ),
            req_item(
                "GET - Provider Details By ID",
                "GET",
                "providers/{{targetProviderId}}",
                tests=[
                    "pm.test('Status code is 200', () => pm.response.to.have.status(200));",
                    "pm.test('Provider data retrieved', () => pm.expect(pm.response.json().data.userId._id).to.eql(pm.collectionVariables.get('targetProviderId')));"
                ]
            ),
            req_item(
                "POST - Provider Set Weekly Availability Schedule",
                "POST",
                "providers/availability",
                headers={"Content-Type": "application/json", "Authorization": "Bearer {{providerToken}}"},
                body_obj={
                    "schedule": [
                        {"day": "Monday", "available": True, "slots": [{"startTime": "09:00", "endTime": "18:00"}]},
                        {"day": "Wednesday", "available": True, "slots": [{"startTime": "10:00", "endTime": "17:00"}]},
                        {"day": "Saturday", "available": False, "slots": [{"startTime": "09:00", "endTime": "13:00"}]}
                    ]
                },
                tests=[
                    "pm.test('Status code is 200', () => pm.response.to.have.status(200));",
                    "pm.test('Availability saved', () => pm.expect(pm.response.json().success).to.be.true);"
                ]
            ),
            req_item(
                "GET - Provider Availability Schedule",
                "GET",
                "providers/{{targetProviderId}}/availability",
                tests=[
                    "pm.test('Status code is 200', () => pm.response.to.have.status(200));",
                    "pm.test('Schedule array returned', () => pm.expect(pm.response.json().data.schedule).to.be.an('array'));"
                ]
            ),
            req_item(
                "PUT - Provider Update Profile Details",
                "PUT",
                "providers/profile",
                headers={"Content-Type": "application/json", "Authorization": "Bearer {{providerToken}}"},
                body_obj={
                    "bio": "Experienced multi-skilled provider with top client ratings.",
                    "hourlyRate": 320,
                    "serviceRadius": 20
                },
                tests=[
                    "pm.test('Status code is 200', () => pm.response.to.have.status(200));",
                    "pm.test('Profile updated', () => pm.expect(pm.response.json().success).to.be.true);"
                ]
            )
        ]
    },

    # ---------------- 5. Customer Addresses ----------------
    {
        "name": "5. Customer Addresses (GET, POST, PUT, DELETE)",
        "item": [
            req_item(
                "POST - Customer Add Address",
                "POST",
                "addresses",
                headers={"Content-Type": "application/json", "Authorization": "Bearer {{customerToken}}"},
                body_obj={
                    "label": "Home",
                    "addressLine": "House #44, Tower 7",
                    "area": "Indirapuram",
                    "city": "Ghaziabad",
                    "state": "Uttar Pradesh",
                    "pincode": "201014"
                },
                tests=[
                    "pm.test('Status code is 201', () => pm.response.to.have.status(201));",
                    "var res = pm.response.json();",
                    "pm.collectionVariables.set('tempAddressId', res.data._id);"
                ]
            ),
            req_item(
                "GET - Customer Get All Addresses",
                "GET",
                "addresses",
                headers={"Authorization": "Bearer {{customerToken}}"},
                tests=[
                    "pm.test('Status code is 200', () => pm.response.to.have.status(200));",
                    "pm.test('Addresses array returned', () => pm.expect(pm.response.json().data.length).to.be.above(0));"
                ]
            ),
            req_item(
                "PUT - Customer Update Address",
                "PUT",
                "addresses/{{tempAddressId}}",
                headers={"Content-Type": "application/json", "Authorization": "Bearer {{customerToken}}"},
                body_obj={"addressLine": "House #44 (Updated), Tower 7"},
                tests=[
                    "pm.test('Status code is 200', () => pm.response.to.have.status(200));",
                    "pm.test('Address updated', () => pm.expect(pm.response.json().data.addressLine).to.include('(Updated)'));"
                ]
            ),
            req_item(
                "DELETE - Customer Delete Address",
                "DELETE",
                "addresses/{{tempAddressId}}",
                headers={"Authorization": "Bearer {{customerToken}}"},
                tests=[
                    "pm.test('Status code is 200', () => pm.response.to.have.status(200));",
                    "pm.test('Address deleted', () => pm.expect(pm.response.json().success).to.be.true);"
                ]
            )
        ]
    },

    # ---------------- 6. Bookings Lifecycle ----------------
    {
        "name": "6. Bookings Lifecycle (GET, POST, PUT, DELETE)",
        "item": [
            req_item(
                "POST - Customer Create Booking",
                "POST",
                "bookings",
                headers={"Content-Type": "application/json", "Authorization": "Bearer {{customerToken}}"},
                prerequest=[
                    "var unique = Date.now();",
                    "var hour = 9 + (unique % 8);",
                    "pm.collectionVariables.set('dynBookingTime', (hour < 10 ? '0' : '') + hour + ':30');",
                    "var d = new Date();",
                    "d.setDate(d.getDate() + 45 + (unique % 50));",
                    "pm.collectionVariables.set('dynBookingDate', d.toISOString().split('T')[0]);"
                ],
                body_obj={
                    "providerId": "{{targetProviderId}}",
                    "serviceId": "{{activeServiceId}}",
                    "address": {
                        "addressLine": "78 Sector Road",
                        "area": "Noida City",
                        "city": "Noida",
                        "state": "Uttar Pradesh",
                        "pincode": "201301"
                    },
                    "bookingDate": "{{dynBookingDate}}",
                    "startTime": "{{dynBookingTime}}",
                    "problemDescription": "Thorough inspection and maintenance",
                    "estimatedPrice": 599
                },
                tests=[
                    "pm.test('Status code is 201', () => pm.response.to.have.status(201));",
                    "var res = pm.response.json();",
                    "pm.collectionVariables.set('tempBookingId', res.data._id);"
                ]
            ),
            req_item(
                "GET - Customer Get Booking By ID",
                "GET",
                "bookings/{{tempBookingId}}",
                headers={"Authorization": "Bearer {{customerToken}}"},
                tests=[
                    "pm.test('Status code is 200', () => pm.response.to.have.status(200));",
                    "pm.test('Booking retrieved', () => pm.expect(pm.response.json().data.status).to.eql('PENDING'));"
                ]
            ),
            req_item(
                "GET - Customer Get My Bookings",
                "GET",
                "bookings/my",
                headers={"Authorization": "Bearer {{customerToken}}"},
                tests=[
                    "pm.test('Status code is 200', () => pm.response.to.have.status(200));",
                    "pm.test('My bookings array returned', () => pm.expect(pm.response.json().data.length).to.be.above(0));"
                ]
            ),
            req_item(
                "GET - Provider Get Assigned Bookings",
                "GET",
                "bookings/provider",
                headers={"Authorization": "Bearer {{providerToken}}"},
                tests=[
                    "pm.test('Status code is 200', () => pm.response.to.have.status(200));",
                    "pm.test('Provider bookings array returned', () => pm.expect(pm.response.json().data).to.be.an('array'));"
                ]
            ),
            req_item(
                "GET - Admin Get All Bookings",
                "GET",
                "bookings",
                headers={"Authorization": "Bearer {{adminToken}}"},
                tests=[
                    "pm.test('Status code is 200', () => pm.response.to.have.status(200));",
                    "pm.test('Admin sees populated list', () => pm.expect(pm.response.json().data.length).to.be.above(0));"
                ]
            ),
            req_item(
                "PUT - Provider Update Booking Status to ACCEPTED",
                "PUT",
                "bookings/{{tempBookingId}}/status",
                headers={"Content-Type": "application/json", "Authorization": "Bearer {{providerToken}}"},
                body_obj={"status": "ACCEPTED"},
                tests=[
                    "pm.test('Status code is 200', () => pm.response.to.have.status(200));",
                    "pm.test('Status is now ACCEPTED', () => pm.expect(pm.response.json().data.status).to.eql('ACCEPTED'));"
                ]
            ),
            req_item(
                "PUT - Provider Update Booking Status to COMPLETED",
                "PUT",
                "bookings/{{tempBookingId}}/status",
                headers={"Content-Type": "application/json", "Authorization": "Bearer {{providerToken}}"},
                body_obj={"status": "COMPLETED"},
                tests=[
                    "pm.test('Status code is 200', () => pm.response.to.have.status(200));",
                    "pm.test('Status is now COMPLETED', () => pm.expect(pm.response.json().data.status).to.eql('COMPLETED'));"
                ]
            ),
            req_item(
                "DELETE - Delete Booking Record",
                "DELETE",
                "bookings/{{tempBookingId}}",
                headers={"Authorization": "Bearer {{adminToken}}"},
                tests=[
                    "pm.test('Status code is 200', () => pm.response.to.have.status(200));",
                    "pm.test('Booking deleted', () => pm.expect(pm.response.json().success).to.be.true);"
                ]
            )
        ]
    },

    # ---------------- 7. Reviews ----------------
    {
        "name": "7. Reviews & Feedback (GET, POST)",
        "item": [
            req_item(
                "GET - Public Get Provider Reviews",
                "GET",
                "reviews/provider/{{targetProviderId}}",
                tests=[
                    "pm.test('Status code is 200', () => pm.response.to.have.status(200));",
                    "pm.test('Reviews array returned', () => pm.expect(pm.response.json().data).to.be.an('array'));"
                ]
            )
        ]
    },

    # ---------------- 8. Payments ----------------
    {
        "name": "8. Payments & Billing (GET, POST)",
        "item": [
            req_item(
                "POST - Customer Submit Payment",
                "POST",
                "payments",
                headers={"Content-Type": "application/json", "Authorization": "Bearer {{customerToken}}"},
                prerequest=[
                    "pm.collectionVariables.set('txnId', 'TXN_' + Date.now());"
                ],
                body_obj={
                    "bookingId": "6abbcef3a2a84586a6bc6009",
                    "amount": 599,
                    "method": "UPI",
                    "transactionId": "{{txnId}}"
                },
                tests=[
                    "pm.test('Status code is 201', () => pm.response.to.have.status(201));",
                    "var res = pm.response.json();",
                    "pm.collectionVariables.set('tempPaymentId', res.data._id);"
                ]
            ),
            req_item(
                "GET - Customer Get Payment Receipt By ID",
                "GET",
                "payments/{{tempPaymentId}}",
                headers={"Authorization": "Bearer {{customerToken}}"},
                tests=[
                    "pm.test('Status code is 200', () => pm.response.to.have.status(200));",
                    "pm.test('Receipt verified', () => pm.expect(pm.response.json().data.status).to.eql('SUCCESS'));"
                ]
            )
        ]
    },

    # ---------------- 9. Complaints ----------------
    {
        "name": "9. Complaints & Grievances (GET, POST, PUT)",
        "item": [
            req_item(
                "POST - Customer File Complaint",
                "POST",
                "complaints",
                headers={"Content-Type": "application/json", "Authorization": "Bearer {{customerToken}}"},
                body_obj={
                    "subject": "Delay in response",
                    "description": "Technician arrived 15 mins late."
                },
                tests=[
                    "pm.test('Status code is 201', () => pm.response.to.have.status(201));",
                    "var res = pm.response.json();",
                    "pm.collectionVariables.set('tempComplaintId', res.data._id);"
                ]
            ),
            req_item(
                "GET - Customer List My Complaints",
                "GET",
                "complaints/my",
                headers={"Authorization": "Bearer {{customerToken}}"},
                tests=[
                    "pm.test('Status code is 200', () => pm.response.to.have.status(200));",
                    "pm.test('Complaints array returned', () => pm.expect(pm.response.json().data.length).to.be.above(0));"
                ]
            ),
            req_item(
                "GET - Admin List All Complaints",
                "GET",
                "admin/complaints",
                headers={"Authorization": "Bearer {{adminToken}}"},
                tests=[
                    "pm.test('Status code is 200', () => pm.response.to.have.status(200));",
                    "pm.test('Admin complaints list returned', () => pm.expect(pm.response.json().data).to.be.an('array'));"
                ]
            ),
            req_item(
                "PUT - Admin Resolve Complaint",
                "PUT",
                "admin/complaints/{{tempComplaintId}}",
                headers={"Content-Type": "application/json", "Authorization": "Bearer {{adminToken}}"},
                body_obj={"status": "RESOLVED", "resolutionNotes": "Apologized to customer and offered discount voucher."},
                tests=[
                    "pm.test('Status code is 200', () => pm.response.to.have.status(200));",
                    "pm.test('Complaint marked resolved', () => pm.expect(pm.response.json().success).to.be.true);"
                ]
            )
        ]
    },

    # ---------------- 10. Notifications ----------------
    {
        "name": "10. Notifications (GET, PUT)",
        "item": [
            req_item(
                "GET - User Notifications List",
                "GET",
                "notifications",
                headers={"Authorization": "Bearer {{customerToken}}"},
                tests=[
                    "pm.test('Status code is 200', () => pm.response.to.have.status(200));",
                    "pm.test('Notifications array returned', () => pm.expect(pm.response.json().data).to.be.an('array'));"
                ]
            ),
            req_item(
                "PUT - Mark All Notifications Read",
                "PUT",
                "notifications/read-all",
                headers={"Authorization": "Bearer {{customerToken}}"},
                tests=[
                    "pm.test('Status code is 200', () => pm.response.to.have.status(200));",
                    "pm.test('All marked read', () => pm.expect(pm.response.json().success).to.be.true);"
                ]
            )
        ]
    },

    # ---------------- 11. Favorites ----------------
    {
        "name": "11. Favorites (GET, POST, DELETE)",
        "item": [
            req_item(
                "POST - Customer Add Favorite Provider",
                "POST",
                "favorites/{{targetProviderId}}",
                headers={"Authorization": "Bearer {{customerToken}}"},
                tests=[
                    "pm.test('Status code is 201 or 400 (already fav)', () => pm.expect([201, 400]).to.include(pm.response.code));"
                ]
            ),
            req_item(
                "GET - Customer Get Favorite Providers",
                "GET",
                "favorites",
                headers={"Authorization": "Bearer {{customerToken}}"},
                tests=[
                    "pm.test('Status code is 200', () => pm.response.to.have.status(200));",
                    "pm.test('Favorites array returned', () => pm.expect(pm.response.json().data).to.be.an('array'));"
                ]
            ),
            req_item(
                "DELETE - Customer Remove Favorite Provider",
                "DELETE",
                "favorites/{{targetProviderId}}",
                headers={"Authorization": "Bearer {{customerToken}}"},
                tests=[
                    "pm.test('Status code is 200', () => pm.response.to.have.status(200));",
                    "pm.test('Removed from favorites', () => pm.expect(pm.response.json().success).to.be.true);"
                ]
            )
        ]
    },

    # ---------------- 12. User Profile ----------------
    {
        "name": "12. User Profile (GET, PUT)",
        "item": [
            req_item(
                "GET - Get Profile Info",
                "GET",
                "users/profile",
                headers={"Authorization": "Bearer {{customerToken}}"},
                tests=[
                    "pm.test('Status code is 200', () => pm.response.to.have.status(200));",
                    "pm.test('User profile returned', () => pm.expect(pm.response.json().data.email).to.eql('rahul@example.com'));"
                ]
            ),
            req_item(
                "PUT - Update Profile Details",
                "PUT",
                "users/profile",
                headers={"Content-Type": "application/json", "Authorization": "Bearer {{customerToken}}"},
                body_obj={"name": "Rahul Sharma", "phone": "9876543210"},
                tests=[
                    "pm.test('Status code is 200', () => pm.response.to.have.status(200));",
                    "pm.test('Profile updated successfully', () => pm.expect(pm.response.json().data.name).to.eql('Rahul Sharma'));"
                ]
            )
        ]
    },

    # ---------------- 13. Admin Management ----------------
    {
        "name": "13. Admin Management & Dashboard (GET, PUT)",
        "item": [
            req_item(
                "GET - Admin Dashboard Metrics",
                "GET",
                "admin/dashboard",
                headers={"Authorization": "Bearer {{adminToken}}"},
                tests=[
                    "pm.test('Status code is 200', () => pm.response.to.have.status(200));",
                    "var res = pm.response.json();",
                    "pm.test('Metrics contain customers, providers, bookings', () => {",
                    "    pm.expect(res.data.totalCustomers).to.be.a('number');",
                    "    pm.expect(res.data.totalProviders).to.be.a('number');",
                    "    pm.expect(res.data.totalBookings).to.be.a('number');",
                    "});"
                ]
            ),
            req_item(
                "GET - Admin Filter Users by Role",
                "GET",
                "admin/users?role=CUSTOMER",
                headers={"Authorization": "Bearer {{adminToken}}"},
                tests=[
                    "pm.test('Status code is 200', () => pm.response.to.have.status(200));",
                    "pm.test('Customers list returned', () => pm.expect(pm.response.json().data.length).to.be.above(0));"
                ]
            ),
            req_item(
                "PUT - Admin Update User Status",
                "PUT",
                "admin/users/{{testUserId}}/status",
                headers={"Content-Type": "application/json", "Authorization": "Bearer {{adminToken}}"},
                body_obj={"status": "ACTIVE"},
                tests=[
                    "pm.test('Status code is 200', () => pm.response.to.have.status(200));",
                    "pm.test('Status updated', () => pm.expect(pm.response.json().success).to.be.true);"
                ]
            ),
            req_item(
                "PUT - Admin Verify Provider Profile",
                "PUT",
                "admin/providers/{{targetProviderId}}/verify",
                headers={"Content-Type": "application/json", "Authorization": "Bearer {{adminToken}}"},
                body_obj={"status": "VERIFIED"},
                tests=[
                    "pm.test('Status code is 200', () => pm.response.to.have.status(200));",
                    "pm.test('Provider verified', () => pm.expect(pm.response.json().success).to.be.true);"
                ]
            )
        ]
    },

    # ---------------- 14. RBAC & Error Boundaries ----------------
    {
        "name": "14. RBAC & Security Boundaries (401, 403, 404)",
        "item": [
            req_item(
                "GET - Unauthorized Request (Missing Token -> 401)",
                "GET",
                "auth/me",
                tests=[
                    "pm.test('Status code is 401 Unauthorized', () => pm.response.to.have.status(401));"
                ]
            ),
            req_item(
                "GET - Customer Forbidden from Admin (RBAC -> 403)",
                "GET",
                "admin/dashboard",
                headers={"Authorization": "Bearer {{customerToken}}"},
                tests=[
                    "pm.test('Status code is 403 Forbidden', () => pm.response.to.have.status(403));"
                ]
            ),
            req_item(
                "GET - Customer Forbidden from Provider Bookings (RBAC -> 403)",
                "GET",
                "bookings/provider",
                headers={"Authorization": "Bearer {{customerToken}}"},
                tests=[
                    "pm.test('Status code is 403 Forbidden', () => pm.response.to.have.status(403));"
                ]
            ),
            req_item(
                "GET - Non-Existent Resource (404 Not Found)",
                "GET",
                "services/000000000000000000000000",
                tests=[
                    "pm.test('Status code is 404 Not Found', () => pm.response.to.have.status(404));"
                ]
            )
        ]
    }
]

collection_data = {
    "info": {
        "_postman_id": collection_id,
        "name": "GharSeva - Complete All-Methods API Test Suite",
        "description": "Full-coverage Postman collection testing ALL HTTP methods (GET, POST, PUT, DELETE) across every module of GharSeva.",
        "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    "variable": [
        {"key": "baseUrl", "value": "http://localhost:5000/api", "type": "string"},
        {"key": "adminToken", "value": "", "type": "string"},
        {"key": "customerToken", "value": "", "type": "string"},
        {"key": "providerToken", "value": "", "type": "string"},
        {"key": "categoryId", "value": "", "type": "string"},
        {"key": "activeServiceId", "value": "", "type": "string"},
        {"key": "tempServiceId", "value": "", "type": "string"},
        {"key": "targetProviderId", "value": "", "type": "string"},
        {"key": "tempAddressId", "value": "", "type": "string"},
        {"key": "tempBookingId", "value": "", "type": "string"},
        {"key": "tempPaymentId", "value": "", "type": "string"},
        {"key": "tempComplaintId", "value": "", "type": "string"},
        {"key": "testUserId", "value": "", "type": "string"},
        {"key": "dynBookingDate", "value": "2027-01-15", "type": "string"},
        {"key": "dynBookingTime", "value": "11:30", "type": "string"}
    ],
    "item": folders
}

output_path = "tests/postman/GharSeva_All_Methods_Collection.json"
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(collection_data, f, indent=2)

print(f"Generated {output_path} successfully!")
