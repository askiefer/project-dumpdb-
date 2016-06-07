import unittest
from selenium import webdriver
from selenium.common.exceptions import NoAlertPresentException
from selenium.webdriver.support import expected_conditions as EC

class TestPage(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Firefox()

    def tearDown(self):
        self.driver.quit()

    def test_title(self):
        self.driver.get("http://localhost:5000/sites")
        self.assertEqual(self.driver.title, 'Landfill Database')

    # def test_alert(self):
    #     self.driver.get("http://localhost:5000/sites")
    #     zipcode = self.driver.find_element_by_id('zipcode')
    #     zipcode.send_keys("alphatest")
    #     zip_btn = self.driver.find_element_by_id('zip-button')
    #     zip_btn.click()
    #     try:
    #         context.driver.switch_to.alert.accept()
    #     except NoAlertPresentException:
    #         pass

    def test_calc(self):
        self.driver.get("http://localhost:5000/sites")
        zipcode = self.driver.find_element_by_id('zipcode')
        zipcode.send_keys("94513")

        btn = self.driver.find_element_by_id('zip-button')
        btn.click()

        lfg_result = self.driver.find_element_by_id('landfill-gas')
        mw_result = self.driver.find_element_by_id('megawatts')
        homes_result = self.driver.find_element_by_id('homes')

        self.assertEqual(lfg_result.text, '24994285.78')
        self.assertEqual(mw_result.text, '45.13')
        self.assertEqual(homes_result.text, '45130.0')

    # def test_report(self):
    #     report = driver.find_element_by_name('reportForm')
    #     pie = driver.find_element_by_id('pie')
    #     doughnut = driver.find_element_by_id('doughnut')
    #     map = driver.find_element_by_id('map')

    #     submit_report = driver.find_element_by_id('report-submit')
    #     submit_report.click()


if __name__ == '__main__':
    unittest.main()
    driver = init_driver()

