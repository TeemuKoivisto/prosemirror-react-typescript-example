#!/usr/bin/env bash

cd full \
  rm -r ../static || true && \
  npm run build && \
  mv ./build/** ../
