#!/usr/bin/python2.5

from xml.dom import minidom

import logging
import os
import os.path
from math import pow, exp, log
from datetime import datetime, timedelta
now=datetime.utcnow
import re

import urllib


######################################################################
# XML

def pretty_print_xml(s):
  return s # do the pretty print in javascript
  xml = minidom.parseString(s)
  return xml.toprettyxml()


from collections import defaultdict
import urllib2

# import HTMLParser

import wsgiref.handlers

from google.appengine.api import users
from google.appengine.api import urlfetch
from google.appengine.ext import webapp
from google.appengine.api import taskqueue
from google.appengine.runtime import DeadlineExceededError


######################################################################
# Template

from google.appengine.ext.webapp import template

def render_template(template_file, params):
  path = os.path.join(os.path.dirname(__file__),
                      template_file)
  return template.render(path, params)


######################################################################
# html

def escape(s):
  """Produce entities within text."""
  html_escape_table = {
    "&": "&amp;",
    '"': "&quot;",
    "'": "&apos;",
    ">": "&gt;",
    "<": "&lt;",
    }
  es = "".join(html_escape_table.get(c,c) for c in s)
  r=re.compile(r'\r?\n')
  return r.sub('<br>', es)

