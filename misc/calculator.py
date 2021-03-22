import datetime as dt
from functools import reduce

date_format = '%d.%m.%Y'


class Record:
	def __init__(self, amount, comment, date=None):
		self.amount = amount
		self.date = dt.datetime.strptime(date, date_format) if date else dt.datetime.now().date().strftime(date_format)
		self.comment = comment


class Calculator:
	def __init__(self, limit):
		self.limit = limit
		self.records = []

	def add_record(self, record):
		self.records.append(record)

	def get_today_stats(self):
		values = []
		for record in self.records:
			if record.date == dt.datetime.now().date().strftime(date_format):
				values.append(record)
		ate = reduce(lambda x, y: x.amount + y.amount, values)
		return f'Сегодня можно еще съесть: {self.limit - ate}'


class CaloriesCalculator(Calculator):
	def __init__(self, limit):
		super().__init__(limit)


class CashCalculator(Calculator):
	def __init__(self, limit):
		super().__init__(limit)

	def get_today_cash_remained(self, currency):
		pass


# создадим калькулятор денег с дневным лимитом 1000
cash_calculator = CashCalculator(1000)
calories_calculator = CaloriesCalculator(2500)

# дата в параметрах не указана,
# так что по умолчанию к записи должна автоматически добавиться сегодняшняя дата
cash_calculator.add_record(Record(amount=145, comment="кофе"))
calories_calculator.add_record(Record(amount=1186, comment="Кусок тортика. И ещё один."))

# и к этой записи тоже дата должна добавиться автоматически
cash_calculator.add_record(Record(amount=300, comment="Серёге за обед"))
calories_calculator.add_record(Record(amount=84, comment="Йогурт."))

# а тут пользователь указал дату, сохраняем её
cash_calculator.add_record(Record(amount=3000, comment="бар в Танин др", date="08.11.2019"))
calories_calculator.add_record(Record(amount=1140, comment="Баночка чипсов.", date="24.02.2019"))

print(cash_calculator.get_today_cash_remained("rub"))
print(calories_calculator.get_today_stats())
# должно напечататься
# На сегодня осталось 555 руб