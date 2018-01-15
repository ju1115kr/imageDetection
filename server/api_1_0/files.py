# -*- coding:utf-8 -*-
import os
import time
from flask import request, jsonify, g, send_from_directory, redirect, url_for, make_response
from . import api
from errors import not_found, forbidden, bad_request

UPLOAD_FOLDER = os.path.join(api.root_path, '../../file/')
ALLOWED_PIC_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif', 'bmp'])

def allowed_picture(filename):
    return '.' in filename and\
        filename.rsplit('.', 1)[1] in ALLOWED_PIC_EXTENSIONS

def addTimestamp(filename):
    now = time.localtime()
    timestamp = "_%04d%02d%02d_%02d%02d%02d" %\
                (now.tm_year, now.tm_mon, now.tm_mday, now.tm_hour, now.tm_min, now.tm_sec)
    return filename.rsplit('.', 1)[0] + timestamp + "." + filename.rsplit('.', 1)[1]


@api.route('/file', methods=['POST'])
def post_file():
    if request.files['file'] is None:
        return bad_request('File Request in invaild')
    file = request.files['file']
    if file and allowed_file(file.filename.lower()):
        filename = file.filename
        filelocate = addTimestamp(filename)
    file.save(os.path.join(UPLOAD_FOLDER, filelocate))
#    return make_response(redirect(url_for('api.uploaded_file', filelocate=filelocate)))
    return url_for('api.uploaded_file', filelocate=filelocate)
#    print(send_from_directory(UPLOAD_FOLDER, filelocate))
#    return send_from_directory(UPLOAD_FOLDER, filelocate)


@api.route('/file/<filelocate>', methods=['GET'])
def uploaded_file(filelocate):
    return send_from_directory(UPLOAD_FOLDER, filelocate)

