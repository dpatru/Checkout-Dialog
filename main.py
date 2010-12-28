#!/usr/local/bin/python2.5

__author__ = 'dpatru@gmail.com (Daniel Patru)'

import logging
import os
import os.path
import re
import math
from base64 import b64encode
from datetime import datetime, timedelta
now=datetime.now
from collections import defaultdict
from urllib import urlencode
import urllib2

import wsgiref.handlers

from google.appengine.api import users
from google.appengine.api import urlfetch
from google.appengine.ext import webapp
from google.appengine.api import taskqueue
from google.appengine.api import channel

from google.appengine.ext.webapp import template


from utils import render_template, pretty_print_xml


class Listener(webapp.RequestHandler):
  def get(self):
    self.response.out.write(render_template('listener.html', dict()))
  def post(self):
    merchant_id = self.request.get('merchant_id')
    merchant_key = self.request.get('merchant_key')
    if merchant_id and merchant_key:
      token = channel.create_channel(merchant_id+'/'+merchant_key)
      self.response.out.write(token)

class Sender(webapp.RequestHandler):
  def post(self):
    merchant_id = self.request.get('merchant_id')
    merchant_key = self.request.get('merchant_key')
    content_type = self.request.get('content_type', 'application/xml; charset=UTF-8')
    msg = self.request.get('msg')
    url = self.request.get('url')
    if merchant_id and merchant_key and content_type and msg and url:
      headers = {
        'Content-Type': content_type,
        'Accept': content_type,
        'Authorization': 'Basic '+b64encode(merchant_id+':'+merchant_key),
        }
      results = urlfetch.fetch(
        url,
        headers=headers,
        payload=msg,
        method=urlfetch.POST)
      self.response.out.write(pretty_print_xml(results.content))
      
      

class GoogleCheckoutListener(webapp.RequestHandler):
  def post(self, i, k):
    token_key = i+'/'+k
    # listen for serial number notifications
    request = self.request
    response=render_template(
      'notification_acknowledgment.xml',
      dict(serial_number=request.get('serial-number')))
    self.response.headers['Content-Type'] = 'application/xml; charset=UTF-8'
    self.response.out.write(response)
    message = '''
%s. Just got serial number notification: %s.
%s'''%(request.url, request.body, pretty_print_xml(response))
    channel.send_message(token_key, message)
  def get(self, i, k):
    self.response.out.write('Got id %s and key %s'%(i,k))



def main():
  debug='Development' in os.environ['SERVER_SOFTWARE']
  if debug: logging.getLogger().setLevel(logging.DEBUG)
  application = webapp.WSGIApplication([
      (r'/([^:]+)/(.+)$', GoogleCheckoutListener),
      ('/', Listener),
      ('/sender', Sender),
      ],
      debug=debug)
  wsgiref.handlers.CGIHandler().run(application)



if __name__ == '__main__':
  main()


