
def logger(func):
    import time

    def wrapper():
        start = time.perf_counter()
        func()
        print(time.perf_counter() - start)
    return wrapper


@logger
def foo():
    print('hello')


for i in range(3):
    foo()

