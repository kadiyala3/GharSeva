import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Initialize Chrome browser
driver = webdriver.Chrome()

# Open the live Vercel website
driver.get("https://gharseva-mu.vercel.app/")
driver.maximize_window()

wait = WebDriverWait(driver, 10)

# 1. Search for a service
search_service = wait.until(
    EC.presence_of_element_located((By.XPATH, "//input[@placeholder='What service do you need?']"))
)
search_service.send_keys("Plumber")

# 2. Enter location
search_location = driver.find_element(By.XPATH, "//input[@placeholder='Where do you need it?']")
search_location.send_keys("Hyderabad")

# 3. Click Find Services button
driver.find_element(By.XPATH, "//button[contains(., 'Find Services')]").click()
time.sleep(3)

# 4. Navigate to Login Page
driver.get("https://gharseva-mu.vercel.app/login")
time.sleep(2)

# 5. Fill Login credentials
email_input = wait.until(
    EC.presence_of_element_located((By.XPATH, "//input[@type='email']"))
)
email_input.send_keys("customer@gharseva.com")

password_input = driver.find_element(By.XPATH, "//input[@type='password']")
password_input.send_keys("Customer@123")

time.sleep(5)
driver.quit()
