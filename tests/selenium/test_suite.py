import unittest
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

BASE_URL = "http://localhost:5173"

class GharSevaSeleniumTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        chrome_options = Options()
        chrome_options.add_argument("--headless=new")
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--window-size=1920,1080")
        cls.driver = webdriver.Chrome(options=chrome_options)
        cls.driver.implicitly_wait(10)

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

    def setUp(self):
        # Clear storage and cookies between tests
        self.driver.get(BASE_URL)
        self.driver.execute_script("window.localStorage.clear(); window.sessionStorage.clear();")
        self.driver.delete_all_cookies()

    def test_01_home_page_rendering(self):
        """Test home page loads with branding, navigation, and service categories"""
        self.driver.get(BASE_URL)
        WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'GHARSEVA')]"))
        )
        page_text = self.driver.page_source
        self.assertIn("GHARSEVA", page_text)
        self.assertIn("Services", page_text)
        self.assertIn("Providers", page_text)
        print("✓ Test 01: Home page rendered with navigation links")

    def test_02_browse_services(self):
        """Test navigating to Services catalog"""
        self.driver.get(f"{BASE_URL}/services")
        WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, "h1"))
        )
        page_text = self.driver.page_source
        self.assertIn("Services", page_text)
        print("✓ Test 02: Services catalog rendered successfully")

    def test_03_browse_providers(self):
        """Test navigating to Providers directory"""
        self.driver.get(f"{BASE_URL}/providers")
        WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Find Trusted Professionals')]"))
        )
        # Wait for providers list to finish loading
        WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Verified') or contains(text(), 'View Profile')]"))
        )
        page_text = self.driver.page_source
        self.assertIn("Find Trusted Professionals", page_text)
        print("✓ Test 03: Providers directory rendered successfully")

    def test_04_customer_authentication_and_dashboard(self):
        """Test Customer login flow and redirect to dashboard"""
        self.driver.get(f"{BASE_URL}/login")
        
        email_input = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//input[@type='email']"))
        )
        password_input = self.driver.find_element(By.XPATH, "//input[@type='password']")
        submit_btn = self.driver.find_element(By.XPATH, "//button[@type='submit']")

        email_input.clear()
        email_input.send_keys("rahul@example.com")
        password_input.clear()
        password_input.send_keys("password123")
        submit_btn.click()

        # Should navigate to home or dashboard
        time.sleep(1.5)
        self.driver.get(f"{BASE_URL}/customer/dashboard")
        WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Dashboard')]"))
        )
        self.assertIn("customer", self.driver.current_url)
        print("✓ Test 04: Customer login and dashboard access verified")

    def test_05_customer_addresses_page(self):
        """Test customer addresses management page"""
        # Set authenticated customer in localStorage
        self.driver.get(f"{BASE_URL}/login")
        self.driver.find_element(By.XPATH, "//input[@type='email']").send_keys("rahul@example.com")
        self.driver.find_element(By.XPATH, "//input[@type='password']").send_keys("password123")
        self.driver.find_element(By.XPATH, "//button[@type='submit']").click()
        time.sleep(1.5)

        self.driver.get(f"{BASE_URL}/customer/addresses")
        WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'My Addresses')]"))
        )
        self.assertIn("My Addresses", self.driver.page_source)
        print("✓ Test 05: Customer addresses page rendered correctly")

    def test_06_provider_authentication_and_dashboard(self):
        """Test Provider login flow, dashboard, and availability schedule"""
        self.driver.get(f"{BASE_URL}/login")
        
        email_input = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//input[@type='email']"))
        )
        email_input.clear()
        email_input.send_keys("amit@provider.com")
        password_input = self.driver.find_element(By.XPATH, "//input[@type='password']")
        password_input.clear()
        password_input.send_keys("password123")
        self.driver.find_element(By.XPATH, "//button[@type='submit']").click()
        time.sleep(1.5)

        self.driver.get(f"{BASE_URL}/provider/dashboard")
        WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Dashboard')]"))
        )
        self.assertIn("provider", self.driver.current_url)

        # Check availability page
        self.driver.get(f"{BASE_URL}/provider/availability")
        WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Monday')]"))
        )
        self.assertIn("Monday", self.driver.page_source)
        print("✓ Test 06: Provider login, dashboard, and availability schedule verified")

    def test_07_admin_authentication_and_management(self):
        """Test Admin login, dashboard analytics, user list, and categories"""
        self.driver.get(f"{BASE_URL}/login")
        
        email_input = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//input[@type='email']"))
        )
        email_input.clear()
        email_input.send_keys("admin@gharseva.com")
        password_input = self.driver.find_element(By.XPATH, "//input[@type='password']")
        password_input.clear()
        password_input.send_keys("password123")
        self.driver.find_element(By.XPATH, "//button[@type='submit']").click()
        time.sleep(1.5)

        self.driver.get(f"{BASE_URL}/admin/dashboard")
        WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Total Customers')]"))
        )
        page_source = self.driver.page_source
        self.assertIn("Total Customers", page_source)
        self.assertIn("Total Providers", page_source)

        # Check Admin Users page
        self.driver.get(f"{BASE_URL}/admin/users")
        WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Manage Customers')]"))
        )
        self.assertIn("Manage Customers", self.driver.page_source)
        print("✓ Test 07: Admin login, dashboard metrics, and user management verified")

    def test_08_invalid_login_validation(self):
        """Test invalid credentials error handling"""
        self.driver.get(f"{BASE_URL}/login")
        
        email_input = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//input[@type='email']"))
        )
        email_input.clear()
        email_input.send_keys("wrong_email@example.com")
        password_input = self.driver.find_element(By.XPATH, "//input[@type='password']")
        password_input.clear()
        password_input.send_keys("incorrectpassword")
        self.driver.find_element(By.XPATH, "//button[@type='submit']").click()
        
        time.sleep(1.0)
        # Verify user stays on login page
        self.assertIn("/login", self.driver.current_url)
        print("✓ Test 08: Invalid login handled and rejected safely")

if __name__ == "__main__":
    unittest.main(verbosity=2)
