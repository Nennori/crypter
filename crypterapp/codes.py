import copy
from array import array
import numpy as np

alphabet_rus = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя'
alphabet_en = 'abcdefghijklmnopqrstuvwxyz'


def cesar(text, shift, alphabet, mode):
    if alphabet == 'ru':
        return cesar_func(text, shift, alphabet_rus, mode)
    elif alphabet == 'en':
        return cesar_func(text, shift, alphabet_en, mode)


def cesar_func(text, shift, alphabet, mode):
    res = ''
    length = len(alphabet)
    for i in text:
        if i.isupper():
            i = i.lower()
            place = alphabet.find(i)
            if place == -1:
                res += i
            else:
                new_place = place + mode * shift
                res += alphabet[new_place].upper()
        else:
            place = alphabet.find(i)
            if place == -1:
                res += i
            else:
                new_place = place + mode * shift
                res += alphabet[new_place % length]
    return res


def vigener(text, key, alphabet, mode):
    if alphabet == 'ru':
        return vigener_func(text, key, alphabet_rus, mode)
    elif alphabet == 'en':
        return vigener_func(text, key, alphabet_en, mode)


def vigener_func(text, key, alphabet, mode):
    res = ''
    code_list = get_code_list(key, alphabet)
    key_len = len(key)
    for i in range(0, len(text)):
        if text[i].isupper():
            place = alphabet.find(text[i].lower())
            if place == -1:
                res += text[i]
            else:
                new_place = place + mode * code_list[i % key_len]
                res += alphabet[new_place % len(alphabet)].upper()
        else:
            place = alphabet.find(text[i])
            if place == -1:
                res += text[i]
            else:
                new_place = place + mode * code_list[i % key_len]
                res += alphabet[new_place % len(alphabet)]
    return res


def get_code_list(key, alphabet):
    res = []
    for i in key:
        res.append(alphabet.find(i))
    return res


def f(x1, vr):
    return (x1 + vr) % 110000


def feistel(text, f, w):
    text_b = []
    res = ''
    for i in text:
        text_b.append(ord(i))
    text_b = crypt(text_b, f, w)
    for i in text_b:
        res += chr(i)
    return res


def crypt(text, f, w):
    res = []
    for i in range(0, len(text) - 2, 2):
        tmp = copy.copy(text[i:i + 2])
        tmp = render(tmp, w, not f)
        for n in range(0, 2):
            res.append(tmp[n])
    res.append(text[len(text) - 1])
    return res


def render(xn, w, reverse):
    l = xn[0]
    r = xn[1]
    if reverse:
        rounds = w
    else:
        rounds = 1
    for i in range(0, w):
        if i < w - 1:
            t = l
            l = (r ^ f(l, rounds))
            r = t
        else:
            r = (r ^ f(l, rounds))
        if reverse:
            rounds -= 1
        else:
            rounds += 1
    xn[0] = l
    xn[1] = r
    return xn
