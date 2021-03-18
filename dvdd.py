

def count_let(word, letter=None):
    # lower = [x for x in word if x.islower()]
    # print('Lower case:', len(lower))

    if letter:
        print(letter, word.count(letter))
    else:
        o = ['О', 'о', 'O', 'o']
        for _ in o:
            print(_, word.count(_))
# count_let('Молоко', letter='О')

# * capitalize('А роза упала на лапу Азора') === 'А Роза Упала На Лапу Азора'
# * capitalize('Use the force, Luke') === 'Use The Force, Luke'


def capitalize(string:str):
    words = string.lower().split()
    new = []
    for w in words:
        # print(w[0].upper()+w[1:])
        new.append(w[0].upper()+w[1:])

    print(' '.join(new))

capitalize('А роза упала на лапу Азора')

