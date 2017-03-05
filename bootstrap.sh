#!/usr/bin/env bash

echo "updating"
apt-get update

echo "install node"
curl --silent --location https://deb.nodesource.com/setup_4.x | sudo bash -
apt-get install --yes nodejs
apt-get install --yes --silent liquidsoap
apt-get install --yes --silent icecast2

echo "install npm tools"
apt-get install --yes build-essential

echo "configure and update npm"
npm install npm -g
mkdir /home/vagrant/npm-global
npm config set prefix '/home/vagrant/npm-global'
sudo NPM_CONFIG_PREFIX=/home/vagrant/npm-global npm install gulp node-gyp nodemon forever -g
echo 'export PATH="$PATH:/home/vagrant/npm-global/bin"' >> /home/vagrant/.profile
source /home/vagrant/.profile
echo "finished"
# npm install -g --no-bin-links gulp nodemon forever node-gyp
# cd /vagrant/web
# npm install --no-bin-links