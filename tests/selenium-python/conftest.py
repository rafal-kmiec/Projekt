import os

import pytest
from selenium import webdriver
from selenium.webdriver.chrome.options import Options as ChromeOptions


@pytest.fixture(scope="session")
def base_url():
    return os.getenv("DEMO_APP_BASE_URL", "http://localhost:5173")


@pytest.fixture
def driver():
    options = ChromeOptions()
    if os.getenv("HEADLESS", "true").lower() == "true":
        options.add_argument("--headless=new")
    options.add_argument("--window-size=1440,1000")
    browser = webdriver.Chrome(options=options)
    yield browser
    browser.quit()
