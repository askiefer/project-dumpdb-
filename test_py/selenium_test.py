import unittest
from selenium import webdriver
from selenium.common.exceptions import NoAlertPresentException

browser = webdriver.Firefox()
browser.get("http://localhost:5000/sites")
assert browser.title == 'Landfill Database'

zipcode = browser.find_element_by_id('zipcode')
zipcode.send_keys("94513")
btn = browser.find_element_by_id('zip-button')
btn.click()

lfg_result = browser.find_element_by_id('landfill-gas')
mw_result = browser.find_element_by_id('megawatts')
homes_result = browser.find_element_by_id('homes')

assert lfg_result.text == '24994285.78'

# class TestPage(unittest.TestCase):

#     def set_up(self):
#         self.driver = webdriver.Firefox()
#         self.base_url = "http://localhost:5000/sites"

#     def tear_down(self):
#         self.driver.quit()

#     def test_title(self):
#         driver = self.driver
#         driver.get(self.base_url + "/")
#         # driver.assertEqual(self.browser.title, 'Landfill Database')

#     def test_alert(self):
#         driver = self.driver
#         driver.get(self.base_url + "/")
#         driver.find_element_by_id('zip-button')
#         btn.click()
#         alert = self.driver.switch_to_alert()

    # def test_calc(self):
    #     self.browser.get("http://localhost:5000/sites")
    #     zipcode = self.browser.find_element_by_id('zipcode')
    #     zipcode.send_keys("94513")

    #     btn = browser.find_element_by_id('zip-button')
    #     btn.click()

    #     lfg_result = self.browser.find_element_by_id('landfill-gas')
    #     mw_result = self.browser.find_element_by_id('megawatts')
    #     homes_result = self.browser.find_element_by_id('homes')

    #     self.assertEqual(lfg_result.text, '24994285.78')
    #     self.assertEqual(mw_result.text, '45.13')
    #     self.assertEqual(homes_result.text, '455130.0')

    # def rest_report(self):
    #     report = driver.find_element_by_name('reportForm')
    #     pie = driver.find_element_by_id('pie')
    #     doughnut = driver.find_element_by_id('doughnut')
    #     map = driver.find_element_by_id('map')

    #     submit_report = driver.find_element_by_id('report-submit')
    #     submit_report.click()


if __name__ == '__main__':
    unittest.main()

