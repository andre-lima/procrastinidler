# Game Design Document of Procrastinidler

## Introduction

You play as a guy tired of the 9 to 5 grind but stuck in the work life.

## Theme

The game has a darker theme, with UI based on 386/DOS menus.

## Game Modes

There are 2 game modes. Regular and Idle.

At the beginning of the game the player is presented with a dialog box asking to choose between 2 modes.

xxxxxxxxxx
Welcome to Procrastinidler 386. Please install the program you want to run:

"If I don't do this job, I'll sleep in the gutter"

- In this mode you have to pay rent, and is constantly risking burning out from stress

"I have a rich daddy, don't "

- In this mode you have your rich daddy as a fallback if things don't work out... do whatever you want
- (Disabled on the demo)
  xxxxxxxxxx

## Game Loop

Your work is to complete tasks that are create on a To-Do board. Every task completed gives the player money, which they can use to buy upgrades, hire assistants, etc, and make more money from each task completed and complete tasks faster.

There's a FREEDOM button, teasing the player, but it costs 10M to purchase.

The player risks burnouts, which will pause the game, and set them back for a while.

The game will have different phases, where the player will climb the corporate ladder, the game play changes, adding more features.

I'm aiming for a 2h to 3h time to beat the whole game. DON'T FEATURE CREEP THIS TIME!

### Idle Mode ("I have a rich daddy" mode)

Instead of having to pay rent and risk burnout, the player can choose to prestige whenever they like.

The retire button turns into "Take a Sabbatical", where they'll be brought to the same mini-games as in the regular mode.

## Requirements

- Aim for gamepad support so it can be played on the Steam Deck
- Cloud Saves
- Achievements

## External Contributors

Ana: Capsule arts

## Release Plan

Short itch demo -> End of April
Steam playtest -> End of may
Steam and Itch demo -> End of June
SNF -> October
Release -> December

## Features Breakdown

### Currencies

Regular dollars, to pay for upgrades

RAM, prestige currency. Gathered during prestige mini-games. Used to purchase special upgrades that makes the game easier.

Conversion: Some upgrades will allow you to buy money with RAM or RAM with money (money sink)

### Task

#### Dificulty

The difficulty level determines how many clicks is needed to complete it. Still to be defined, but a variable can control this. For example, difficulty 1 takes 2 clicks to complete. difficulty 2, takes 4 clicks, etc.

Tasks also have types: Work, Education, Financial, Leisure, etc.

#### Deadline (maybe)

Some tasks have a deadlinee to be completed.

#### Reviews

Some tasks requires being reviewed before being deemed completed. This review is done by the Boss.

### Assistants

They have experience levels: Intern to Expert. The higher the experience level, the faster they can complete tasks. For example, it takes 5 ticks to complete a difficulty 1 tasks for the Intern.

Assistants assigns themselves to tasks that matches their skill types.

They can be purchased, per skill type, and then upgraded to perform tasks faster, or add new skills.

### Boss

The boss will automatically create tasks for you in a certain interval.

He'll also review tasks.

Eventually, he'll turn out to be a monster

### Phases

Every time you get back from a burnout, you get currency to get something special (TBD), and also a modifier that makes the game more difficult

Requires renting an office

Requires review

Requires uploading work (WFH)

Mandatory fun

### Upgrades

### Rent Timer

A progress bar that lowers continuously. When at 0, the player has its rent amount deducted from the currency meter. If money is at 0 or below, the Burnout meter starts to rise.

### Burnout meter

When work is piling up, the burnout meter starts to grow. The player has to complete the tasks faster to make the meter lower.

When at 100%, the player loses and has to touch grass or play a minigame to recover and get a special currency.

Burning out works as a prestige. Next run, the player can purchase resiliency with the special currency.

An upgrade can make the burnout slowly reduce, but initially it never goes down.

### Boosts/Events

Coming back from a burnout, choose or purchase modifiers for the next run.

Coffee/boost

## Main Game

### First Round

Add tasks manually
Click on tasks
Use upgrades to increase money rewarded by tasks, speed of completion

### Second Round

After the first burnout the player can purchase an assistant. The assistant helps you complete tasks.

### Third Round

After the second burnout the player can purchase a boss or more assistants.

The boss will create tasks automatically.

### Following Rounds

With upgrades to make the tasks more rewarding, now the game becomes a resource management game.

Get more assistants and boss upgrades so you can get more money

...

## Mini Games

Printer

Grass
