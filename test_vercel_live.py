import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# 1. Initialize Chrome WebDriver
driver = webdriver.Chrome()

try:
    # 2. Open live Vercel deployment URL & Maximize window
    driver.get("https://gharseva-mu.vercel.app/")
    driver.maximize_window()
    print("Page loaded successfully:", driver.title)
    time.sleep(2)

    # 3. Test Service Search Input on Homepage
    wait = WebDriverWait(driver, 10)
    service_input = wait.until(
        EC.presence_of_element_located((By.XPATH, "//input[@placeholder='What service do you need?']"))
    )
    service_input.clear()
    service_input.send_keys("Plumbing Service")
    print("Typed into service search input: 'Plumbing Service'")

    location_input = driver.find_element(By.XPATH, "//input[@placeholder='Where do you need it?']")
    location_input.clear()
    location_input.send_keys("Hyderabad")
    print("Typed into location input: 'Hyderabad'")

    # Click 'Find Services' button
    find_btn = driver.find_element(By.XPATH, "//button[contains(., 'Find Services')]")
    find_btn.click()
    print("Clicked 'Find Services' button")
    time.sleep(2)

    # 4. Test Popular Category Card click (e.g. Electrician)
    driver.get("https://gharseva-mu.vercel.app/")
    time.sleep(2)
    electrician_card = wait.until(
        EC.element_to_be_clickable((By.XPATH, "//a[contains(@href, 'category=Electrician') or contains(., 'Electrician')]"))
    )
    electrician_card.click()
    print("Navigated to category filter via card click:", driver.current_url)
    time.sleep(2)

    # 5. Test Navigation to Login Page
    driver.get("https://gharseva-mu.vercel.app/login")
    login_heading = wait.until(
        EC.presence_of_element_located((By.XPATH, "//h2[contains(text(), 'Welcome Back')]"))
    )
    print("Verified Login page heading:", login_heading.text)

    email_input = driver.find_element(By.XPATH, "//input[@type='email']")
    email_input.clear()
    email_input.send_keys("customer@gharseva.com")

    password_input = driver.find_element(By.XPATH, "//input[@type='password']")
    password_input.clear()
    password_input.send_keys("Customer@123")
    print("Entered sample login credentials into form")
    time.sleep(2)

    # 6. Test Navigation to Register Page
    driver.get("https://gharseva-mu.vercel.app/register")
    register_heading = wait.until(
        EC.presence_of_element_located((By.XPATH, "//h2[contains(text(), 'Create an Account')]"))
    )
    print("Verified Register page heading:", register_heading.text)
    time.sleep(2)

    print("\nAll live tests on https://gharseva-mu.vercel.app/ PASSED successfully!")

finally:
    # 7. Close browser window
    time.sleep(3)
    driver.quit()
