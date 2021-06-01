from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from rest_framework.utils import json

from crypterapp.codes import *


def index(request):
    return HttpResponse("Hello world!")


def crypt(request):
    data = []
    try:
        data = json.loads(request.body.decode())
    except ValueError:
        return JsonResponse({
            'error': 'bla bla bla',
        })
    text = data['text']
    code = data['code']
    mode = data['mode']
    if code == 'cesar':
        shift = int(data['shift'])
        alphabet = data['alphabet']
        if mode == 'encode':
            result = cesar(text, shift, alphabet, 1)
        elif mode == 'decode':
            result = cesar(text, shift, alphabet, -1)
        else:
            return JsonResponse({'data': 'error'})
    elif code == 'vigener':
        alphabet = data['alphabet']
        key = data['key']
        if mode == 'encode':
            result = vigener(text, key, alphabet, 1)
        elif mode == 'decode':
            result = vigener(text, key, alphabet, -1)
        else:
            return JsonResponse({'data': 'error'})
    elif code == 'feistel':
        w = int(data['round'])
        if mode == 'encode':
            result = feistel(text, True, w)
        elif mode == 'decode':
            result = feistel(text, False, w)
        else:
            return JsonResponse({'data': 'error'})
    else:
        return JsonResponse({'data': 'error'})
    return JsonResponse({'data': result})
