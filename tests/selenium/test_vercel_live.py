import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def run_live_test(headless=True):
    opts = Options()
    if headless:
        opts.add_argument('--headless=new')
        opts.add_argument('--no-sandbox')
        opts.add_argument('--disable-dev-shm-usage')
    
    driver = webdriver.Chrome(options=opts)
    wait = WebDriverWait(driver, 10)
    
    try:
        # 1. Open live Vercel URL
        print("Navigating to https://gharseva-mu.vercel.app/ ...")
        driver.get("https://gharseva-mu.vercel.app/")
        driver.maximize_window()
        time.sleep(2)
        print("Page Title:", driver.title)
        assert "frontend" in driver.title or "GharSeva" in driver.page_source

        # 2. Hero search inputs
        service_input = wait.until(
            EC.presence_of_element_located((By.XPATH, "//input[@placeholder='What service do you need?']"))
        )
        service_input.clear()
        service_input.send_keys("Plumber")
        print("Filled service input: 'Plumber'")

        location_input = driver.find_element(By.XPATH, "//input[@placeholder='Where do you need it?']")
        location_input.clear()
        location_input.send_keys("Hyderabad")
        print("Filled location input: 'Hyderabad'")

        find_btn = driver.find_element(By.XPATH, "//button[contains(., 'Find Services')]")
        find_btn.click()
        print("Clicked 'Find Services' button")
        time.sleep(2)

        # 3. Test Navigation to /login
        driver.get("https://gharseva-mu.vercel.app/login")
        login_h2 = wait.until(
            EC.presence_of_element_located((By.XPATH, "//h2[contains(., 'Welcome Back')]"))
        )
        print("Verified /login heading:", login_h2.text)

        email_input = driver.find_element(By.XPATH, "//input[@type='email']")
        email_input.clear()
        email_input.send_keys("customer@gharseva.com")

        password_input = driver.find_element(By.XPATH, "//input[@type='password']")
        password_input.clear()
        password_input.send_keys("Customer@123")
        print("Entered credentials into login form")
        time.sleep(1)

        # 4. Test Navigation to /register
        driver.get("https://gharseva-mu.vercel.app/register")
        reg_h2 = wait.until(
            EC.presence_of_element_located((By.XPATH, "//h2[contains(., 'Create an Account')]"))
        )
        print("Verified /register heading:", reg_h2.text)
        time.sleep(1)

        # 5. Test Navigation to /services
        driver.get("https://gharseva-mu.vercel.app/services")
        services_h1 = wait.until(
            EC.presence_of_element_located((By.XPATH, "//h1[contains(., 'Our Services')]"))
        )
        print("Verified /services heading:", services_h1.text)

        print("\nSUCCESS: All UI and navigation tests passed on https://gharseva-mu.vercel.app/!")
    finally:
        driver.quit()

if __name__ == "__main__":
    run_live_test(headless=True)
