import unittest
from selenium import webdriver
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support.ui import WebDriverWait

class TestPage(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Firefox()

    def tearDown(self):
        self.driver.quit()

    def test_title(self):
        self.driver.get("http://localhost:5000/sites")
        self.assertEqual(self.driver.title, 'Landfill Database')

    def test_alert(self):
        self.driver.get("http://localhost:5000/sites")
        zipcode = self.driver.find_element_by_id('zipcode')
        zipcode.send_keys("alphatest")
        self.driver.find_element_by_id('zip-button').click()
        try:
            WebDriverWait(self.driver, 3).until(EC.alert_is_present(), 'Timed out')

            alert = self.driver.switch_to.alert()
            alert.accept()
            print "alert accepted"
        except TimeoutException:
            print "no alert"

    def test_zip(self):
        self.driver.get("http://localhost:5000/sites")
        zipcode = self.driver.find_element_by_id('zipcode')
        zipcode.send_keys("94513")

        btn = self.driver.find_element_by_id('zip-button')
        btn.click()

        lfg_result = self.driver.find_element_by_id('landfill-gas')
        mw_result = self.driver.find_element_by_id('megawatts')
        homes_result = self.driver.find_element_by_id('homes')

    def test_calc(self):
        self.driver.get("http://localhost:5000/sites")
        calc = self.driver.find_element_by_id('calc')
        calc.send_keys("2000")
         try:
            WebDriverWait(self.driver, 3).until(EC.presence_of_element_located(By.ID, 'lfg_result'))
            alert = self.driver.switch_to.alert()
            alert.accept()
            print "alert accepted"
        except TimeoutException:
            print "no alert"

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
