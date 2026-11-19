import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options

# Initialize Chrome Driver
options = Options()
# Run with GUI window (remove headless to see the browser action)
options.add_argument("--headless=new")
options.add_argument("--window-size=1920,1080")

driver = webdriver.Chrome(options=options)
driver.maximize_window()

print("1. Opening GharSeva Home Page...")
driver.get("http://localhost:5173")
time.sleep(2)

print("2. Entering search query on homepage...")
search_input = WebDriverWait(driver, 10).until(
    EC.presence_of_element_located((By.XPATH, "//input[@placeholder='What service do you need?']"))
)
search_input.send_keys("Deep Cleaning")
time.sleep(2)

print("3. Navigating to Services page...")
driver.find_element(By.XPATH, "//a[text()='Services']").click()
time.sleep(2)

print("4. Navigating to Providers page...")
driver.find_element(By.XPATH, "//a[text()='Providers']").click()
time.sleep(2)

print("5. Searching for provider by name...")
prov_search = WebDriverWait(driver, 10).until(
    EC.presence_of_element_located((By.XPATH, "//input[@placeholder='Search by name or skill...']"))
)
prov_search.send_keys("Amit")
time.sleep(2)

print("6. Navigating to Sign In page...")
driver.find_element(By.XPATH, "//a[text()='Sign In']").click()
time.sleep(1)

print("7. Filling Customer credentials...")
email_field = WebDriverWait(driver, 10).until(
    EC.presence_of_element_located((By.XPATH, "//input[@type='email']"))
)
email_field.send_keys("rahul@example.com")
password_field = driver.find_element(By.XPATH, "//input[@type='password']")
password_field.send_keys("password123")
time.sleep(1)

print("8. Submitting login form...")
driver.find_element(By.XPATH, "//button[@type='submit']").click()
time.sleep(2)

print("9. Opening Customer Dashboard...")
dashboard_btn = WebDriverWait(driver, 10).until(
    EC.presence_of_element_located((By.XPATH, "//a[contains(., 'Dashboard')]"))
)
dashboard_btn.click()
time.sleep(2)

print("10. Visiting Addresses section...")
addresses_link = WebDriverWait(driver, 10).until(
    EC.presence_of_element_located((By.XPATH, "//a[contains(text(), 'Addresses')]"))
)
addresses_link.click()
time.sleep(2)

print("11. Visiting My Bookings section...")
bookings_link = WebDriverWait(driver, 10).until(
    EC.presence_of_element_located((By.XPATH, "//a[contains(text(), 'My Bookings')]"))
)
bookings_link.click()
time.sleep(2)

print("11. Closing browser...")
driver.quit()
print("Execution finished successfully!")
