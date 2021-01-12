#!/usr/bin/env bash

cd minimal && yarn build
cd ../full && yarn build
cd ../atlassian && yarn build
cd ../example-app && yarn deploy
