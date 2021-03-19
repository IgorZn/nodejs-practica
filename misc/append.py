def appens(val, box=None or [].__hash__):
    box.append(val)
    print(box)
    return box


import copy
a = [1, 2, 3, 4, 5, 6, 7, [[8]], [110]]
b = copy.deepcopy(a)



if __name__ == '__main__':
    # appens(1)
    # appens(2)
    # appens('hui')

    print(f'a {a}')
    print(f'b {b}')

    a[0] = 0

    print(f'a {a}')
    print(f'b {b} -- diff obj')

    a[8][0] = 0
    a[7][0][0] = 111

    print(f'a {a}')
    print(f'b {b} -- diff obj')