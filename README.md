ERLANG QUEST
============

Erlang Quest is a small game in which you solve Erlang programming
tasks, beginning with very simple stuff.

Erlang Quest is a way to practise Erlang -- writing and problem
solving in Erlang.

It does not include tutorials in the syntax etc. of Erlang -- there
are plenty of introductory material freely available on the internet
([1][], [2][], [3][]) Nor does it do much in the way of teaching the
standard libraries ([4][] [5][]), expect for giving hints about how
tasks can be solved (the hint system is not there yet, though).
However, it can be used for practising, to learn how to use the
standard libraries in practical problem solving.

How to use
----------

The Quest game can be played in two ways: you can play it by yourself,
or it can be played by many player at once, each trying to solve the
problems and gain points.

The latter can be used as part of for course-like settings; each
participant can then progress in their own pace.

In either case, a Quest server is started, the player(s) connect to
it, pick a user name, and the game can begin.

The short version is:

    Server:
      MY_IP=... make start-server
    Player:
      MY_IP=... SERVER_IP=... make start-client
      > quest:help().

See below for the longer version.


How to set up the server
------------------------

The steps are as follows (assuming you have Erlang and Git installed):

- Obtain the ErlangQuest source code:
    git clone git://github.com/eriksoe/ErlangQuest.git
    cd ErlangQuest/
- Build it:
    make
- Start the server:
    make start-server
  or, for playing from other computers in the network:
    MY_IP=insert-your-IP-address-here  make start-server

This will start an Erlang node with the quest server running, and also
with an Erlang interactive shell.


How to connect
--------------

For single-player use, you can use the Erlang shell of the node where
the server is also running.

For playing from another computer,do:

    MY_IP=insert-your-IP SERVER_IP=insert-server-IP  make start-client

Alternatively, start an Erlang shell of your own with the parameters
     -name somename@insert-your-IP -setcookie questcookie

then connect to the server nodes thus:
    net_adm:ping('quests@insert-the-server-IP').

How to play
-----------

As a player, the most important command to know is

    > quest:help().

which does a bit of explaining.

Basically, what you do is

    > quest:list(usr).

(if your username is usr) to see what quests are available to you.
There may be more quests, but hidden from you until you gain enough
points.

Next, you ask for a description of a quest (here the one called
'any_answer'):

    > quest:describe_quest(any_answer).
    =>
    Quest 'any_answer':                            (Worth: 1.  Requires: 0.)
      Answer with any value whatsoever.

    ok

This shows what the quest is about, as well as how many points can be
gained by solving it (here 1), and how many points you need to have
already for the quest to be available to you (here 0).

You can accept a quest in two ways.  For solving it manually, do this:

    > quest:get_challenge(usr, any_answer).
    => {15776378160770091960,dummy}

There are two elements here: a challenge ID and an input -- the input
usually contains the data necessary to solve the quest, but is for
this particular quest just a dummy value.

You then answer by:

    > quest:answer_challenge(15776378160770091960, any_value).
    => {achievement_unlocked, ...}

The second way of accepting a quest combines these two steps -- of
getting and answering a challenge.  It involves passing a function
which solves the quest to 'quest:submit/2', like this:

    > quest:submit(usr, any_answer, fun(_Input) -> any_value end).
    => {achievement_unlocked, ...}

Have fun!


Technical stuff
---------------

Only the "quest" module is needed by the players.  For multi-player
use, it is sufficient to distribute that module, as well as an easy
way to start a client node (like the "start-client" Makefile target).

----------
[1]: http://www.erlang.org/doc/getting_started/users_guide.html
[2]: http://learnyousomeerlang.com/
[3]: http://www.erlang.org/course/course.html

[4]: http://erldocs.com/
[5]: http://www.erlang.org/erldoc
