#!/bin/sh
export NODE_ENV=production
export MONGODB_URL=mongodb://localhost:27017/kytone
export STORAGE_PATH=/home/curator/storage
export MPD_PORT=15601
export API_URL=localhost:15002/api/
export INITDB=1

node server/server.js
exit