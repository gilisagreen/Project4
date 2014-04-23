""" main.py is the top level script.

Return "Hello World" at the root URL.
"""

import os
import jinja2
import sys
from os import path
from google.appengine.api import users
from google.appengine.api import channel
from google.appengine.ext import db
from google.appengine.ext.webapp.template import render
from google.appengine.ext.webapp.util import login_required
from google.appengine.ext.webapp import template
import webapp2
# sys.path includes 'server/lib' due to appengine_config.py
from flask import Flask
from flask import render_template
import flask


import datetime
import logging
import random
import json as simplejson
from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app
app = Flask(__name__)


#__init__.py classes
def create_channel(key):
    return channel.create_channel(key)

def get_game_from_request(request):
    game_id = request.get('game')
    if game_id:
        return Game.get_by_id(int(game_id))
    return None

def get_game_from_id(game_id):
    if id:
        return Game.get_by_id(int(game_id))
    return None

def get_other_player_channel_key(game, user):
    if game.player1 == user:
        return str(game.key().id()) + g_id.player2.user_id()
    else:
        return str(game.key().id()) + game.player1.user_id()

def get_user_dump(user, format='json'):
    if user:
        if format == 'dict':
            return {'id': user.user_id(), 'name': user.nickname()}
        elif format == 'json':
            return simplejson.dumps({'id': user.user_id(), 'name': user.nickname()})
    return None


# board.py
class Game(db.Model):
    hand = db.TextProperty()
    player1 = db.UserProperty()
    player2 = db.UserProperty()

    def may_join(self, user):
        if self.player2:
            return False
        else:
            self.player2 = user
            self.put()
        return True




class MainHandler(webapp2.RequestHandler):
    def get(self):
        user = users.get_current_user()
        context = {
            'user':      user,
            'login':     users.create_login_url(self.request.uri),
            'logout':    users.create_logout_url(self.request.uri),
        }
        tmpl = path.join(path.dirname(__file__), 'welcome.html')
        self.response.write(render(tmpl, context))

class OnePlayer(webapp2.RequestHandler):
    def get(self):
        user = users.get_current_user()
        context = {
            'user':      user,
            'login':     users.create_login_url(self.request.uri),
            'logout':    users.create_logout_url(self.request.uri),
        }
        path = os.path.join(os.path.dirname(__file__), 'oneplayer.html')
        self.response.out.write(template.render(path, context))

class TwoPlayer(webapp2.RequestHandler):
    def get(self):
        user = users.get_current_user()
        context = {
            'user':      user,
            'login':     users.create_login_url(self.request.uri),
            'logout':    users.create_logout_url(self.request.uri),
        }
        path = os.path.join(os.path.dirname(__file__), 'twoplayer.html')
        self.response.out.write(template.render(path, context))


class LeaveGame(webapp2.RequestHandler):
    def post(self):
        pass


class NewGame(webapp2.RequestHandler):
    def post(self):
        user = users.get_current_user()
        hand = self.request.POST['hand']
        game = Game()
        game.player1 = user
        game.hand = hand
        game.put()
        token = create_channel(str(game.key().id()) + user.user_id())
        self.response.out.write(simplejson.dumps({'game_id': game.key().id(),
                                                  'token': token}))


        
class FlipCard(webapp.RequestHandler):
    def get(self):
        user = users.get_current_user()
        hand = self.request.GET('hand')
        #update = game.hand
        game = get_game_from_id(update.get('game'))
        key = get_other_player_channel_key(game, user.user_id())
        data = {
                'type':'update', 
                'update': hand
        }
        channel.send_message(key, simplejson.dumps(data))


#mainpage.py
class NetworkPlay(webapp2.RequestHandler):
    def get(self):
        user = users.get_current_user()
        game_id = self.request.get('game')
        token = ''
        other_player = ''
        user = users.get_current_user()
        #logout_url = users.create_logout_url("/")
        game_hand = ''
        if game_id:
            game = Game.get_by_id(int(game_id))
            if game:
                game_hand = game.hand
                if game.may_join(user):
                    token = create_channel(str(game.key().id()) + user.user_id())
                    other_player = game.player1
                    key = get_other_player_channel_key(game, user.user_id())
                    channel.send_message(key, simplejson.dumps({'type':'join', 'user':get_user_dump(user, format='dict')}))
                else:
                    self.redirect('/netplay')
            else:
                self.redirect('/netplay')
        context = {
            'token': token,
            'game_id': game_id,
            'game_hand': game_hand,
            'other_player': other_player,
            'user':      user,
            'user_id': user.user_id(),
            'login':     users.create_login_url(self.request.uri),
            'logout':    users.create_logout_url(self.request.uri),
        }
        tmpl = path.join(path.dirname(__file__), 'netplay.html')
        self.response.write(render(tmpl, context))


#  Setup the Application & Routes
app = webapp2.WSGIApplication([
    ('/', MainHandler),
    ('/oneplayer', OnePlayer),
    ('/twoplayer', TwoPlayer),
    ('/netplay', NetworkPlay),
    ('/netplay/new', NewGame),
    ('/netplay/leave', LeaveGame),
    #('/_ah/connected'), 
    ('/netplay/cardflip', FlipCard)
], debug=True)


