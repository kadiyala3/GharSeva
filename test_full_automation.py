import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# =====================================================================
# GharSeva Full End-to-End Selenium Automation Suite
# Target URL: http://localhost:5173 (or https://gharseva-mu.vercel.app/)
# =====================================================================

BASE_URL = "http://localhost:5173"  # Change to "https://gharseva-mu.vercel.app" to test live

print(f"Starting GharSeva Automation on: {BASE_URL}")

# 1. Initialize Chrome and maximize window
driver = webdriver.Chrome()
driver.maximize_window()
wait = WebDriverWait(driver, 10)

try:
    # 2. Open GharSeva application
    print("\n--- Step 1: Open GharSeva Homepage ---")
    driver.get(BASE_URL)
    time.sleep(2)
    print("Page Title:", driver.title)

    # 3. Search for a service in the hero search bar
    print("\n--- Step 2: Hero Service Search ---")
    search_service = wait.until(
        EC.presence_of_element_located((By.XPATH, "//input[@placeholder='What service do you need?']"))
    )
    search_service.clear()
    search_service.send_keys("Deep Cleaning")
    time.sleep(1)

    location_input = driver.find_element(By.XPATH, "//input[@placeholder='Where do you need it?']")
    location_input.clear()
    location_input.send_keys("Hyderabad")
    time.sleep(1)

    find_btn = driver.find_element(By.XPATH, "//button[contains(., 'Find Services')]")
    find_btn.click()
    print("Searched for 'Deep Cleaning' in 'Hyderabad'")
    time.sleep(2)

    # 4. Click 'Services' in the navigation bar
    print("\n--- Step 3: Navigate to Services Page ---")
    driver.find_element(By.XPATH, "//a[text()='Services']").click()
    time.sleep(2)
    print("Current URL:", driver.current_url)

    # 5. Click 'Providers' in the navigation bar
    print("\n--- Step 4: Navigate to Providers Page ---")
    driver.find_element(By.XPATH, "//a[text()='Providers']").click()
    time.sleep(2)
    print("Current URL:", driver.current_url)

    # 6. Filter / Search for a provider by name or skill
    print("\n--- Step 5: Filter Providers by Name/Skill ---")
    provider_search = wait.until(
        EC.presence_of_element_located((By.XPATH, "//input[@placeholder='Search by name or skill...']"))
    )
    provider_search.clear()
    provider_search.send_keys("Amit")
    print("Filtered providers by: 'Amit'")
    time.sleep(2)

    # 7. Navigate to the Sign In page
    print("\n--- Step 6: Navigate to Sign In Page ---")
    driver.find_element(By.XPATH, "//a[text()='Sign In']").click()
    time.sleep(1)

    # 8. Enter Customer login credentials
    print("\n--- Step 7: Enter Customer Credentials ---")
    email_input = wait.until(
        EC.presence_of_element_located((By.XPATH, "//input[@type='email']"))
    )
    email_input.clear()
    email_input.send_keys("rahul@example.com")

    password_input = driver.find_element(By.XPATH, "//input[@type='password']")
    password_input.clear()
    password_input.send_keys("password123")
    print("Entered credentials: rahul@example.com")
    time.sleep(1)

    # 9. Click 'Sign In' button
    print("\n--- Step 8: Submit Sign In Form ---")
    driver.find_element(By.XPATH, "//button[@type='submit']").click()
    time.sleep(2)

    # 10. Open Customer Dashboard from header
    print("\n--- Step 9: Open Customer Dashboard ---")
    dashboard_link = wait.until(
        EC.presence_of_element_located((By.XPATH, "//a[contains(., 'Dashboard')]"))
    )
    dashboard_link.click()
    time.sleep(2)
    print("Dashboard loaded:", driver.current_url)

    # 11. Navigate to 'My Bookings' section
    print("\n--- Step 10: Navigate to My Bookings ---")
    bookings_link = wait.until(
        EC.presence_of_element_located((By.XPATH, "//a[contains(text(), 'My Bookings')]"))
    )
    bookings_link.click()
    time.sleep(2)
    print("Bookings URL:", driver.current_url)

    # 12. Navigate to 'Addresses' section
    print("\n--- Step 11: Navigate to Addresses ---")
    addresses_link = wait.until(
        EC.presence_of_element_located((By.XPATH, "//a[contains(text(), 'Addresses')]"))
    )
    addresses_link.click()
    time.sleep(2)
    print("Addresses URL:", driver.current_url)

    # 13. Navigate to 'Profile' section
    print("\n--- Step 12: Navigate to Profile ---")
    profile_link = wait.until(
        EC.presence_of_element_located((By.XPATH, "//a[contains(text(), 'Profile')]"))
    )
    profile_link.click()
    time.sleep(2)
    print("Profile URL:", driver.current_url)

    # 14. Log Out from Header
    print("\n--- Step 13: Perform Logout ---")
    logout_btn = wait.until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Logout')]"))
    )
    logout_btn.click()
    time.sleep(2)
    print("User logged out successfully!")

    print("\n=======================================================")
    print("SUCCESS: Full GharSeva Automation completed successfully!")
    print("=======================================================")

finally:
    # 15. Close the browser
    time.sleep(3)
    driver.quit()
