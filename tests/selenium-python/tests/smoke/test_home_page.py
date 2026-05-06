import pytest

from pages.home_page import HomePage


@pytest.mark.smoke
def test_home_page_loads(driver, base_url):
    home_page = HomePage(driver, base_url).open().wait_until_loaded()

    assert home_page.title == "QA Shop"
