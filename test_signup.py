import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support.ui import Select
from selenium.webdriver.support import expected_conditions as EC

# =====================================================================
# GharSeva Sign Up / Registration Automation Script
# Target: http://localhost:5173/register (or https://gharseva-mu.vercel.app/register)
# =====================================================================

BASE_URL = "http://localhost:5173"

# 1. Initialize Chrome and maximize window
driver = webdriver.Chrome()
driver.maximize_window()
wait = WebDriverWait(driver, 10)

try:
    print(f"Opening GharSeva Sign Up page on {BASE_URL}...")
    
    # 2. Open Homepage and click 'Sign Up' in header
    driver.get(BASE_URL)
    time.sleep(2)

    signup_header_link = wait.until(
        EC.element_to_be_clickable((By.XPATH, "//a[contains(text(), 'Sign Up')]"))
    )
    signup_header_link.click()
    print("Clicked 'Sign Up' in header. Current URL:", driver.current_url)
    time.sleep(1)

    # 3. Verify 'Create an Account' title
    title_element = wait.until(
        EC.presence_of_element_located((By.XPATH, "//h2[contains(text(), 'Create an Account')]"))
    )
    print("Page Title Verified:", title_element.text)

    # 4. Generate unique test email to avoid duplicate user conflicts
    unique_id = int(time.time())
    full_name = f"Rajesh Test {unique_id}"
    test_email = f"rajesh_{unique_id}@example.com"
    test_phone = "9876543210"
    test_password = "Password@123"

    print(f"\nFilling registration form with:")
    print(f" - Name:     {full_name}")
    print(f" - Email:    {test_email}")
    print(f" - Phone:    {test_phone}")
    print(f" - Password: {test_password}")
    print(f" - Role:     Customer")

    # 5. Fill 'Full Name'
    name_input = driver.find_element(By.XPATH, "//input[@name='name']")
    name_input.clear()
    name_input.send_keys(full_name)
    time.sleep(1)

    # 6. Fill 'Email Address'
    email_input = driver.find_element(By.XPATH, "//input[@name='email']")
    email_input.clear()
    email_input.send_keys(test_email)
    time.sleep(1)

    # 7. Fill 'Phone Number'
    phone_input = driver.find_element(By.XPATH, "//input[@name='phone']")
    phone_input.clear()
    phone_input.send_keys(test_phone)
    time.sleep(1)

    # 8. Fill 'Password'
    pwd_input = driver.find_element(By.XPATH, "//input[@name='password']")
    pwd_input.clear()
    pwd_input.send_keys(test_password)
    time.sleep(1)

    # 9. Select Role (Customer or Service Provider)
    role_dropdown = Select(driver.find_element(By.XPATH, "//select[@name='role']"))
    role_dropdown.select_by_value("CUSTOMER")
    time.sleep(1)

    # 10. Click 'Create Account' button
    print("\nSubmitting registration form...")
    submit_btn = driver.find_element(By.XPATH, "//button[@type='submit']")
    submit_btn.click()
    time.sleep(3)

    # 11. Verify successful account creation & login
    # When registered, the user is automatically logged in and redirected to home/dashboard
    dashboard_link = wait.until(
        EC.presence_of_element_located((By.XPATH, "//a[contains(., 'Dashboard')]"))
    )
    print("SUCCESS: Registration completed! Logged in as:", full_name)
    print("Dashboard element found on page:", dashboard_link.text)

    # 12. Open Dashboard to confirm account access
    dashboard_link.click()
    time.sleep(2)
    print("Navigated to Dashboard URL:", driver.current_url)

    print("\n=======================================================")
    print("Sign Up Automation completed with 100% SUCCESS!")
    print("=======================================================")

finally:
    time.sleep(3)
    driver.quit()
