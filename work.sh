#! /bin/bash -x
# prepare the environment
gae=~/google_appengine # change this variable to point to your appengine install
export gae
export PYTHONPATH=".:$gae"
export PATH="$gae:$PATH"

emacs -l start.el main.py  &


