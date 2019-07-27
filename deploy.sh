#!/usr/bin/env bash

rm -r ./static || true && \
  cd full \
  npm run build && \
  mv ./build/** ../
