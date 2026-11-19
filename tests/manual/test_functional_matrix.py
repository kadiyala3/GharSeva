import unittest
import time
import requests

BASE_URL = "http://localhost:5000/api"

class GharSevaFunctionalMatrixTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # 1. Login Admin
        r = requests.post(f"{BASE_URL}/auth/login", json={"email": "admin@gharseva.com", "password": "password123"})
        assert r.status_code == 200, "Admin login failed"
        cls.admin_token = r.json()["data"]["token"]
        cls.admin_headers = {"Authorization": f"Bearer {cls.admin_token}"}

        # 2. Login Provider
        r = requests.post(f"{BASE_URL}/auth/login", json={"email": "amit@provider.com", "password": "password123"})
        assert r.status_code == 200, "Provider login failed"
        cls.provider_token = r.json()["data"]["token"]
        cls.provider_headers = {"Authorization": f"Bearer {cls.provider_token}"}
        cls.provider_id = r.json()["data"]["_id"]

        # 3. Create a unique customer for testing
        cls.timestamp = int(time.time() * 1000)
        cls.cust_email = f"test_cust_{cls.timestamp}@gharseva.test"
        r = requests.post(f"{BASE_URL}/auth/register", json={
            "name": f"Matrix Customer {cls.timestamp}",
            "email": cls.cust_email,
            "phone": "9812345678",
            "password": "password123",
            "role": "CUSTOMER"
        })
        assert r.status_code == 201, f"Customer registration failed: {r.text}"
        cls.customer_token = r.json()["data"]["token"]
        cls.customer_headers = {"Authorization": f"Bearer {cls.customer_token}"}
        cls.customer_id = r.json()["data"]["_id"]

    # ----------------------------------------------------
    # SECTION 1: CUSTOMER END-TO-END JOURNEY
    # ----------------------------------------------------
    def test_01_customer_profile(self):
        """Customer should be able to view their profile"""
        r = requests.get(f"{BASE_URL}/auth/me", headers=self.customer_headers)
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.json()["data"]["email"], self.cust_email)
        print("✓ Functional 01: Customer profile retrieved")

    def test_02_customer_address_lifecycle(self):
        """Customer should be able to Add, Update, and Delete address"""
        # Add Address
        add_res = requests.post(f"{BASE_URL}/addresses", headers=self.customer_headers, json={
            "label": "Home",
            "addressLine": "Flat 302, Green Valley Apartments",
            "area": "Dwarka Sector 12",
            "city": "New Delhi",
            "state": "Delhi",
            "pincode": "110078"
        })
        self.assertEqual(add_res.status_code, 201)
        addr_id = add_res.json()["data"]["_id"]

        # Get Addresses
        get_res = requests.get(f"{BASE_URL}/addresses", headers=self.customer_headers)
        self.assertEqual(get_res.status_code, 200)
        self.assertTrue(any(a["_id"] == addr_id for a in get_res.json()["data"]))

        # Update Address
        up_res = requests.put(f"{BASE_URL}/addresses/{addr_id}", headers=self.customer_headers, json={
            "addressLine": "Flat 302, Updated Valley Apartments"
        })
        self.assertEqual(up_res.status_code, 200)

        # Delete Address
        del_res = requests.delete(f"{BASE_URL}/addresses/{addr_id}", headers=self.customer_headers)
        self.assertEqual(del_res.status_code, 200)
        print("✓ Functional 02: Customer address lifecycle (Create, Read, Update, Delete) passed")

    def test_03_customer_booking_and_status_tracking(self):
        """Customer books service, provider accepts it, customer checks status, provider completes it"""
        # 1. Fetch available service
        srv_res = requests.get(f"{BASE_URL}/services")
        self.assertEqual(srv_res.status_code, 200)
        services = srv_res.json()["data"]
        self.assertGreater(len(services), 0)
        service = services[0]

        # 2. Customer creates booking
        booking_payload = {
            "providerId": self.provider_id,
            "serviceId": service["_id"],
            "address": {
                "addressLine": "77 Cyber City",
                "area": "DLF Phase 2",
                "city": "Gurugram",
                "state": "Haryana",
                "pincode": "122002"
            },
            "bookingDate": "2027-01-10",
            "startTime": f"{10 + (self.timestamp % 8)}:00",
            "problemDescription": "Regular servicing required",
            "estimatedPrice": service.get("basePrice", 499)
        }
        b_res = requests.post(f"{BASE_URL}/bookings", headers=self.customer_headers, json=booking_payload)
        self.assertEqual(b_res.status_code, 201)
        booking_id = b_res.json()["data"]["_id"]

        # 3. Customer checks booking details by ID
        detail_res = requests.get(f"{BASE_URL}/bookings/{booking_id}", headers=self.customer_headers)
        self.assertEqual(detail_res.status_code, 200)
        self.assertEqual(detail_res.json()["data"]["status"], "PENDING")

        # 4. Provider accepts booking
        accept_res = requests.put(f"{BASE_URL}/bookings/{booking_id}/status", headers=self.provider_headers, json={
            "status": "ACCEPTED"
        })
        self.assertEqual(accept_res.status_code, 200)

        # 5. Customer verifies status updated
        cust_b_res = requests.get(f"{BASE_URL}/bookings/{booking_id}", headers=self.customer_headers)
        self.assertEqual(cust_b_res.json()["data"]["status"], "ACCEPTED")

        # 6. Provider completes booking
        comp_res = requests.put(f"{BASE_URL}/bookings/{booking_id}/status", headers=self.provider_headers, json={
            "status": "COMPLETED"
        })
        self.assertEqual(comp_res.status_code, 200)

        # 7. Customer submits review
        rev_res = requests.post(f"{BASE_URL}/reviews", headers=self.customer_headers, json={
            "providerId": self.provider_id,
            "bookingId": booking_id,
            "rating": 5,
            "comment": "Excellent service and punctual arrival!"
        })
        self.assertEqual(rev_res.status_code, 201)

        # 8. Cleanup test booking
        del_b = requests.delete(f"{BASE_URL}/bookings/{booking_id}", headers=self.admin_headers)
        self.assertEqual(del_b.status_code, 200)
        print("✓ Functional 03: Booking workflow, status transitions, and review completed")

    # ----------------------------------------------------
    # SECTION 2: PROVIDER PROFILE & AVAILABILITY
    # ----------------------------------------------------
    def test_04_provider_profile_and_availability(self):
        """Provider should be able to update their profile and availability"""
        # Save Availability
        avail_res = requests.post(f"{BASE_URL}/providers/availability", headers=self.provider_headers, json={
            "schedule": [
                {"day": "Monday", "available": True, "slots": [{"startTime": "08:00", "endTime": "16:00"}]},
                {"day": "Friday", "available": True, "slots": [{"startTime": "10:00", "endTime": "18:00"}]}
            ]
        })
        self.assertEqual(avail_res.status_code, 200)

        # Get Availability
        get_avail = requests.get(f"{BASE_URL}/providers/{self.provider_id}/availability")
        self.assertEqual(get_avail.status_code, 200)
        self.assertIn("schedule", get_avail.json()["data"])

        # Update Profile
        prof_res = requests.put(f"{BASE_URL}/providers/profile", headers=self.provider_headers, json={
            "bio": "Certified expert technician with over 6 years of experience",
            "hourlyRate": 350
        })
        self.assertEqual(prof_res.status_code, 200)
        print("✓ Functional 04: Provider availability and profile updates verified")

    # ----------------------------------------------------
    # SECTION 3: ADMIN MANAGEMENT & REPORTING
    # ----------------------------------------------------
    def test_05_admin_management_and_stats(self):
        """Admin can view dashboard stats, filter users, and manage categories"""
        # Get dashboard stats
        stats_res = requests.get(f"{BASE_URL}/admin/dashboard", headers=self.admin_headers)
        self.assertEqual(stats_res.status_code, 200)
        data = stats_res.json()["data"]
        self.assertIn("totalCustomers", data)
        self.assertIn("totalProviders", data)

        # Get customers list
        cust_list = requests.get(f"{BASE_URL}/admin/users?role=CUSTOMER", headers=self.admin_headers)
        self.assertEqual(cust_list.status_code, 200)
        self.assertGreater(len(cust_list.json()["data"]), 0)

        # Create Category
        cat_res = requests.post(f"{BASE_URL}/categories", headers=self.admin_headers, json={
            "name": f"Carpentry Test {self.timestamp}",
            "description": "Furniture repair and wood crafts",
            "icon": "FaHammer"
        })
        self.assertEqual(cat_res.status_code, 201)
        cat_id = cat_res.json()["data"]["_id"]

        # Delete Category
        del_cat = requests.delete(f"{BASE_URL}/categories/{cat_id}", headers=self.admin_headers)
        self.assertEqual(del_cat.status_code, 200)
        print("✓ Functional 05: Admin dashboard statistics, user filtering, and category CRUD passed")

    # ----------------------------------------------------
    # SECTION 4: SECURITY & ROLE-BASED ACCESS CONTROL (RBAC)
    # ----------------------------------------------------
    def test_06_rbac_security_enforcement(self):
        """Non-admin roles must be blocked with 403 Forbidden on protected admin endpoints"""
        # Customer attempting to access Admin dashboard
        r = requests.get(f"{BASE_URL}/admin/dashboard", headers=self.customer_headers)
        self.assertEqual(r.status_code, 403)

        # Customer attempting to access Admin users list
        r = requests.get(f"{BASE_URL}/admin/users", headers=self.customer_headers)
        self.assertEqual(r.status_code, 403)

        # Provider attempting to access Admin dashboard
        r = requests.get(f"{BASE_URL}/admin/dashboard", headers=self.provider_headers)
        self.assertEqual(r.status_code, 403)

        # Customer attempting to get Provider bookings
        r = requests.get(f"{BASE_URL}/bookings/provider", headers=self.customer_headers)
        self.assertEqual(r.status_code, 403)

        # Unauthenticated request to /auth/me
        r = requests.get(f"{BASE_URL}/auth/me")
        self.assertEqual(r.status_code, 401)
        print("✓ Functional 06: RBAC security and unauthorized access prevention verified")

    # ----------------------------------------------------
    # SECTION 5: EDGE CASES & ERROR RESILIENCE
    # ----------------------------------------------------
    def test_07_edge_cases_and_error_handling(self):
        """Test duplicate registration, invalid IDs, and non-existent lookups"""
        # Duplicate email registration
        r = requests.post(f"{BASE_URL}/auth/register", json={
            "name": "Duplicate User",
            "email": self.cust_email,
            "phone": "9999999999",
            "password": "password123",
            "role": "CUSTOMER"
        })
        self.assertEqual(r.status_code, 400)
        self.assertFalse(r.json()["success"])

        # Invalid login
        r = requests.post(f"{BASE_URL}/auth/login", json={
            "email": self.cust_email,
            "password": "completelywrongpassword"
        })
        self.assertEqual(r.status_code, 401)
        self.assertFalse(r.json()["success"])

        # Non-existent service ID lookup
        r = requests.get(f"{BASE_URL}/services/000000000000000000000000")
        self.assertEqual(r.status_code, 404)

        # Non-existent provider ID lookup
        r = requests.get(f"{BASE_URL}/providers/000000000000000000000000")
        self.assertEqual(r.status_code, 404)
        print("✓ Functional 07: Edge cases, duplicate detection, and 404 handling verified")

if __name__ == "__main__":
    unittest.main(verbosity=2)
