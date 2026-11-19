import json

collection = {
    "info": {
        "_postman_id": "gharseva-api-test-suite",
        "name": "GharSeva API Test Suite",
        "description": "Comprehensive automated Postman API tests for GharSeva Home Services Platform",
        "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    "variable": [
        {"key": "baseUrl", "value": "http://localhost:5000/api", "type": "string"},
        {"key": "adminToken", "value": "", "type": "string"},
        {"key": "customerToken", "value": "", "type": "string"},
        {"key": "providerToken", "value": "", "type": "string"},
        {"key": "categoryId", "value": "", "type": "string"},
        {"key": "serviceId", "value": "", "type": "string"},
        {"key": "providerId", "value": "", "type": "string"},
        {"key": "addressId", "value": "", "type": "string"},
        {"key": "bookingId", "value": "", "type": "string"},
        {"key": "bookingDate", "value": "2026-12-25", "type": "string"},
        {"key": "bookingTime", "value": "11:00", "type": "string"}
    ],
    "item": [
        {
            "name": "01. Auth - Admin Login",
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test('Status code is 200', function () {",
                            "    pm.response.to.have.status(200);",
                            "});",
                            "var jsonData = pm.response.json();",
                            "pm.test('Login returns success and token', function () {",
                            "    pm.expect(jsonData.success).to.be.true;",
                            "    pm.expect(jsonData.data.token).to.be.a('string');",
                            "    pm.expect(jsonData.data.role).to.eql('ADMIN');",
                            "});",
                            "pm.collectionVariables.set('adminToken', jsonData.data.token);"
                        ],
                        "type": "text/javascript"
                    }
                }
            ],
            "request": {
                "method": "POST",
                "header": [{"key": "Content-Type", "value": "application/json"}],
                "body": {
                    "mode": "raw",
                    "raw": json.dumps({"email": "admin@gharseva.com", "password": "password123"})
                },
                "url": {"raw": "{{baseUrl}}/auth/login", "host": ["{{baseUrl}}"], "path": ["auth", "login"]}
            }
        },
        {
            "name": "02. Auth - Customer Login",
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test('Status code is 200', function () {",
                            "    pm.response.to.have.status(200);",
                            "});",
                            "var jsonData = pm.response.json();",
                            "pm.test('Login returns success and token', function () {",
                            "    pm.expect(jsonData.success).to.be.true;",
                            "    pm.expect(jsonData.data.token).to.be.a('string');",
                            "    pm.expect(jsonData.data.role).to.eql('CUSTOMER');",
                            "});",
                            "pm.collectionVariables.set('customerToken', jsonData.data.token);"
                        ],
                        "type": "text/javascript"
                    }
                }
            ],
            "request": {
                "method": "POST",
                "header": [{"key": "Content-Type", "value": "application/json"}],
                "body": {
                    "mode": "raw",
                    "raw": json.dumps({"email": "rahul@example.com", "password": "password123"})
                },
                "url": {"raw": "{{baseUrl}}/auth/login", "host": ["{{baseUrl}}"], "path": ["auth", "login"]}
            }
        },
        {
            "name": "03. Auth - Provider Login",
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test('Status code is 200', function () {",
                            "    pm.response.to.have.status(200);",
                            "});",
                            "var jsonData = pm.response.json();",
                            "pm.test('Login returns success and token', function () {",
                            "    pm.expect(jsonData.success).to.be.true;",
                            "    pm.expect(jsonData.data.token).to.be.a('string');",
                            "    pm.expect(jsonData.data.role).to.eql('PROVIDER');",
                            "});",
                            "pm.collectionVariables.set('providerToken', jsonData.data.token);"
                        ],
                        "type": "text/javascript"
                    }
                }
            ],
            "request": {
                "method": "POST",
                "header": [{"key": "Content-Type", "value": "application/json"}],
                "body": {
                    "mode": "raw",
                    "raw": json.dumps({"email": "amit@provider.com", "password": "password123"})
                },
                "url": {"raw": "{{baseUrl}}/auth/login", "host": ["{{baseUrl}}"], "path": ["auth", "login"]}
            }
        },
        {
            "name": "04. Auth - Invalid Login Attempt",
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test('Status code is 401 for wrong credentials', function () {",
                            "    pm.response.to.have.status(401);",
                            "});",
                            "var jsonData = pm.response.json();",
                            "pm.test('Error message received', function () {",
                            "    pm.expect(jsonData.success).to.be.false;",
                            "});"
                        ],
                        "type": "text/javascript"
                    }
                }
            ],
            "request": {
                "method": "POST",
                "header": [{"key": "Content-Type", "value": "application/json"}],
                "body": {
                    "mode": "raw",
                    "raw": json.dumps({"email": "wrong@gharseva.com", "password": "wrongpassword"})
                },
                "url": {"raw": "{{baseUrl}}/auth/login", "host": ["{{baseUrl}}"], "path": ["auth", "login"]}
            }
        },
        {
            "name": "05. Auth - Get Me (Customer Profile)",
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test('Status code is 200', function () {",
                            "    pm.response.to.have.status(200);",
                            "});",
                            "var jsonData = pm.response.json();",
                            "pm.test('Profile data returned', function () {",
                            "    pm.expect(jsonData.success).to.be.true;",
                            "    pm.expect(jsonData.data.email).to.eql('rahul@example.com');",
                            "});"
                        ],
                        "type": "text/javascript"
                    }
                }
            ],
            "request": {
                "method": "GET",
                "header": [{"key": "Authorization", "value": "Bearer {{customerToken}}"}],
                "url": {"raw": "{{baseUrl}}/auth/me", "host": ["{{baseUrl}}"], "path": ["auth", "me"]}
            }
        },
        {
            "name": "06. Categories - Get All",
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test('Status code is 200', function () {",
                            "    pm.response.to.have.status(200);",
                            "});",
                            "var jsonData = pm.response.json();",
                            "pm.test('Categories array returned', function () {",
                            "    pm.expect(jsonData.success).to.be.true;",
                            "    pm.expect(jsonData.data).to.be.an('array');",
                            "    pm.expect(jsonData.data.length).to.be.above(0);",
                            "});"
                        ],
                        "type": "text/javascript"
                    }
                }
            ],
            "request": {
                "method": "GET",
                "url": {"raw": "{{baseUrl}}/categories", "host": ["{{baseUrl}}"], "path": ["categories"]}
            }
        },
        {
            "name": "07. Categories - Admin Create Category",
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test('Status code is 201', function () {",
                            "    pm.response.to.have.status(201);",
                            "});",
                            "var jsonData = pm.response.json();",
                            "pm.test('Category created', function () {",
                            "    pm.expect(jsonData.success).to.be.true;",
                            "    pm.expect(jsonData.data._id).to.be.a('string');",
                            "});",
                            "pm.collectionVariables.set('categoryId', jsonData.data._id);"
                        ],
                        "type": "text/javascript"
                    }
                }
            ],
            "request": {
                "method": "POST",
                "header": [
                    {"key": "Content-Type", "value": "application/json"},
                    {"key": "Authorization", "value": "Bearer {{adminToken}}"}
                ],
                "body": {
                    "mode": "raw",
                    "raw": json.dumps({
                        "name": "Automated Testing Category",
                        "description": "Category created during test suite",
                        "icon": "FaWrench"
                    })
                },
                "url": {"raw": "{{baseUrl}}/categories", "host": ["{{baseUrl}}"], "path": ["categories"]}
            }
        },
        {
            "name": "08. Services - Admin Create Service",
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test('Status code is 201', function () {",
                            "    pm.response.to.have.status(201);",
                            "});",
                            "var jsonData = pm.response.json();",
                            "pm.test('Service created', function () {",
                            "    pm.expect(jsonData.success).to.be.true;",
                            "    pm.expect(jsonData.data._id).to.be.a('string');",
                            "});",
                            "pm.collectionVariables.set('serviceId', jsonData.data._id);"
                        ],
                        "type": "text/javascript"
                    }
                }
            ],
            "request": {
                "method": "POST",
                "header": [
                    {"key": "Content-Type", "value": "application/json"},
                    {"key": "Authorization", "value": "Bearer {{adminToken}}"}
                ],
                "body": {
                    "mode": "raw",
                    "raw": json.dumps({
                        "name": "Quick Pipe Repair",
                        "categoryId": "{{categoryId}}",
                        "basePrice": 349,
                        "estimatedDuration": 45,
                        "description": "Quick fix for leaky pipes and faucets"
                    })
                },
                "url": {"raw": "{{baseUrl}}/services", "host": ["{{baseUrl}}"], "path": ["services"]}
            }
        },
        {
            "name": "09. Services - Get All & Search",
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test('Status code is 200', function () {",
                            "    pm.response.to.have.status(200);",
                            "});",
                            "var jsonData = pm.response.json();",
                            "pm.test('Returns matching services', function () {",
                            "    pm.expect(jsonData.success).to.be.true;",
                            "    pm.expect(jsonData.data).to.be.an('array');",
                            "});"
                        ],
                        "type": "text/javascript"
                    }
                }
            ],
            "request": {
                "method": "GET",
                "url": {"raw": "{{baseUrl}}/services?search=Pipe", "host": ["{{baseUrl}}"], "path": ["services"], "query": [{"key": "search", "value": "Pipe"}]}
            }
        },
        {
            "name": "10. Providers - List Verified",
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test('Status code is 200', function () {",
                            "    pm.response.to.have.status(200);",
                            "});",
                            "var jsonData = pm.response.json();",
                            "pm.test('Verified providers returned', function () {",
                            "    pm.expect(jsonData.success).to.be.true;",
                            "    pm.expect(jsonData.data.length).to.be.above(0);",
                            "});",
                            "if (jsonData.data.length > 0) {",
                            "    pm.collectionVariables.set('providerId', jsonData.data[0].userId._id);",
                            "}"
                        ],
                        "type": "text/javascript"
                    }
                }
            ],
            "request": {
                "method": "GET",
                "url": {"raw": "{{baseUrl}}/providers", "host": ["{{baseUrl}}"], "path": ["providers"]}
            }
        },
        {
            "name": "11. Providers - Get By ID",
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test('Status code is 200', function () {",
                            "    pm.response.to.have.status(200);",
                            "});",
                            "var jsonData = pm.response.json();",
                            "pm.test('Provider detail returned', function () {",
                            "    pm.expect(jsonData.success).to.be.true;",
                            "    pm.expect(jsonData.data.userId._id).to.eql(pm.collectionVariables.get('providerId'));",
                            "});"
                        ],
                        "type": "text/javascript"
                    }
                }
            ],
            "request": {
                "method": "GET",
                "url": {"raw": "{{baseUrl}}/providers/{{providerId}}", "host": ["{{baseUrl}}"], "path": ["providers", "{{providerId}}"]}
            }
        },
        {
            "name": "12. Customer - Add Address",
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test('Status code is 201', function () {",
                            "    pm.response.to.have.status(201);",
                            "});",
                            "var jsonData = pm.response.json();",
                            "pm.test('Address created', function () {",
                            "    pm.expect(jsonData.success).to.be.true;",
                            "    pm.expect(jsonData.data._id).to.be.a('string');",
                            "});",
                            "pm.collectionVariables.set('addressId', jsonData.data._id);"
                        ],
                        "type": "text/javascript"
                    }
                }
            ],
            "request": {
                "method": "POST",
                "header": [
                    {"key": "Content-Type", "value": "application/json"},
                    {"key": "Authorization", "value": "Bearer {{customerToken}}"}
                ],
                "body": {
                    "mode": "raw",
                    "raw": json.dumps({
                        "label": "Home",
                        "addressLine": "B-42 Test Park Road",
                        "area": "Connaught Place",
                        "city": "Delhi",
                        "state": "Delhi",
                        "pincode": "110001"
                    })
                },
                "url": {"raw": "{{baseUrl}}/addresses", "host": ["{{baseUrl}}"], "path": ["addresses"]}
            }
        },
        {
            "name": "13. Customer - Get Addresses",
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test('Status code is 200', function () {",
                            "    pm.response.to.have.status(200);",
                            "});",
                            "var jsonData = pm.response.json();",
                            "pm.test('Returns addresses array', function () {",
                            "    pm.expect(jsonData.success).to.be.true;",
                            "    pm.expect(jsonData.data).to.be.an('array');",
                            "    pm.expect(jsonData.data.length).to.be.above(0);",
                            "});"
                        ],
                        "type": "text/javascript"
                    }
                }
            ],
            "request": {
                "method": "GET",
                "header": [{"key": "Authorization", "value": "Bearer {{customerToken}}"}],
                "url": {"raw": "{{baseUrl}}/addresses", "host": ["{{baseUrl}}"], "path": ["addresses"]}
            }
        },
        {
            "name": "14. Customer - Create Booking",
            "event": [
                {
                    "listen": "prerequest",
                    "script": {
                        "exec": [
                            "var uniqueSec = Math.floor(Date.now() / 1000);",
                            "var randomHour = 8 + (uniqueSec % 10);",
                            "var timeStr = (randomHour < 10 ? '0' : '') + randomHour + ':00';",
                            "pm.collectionVariables.set('bookingTime', timeStr);",
                            "var futureDate = new Date();",
                            "futureDate.setDate(futureDate.getDate() + 30 + (uniqueSec % 30));",
                            "pm.collectionVariables.set('bookingDate', futureDate.toISOString().split('T')[0]);"
                        ],
                        "type": "text/javascript"
                    }
                },
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test('Status code is 201', function () {",
                            "    pm.response.to.have.status(201);",
                            "});",
                            "var jsonData = pm.response.json();",
                            "pm.test('Booking created', function () {",
                            "    pm.expect(jsonData.success).to.be.true;",
                            "    pm.expect(jsonData.data._id).to.be.a('string');",
                            "    pm.expect(jsonData.data.bookingNumber).to.include('GS-');",
                            "});",
                            "pm.collectionVariables.set('bookingId', jsonData.data._id);"
                        ],
                        "type": "text/javascript"
                    }
                }
            ],
            "request": {
                "method": "POST",
                "header": [
                    {"key": "Content-Type", "value": "application/json"},
                    {"key": "Authorization", "value": "Bearer {{customerToken}}"}
                ],
                "body": {
                    "mode": "raw",
                    "raw": json.dumps({
                        "providerId": "{{providerId}}",
                        "serviceId": "{{serviceId}}",
                        "addressId": "{{addressId}}",
                        "bookingDate": "{{bookingDate}}",
                        "startTime": "{{bookingTime}}",
                        "problemDescription": "Automated verification booking",
                        "estimatedPrice": 349
                    })
                },
                "url": {"raw": "{{baseUrl}}/bookings", "host": ["{{baseUrl}}"], "path": ["bookings"]}
            }
        },
        {
            "name": "15. Customer - Get Booking By ID",
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test('Status code is 200', function () {",
                            "    pm.response.to.have.status(200);",
                            "});",
                            "var jsonData = pm.response.json();",
                            "pm.test('Returns single booking details', function () {",
                            "    pm.expect(jsonData.success).to.be.true;",
                            "    pm.expect(jsonData.data._id).to.eql(pm.collectionVariables.get('bookingId'));",
                            "});"
                        ],
                        "type": "text/javascript"
                    }
                }
            ],
            "request": {
                "method": "GET",
                "header": [{"key": "Authorization", "value": "Bearer {{customerToken}}"}],
                "url": {"raw": "{{baseUrl}}/bookings/{{bookingId}}", "host": ["{{baseUrl}}"], "path": ["bookings", "{{bookingId}}"]}
            }
        },
        {
            "name": "16. Customer - Get My Bookings",
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test('Status code is 200', function () {",
                            "    pm.response.to.have.status(200);",
                            "});",
                            "var jsonData = pm.response.json();",
                            "pm.test('Customer bookings returned', function () {",
                            "    pm.expect(jsonData.success).to.be.true;",
                            "    pm.expect(jsonData.data.length).to.be.above(0);",
                            "});"
                        ],
                        "type": "text/javascript"
                    }
                }
            ],
            "request": {
                "method": "GET",
                "header": [{"key": "Authorization", "value": "Bearer {{customerToken}}"}],
                "url": {"raw": "{{baseUrl}}/bookings/my", "host": ["{{baseUrl}}"], "path": ["bookings", "my"]}
            }
        },
        {
            "name": "17. Provider - Update Booking Status",
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test('Status code is 200', function () {",
                            "    pm.response.to.have.status(200);",
                            "});",
                            "var jsonData = pm.response.json();",
                            "pm.test('Status updated to ACCEPTED', function () {",
                            "    pm.expect(jsonData.success).to.be.true;",
                            "    pm.expect(jsonData.data.status).to.eql('ACCEPTED');",
                            "});"
                        ],
                        "type": "text/javascript"
                    }
                }
            ],
            "request": {
                "method": "PUT",
                "header": [
                    {"key": "Content-Type", "value": "application/json"},
                    {"key": "Authorization", "value": "Bearer {{providerToken}}"}
                ],
                "body": {
                    "mode": "raw",
                    "raw": json.dumps({"status": "ACCEPTED"})
                },
                "url": {"raw": "{{baseUrl}}/bookings/{{bookingId}}/status", "host": ["{{baseUrl}}"], "path": ["bookings", "{{bookingId}}", "status"]}
            }
        },
        {
            "name": "18. Provider - Availability Schedule",
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test('Status code is 200', function () {",
                            "    pm.response.to.have.status(200);",
                            "});",
                            "var jsonData = pm.response.json();",
                            "pm.test('Availability saved successfully', function () {",
                            "    pm.expect(jsonData.success).to.be.true;",
                            "});"
                        ],
                        "type": "text/javascript"
                    }
                }
            ],
            "request": {
                "method": "POST",
                "header": [
                    {"key": "Content-Type", "value": "application/json"},
                    {"key": "Authorization", "value": "Bearer {{providerToken}}"}
                ],
                "body": {
                    "mode": "raw",
                    "raw": json.dumps({
                        "schedule": [
                            {"day": "Monday", "available": True, "slots": [{"startTime": "09:00", "endTime": "18:00"}]},
                            {"day": "Tuesday", "available": True, "slots": [{"startTime": "09:00", "endTime": "18:00"}]}
                        ]
                    })
                },
                "url": {"raw": "{{baseUrl}}/providers/availability", "host": ["{{baseUrl}}"], "path": ["providers", "availability"]}
            }
        },
        {
            "name": "19. Admin - Get All Bookings",
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test('Status code is 200', function () {",
                            "    pm.response.to.have.status(200);",
                            "});",
                            "var jsonData = pm.response.json();",
                            "pm.test('Returns populated bookings list', function () {",
                            "    pm.expect(jsonData.success).to.be.true;",
                            "    pm.expect(jsonData.data).to.be.an('array');",
                            "});"
                        ],
                        "type": "text/javascript"
                    }
                }
            ],
            "request": {
                "method": "GET",
                "header": [{"key": "Authorization", "value": "Bearer {{adminToken}}"}],
                "url": {"raw": "{{baseUrl}}/bookings", "host": ["{{baseUrl}}"], "path": ["bookings"]}
            }
        },
        {
            "name": "20. Customer - Add Favorite Provider",
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test('Status code is 201 or 400 (if already added)', function () {",
                            "    pm.expect([201, 400]).to.include(pm.response.code);",
                            "});"
                        ],
                        "type": "text/javascript"
                    }
                }
            ],
            "request": {
                "method": "POST",
                "header": [{"key": "Authorization", "value": "Bearer {{customerToken}}"}],
                "url": {"raw": "{{baseUrl}}/favorites/{{providerId}}", "host": ["{{baseUrl}}"], "path": ["favorites", "{{providerId}}"]}
            }
        },
        {
            "name": "21. Customer - Get Favorites",
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test('Status code is 200', function () {",
                            "    pm.response.to.have.status(200);",
                            "});",
                            "var jsonData = pm.response.json();",
                            "pm.test('Favorites array returned', function () {",
                            "    pm.expect(jsonData.success).to.be.true;",
                            "    pm.expect(jsonData.data).to.be.an('array');",
                            "});"
                        ],
                        "type": "text/javascript"
                    }
                }
            ],
            "request": {
                "method": "GET",
                "header": [{"key": "Authorization", "value": "Bearer {{customerToken}}"}],
                "url": {"raw": "{{baseUrl}}/favorites", "host": ["{{baseUrl}}"], "path": ["favorites"]}
            }
        },
        {
            "name": "22. Customer - Remove Favorite Provider",
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test('Status code is 200', function () {",
                            "    pm.response.to.have.status(200);",
                            "});"
                        ],
                        "type": "text/javascript"
                    }
                }
            ],
            "request": {
                "method": "DELETE",
                "header": [{"key": "Authorization", "value": "Bearer {{customerToken}}"}],
                "url": {"raw": "{{baseUrl}}/favorites/{{providerId}}", "host": ["{{baseUrl}}"], "path": ["favorites", "{{providerId}}"]}
            }
        },
        {
            "name": "23. Admin - Dashboard Statistics",
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test('Status code is 200', function () {",
                            "    pm.response.to.have.status(200);",
                            "});",
                            "var jsonData = pm.response.json();",
                            "pm.test('Statistics contain correct metrics', function () {",
                            "    pm.expect(jsonData.success).to.be.true;",
                            "    pm.expect(jsonData.data.totalCustomers).to.be.a('number');",
                            "    pm.expect(jsonData.data.totalProviders).to.be.a('number');",
                            "    pm.expect(jsonData.data.totalBookings).to.be.a('number');",
                            "});"
                        ],
                        "type": "text/javascript"
                    }
                }
            ],
            "request": {
                "method": "GET",
                "header": [{"key": "Authorization", "value": "Bearer {{adminToken}}"}],
                "url": {"raw": "{{baseUrl}}/admin/dashboard", "host": ["{{baseUrl}}"], "path": ["admin", "dashboard"]}
            }
        },
        {
            "name": "24. Admin - Get All Users",
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test('Status code is 200', function () {",
                            "    pm.response.to.have.status(200);",
                            "});",
                            "var jsonData = pm.response.json();",
                            "pm.test('Users list returned', function () {",
                            "    pm.expect(jsonData.success).to.be.true;",
                            "    pm.expect(jsonData.data.length).to.be.above(0);",
                            "});"
                        ],
                        "type": "text/javascript"
                    }
                }
            ],
            "request": {
                "method": "GET",
                "header": [{"key": "Authorization", "value": "Bearer {{adminToken}}"}],
                "url": {"raw": "{{baseUrl}}/admin/users", "host": ["{{baseUrl}}"], "path": ["admin", "users"]}
            }
        },
        {
            "name": "25. RBAC Security - Customer Access to Admin Forbidden",
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test('Customer access to /admin/dashboard returns 403 Forbidden', function () {",
                            "    pm.response.to.have.status(403);",
                            "});",
                            "var jsonData = pm.response.json();",
                            "pm.test('Error message received', function () {",
                            "    pm.expect(jsonData.success).to.be.false;",
                            "});"
                        ],
                        "type": "text/javascript"
                    }
                }
            ],
            "request": {
                "method": "GET",
                "header": [{"key": "Authorization", "value": "Bearer {{customerToken}}"}],
                "url": {"raw": "{{baseUrl}}/admin/dashboard", "host": ["{{baseUrl}}"], "path": ["admin", "dashboard"]}
            }
        },
        {
            "name": "26. Cleanup - Delete Test Booking",
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test('Status code is 200', function () {",
                            "    pm.response.to.have.status(200);",
                            "});"
                        ],
                        "type": "text/javascript"
                    }
                }
            ],
            "request": {
                "method": "DELETE",
                "header": [{"key": "Authorization", "value": "Bearer {{adminToken}}"}],
                "url": {"raw": "{{baseUrl}}/bookings/{{bookingId}}", "host": ["{{baseUrl}}"], "path": ["bookings", "{{bookingId}}"]}
            }
        },
        {
            "name": "27. Cleanup - Admin Delete Test Service",
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test('Status code is 200', function () {",
                            "    pm.response.to.have.status(200);",
                            "});"
                        ],
                        "type": "text/javascript"
                    }
                }
            ],
            "request": {
                "method": "DELETE",
                "header": [{"key": "Authorization", "value": "Bearer {{adminToken}}"}],
                "url": {"raw": "{{baseUrl}}/services/{{serviceId}}", "host": ["{{baseUrl}}"], "path": ["services", "{{serviceId}}"]}
            }
        },
        {
            "name": "28. Cleanup - Admin Delete Test Category",
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test('Status code is 200', function () {",
                            "    pm.response.to.have.status(200);",
                            "});"
                        ],
                        "type": "text/javascript"
                    }
                }
            ],
            "request": {
                "method": "DELETE",
                "header": [{"key": "Authorization", "value": "Bearer {{adminToken}}"}],
                "url": {"raw": "{{baseUrl}}/categories/{{categoryId}}", "host": ["{{baseUrl}}"], "path": ["categories", "{{categoryId}}"]}
            }
        },
        {
            "name": "29. Cleanup - Customer Delete Test Address",
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test('Status code is 200', function () {",
                            "    pm.response.to.have.status(200);",
                            "});"
                        ],
                        "type": "text/javascript"
                    }
                }
            ],
            "request": {
                "method": "DELETE",
                "header": [{"key": "Authorization", "value": "Bearer {{customerToken}}"}],
                "url": {"raw": "{{baseUrl}}/addresses/{{addressId}}", "host": ["{{baseUrl}}"], "path": ["addresses", "{{addressId}}"]}
            }
        }
    ]
}

with open("tests/postman/GharSeva.postman_collection.json", "w", encoding="utf-8") as f:
    json.dump(collection, f, indent=2)

print("Generated tests/postman/GharSeva.postman_collection.json successfully")
