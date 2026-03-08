# Game Design Document of Procrastinidler

## Introduction

You play as a guy tired of the 9 to 5 grind but stuck in the work life.

## Theme

The game has a darker theme, with UI based on 386/DOS menus.

## Game Loop

Your work is to complete tasks that are create on a To-Do board. Every task completed gives the player money, which they can use to buy upgrades, hire assistants, etc, and make more money from each task completed and complete tasks faster.

The player risks burnouts, which will pause the game, and set them back for a while.

The game will have different phases, where the player will climb the corporate ladder, the game play changes, adding more features.

I'm aiming for a 2h to 3h time to beat the whole game. DON'T FEATURE CREEP THIS TIME!

## Requirements

- Aim for gamepad support so it can be played on the Steam Deck
- Cloud Saves
- Achievements

## External Contributors

Ana: Capsule arts
other art? Alice?

## Release Plan

Short itch demo -> End of April
Steam playtest -> End of may
Steam demo -> End of June
SNF -> October
Release -> December

## Features Breakdown

### Task

#### Dificulty

The difficulty level determines how many clicks is needed to complete it. Still to be defined, but a variable can control this. For example, difficulty 1 takes 2 clicks to complete. difficulty 2, takes 4 clicks, etc.

Tasks also have types: Work, Education, Financial, Leisure, etc.

#### Deadline

Some tasks have a deadlinee to be completed.

#### Reviews

Some tasks requires being reviewed before being deemed completed. This review is done by the Boss.

### Assistants

They have experience levels: Intern to Expert. The higher the experience level, the faster they can complete tasks. For example, it takes 5 ticks to complete a difficulty 1 tasks for the Intern.

Assistants assigns themselves to tasks that matches their skill types.

They can be purchased, per skill type, and then upgraded to perform tasks faster, or add new skills.

### Boss

### Upgrades

### Rent Timer

A progress bar that lowers continuously. When at 0, the player has its rent amount deducted from the currency meter. If money is at 0 or below, the Burnout meter starts to rise.

### Burnout meter

When work is piling up, the burnout meter starts to grow. The player has to complete the tasks faster to make the meter lower.

When at 100%, the player loses and has to touch grass or play a minigame to recover and get a special currency.

Burning out works as a prestige. Next run, the player can purchase resiliency with the special currency.

### Boosts/Events

Coffee/boost

## Main Game

### First Phase

Player can add tasks to the todo list. Then click them to complete them.

### Second Phase

...

## Mini Games

Printer

Grass
