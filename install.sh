#!/bin/sh

if [ -f $HOME/.eslintrc ]; then
    printf "Found existing .eslintrc, moving it to .eslintrc.backup\n"
    mv $HOME/.eslintrc $HOME/.eslintrc.backup
fi
wget https://raw.githubusercontent.com/LincWorld/dot-files/master/.eslintrc 2>/dev/null || curl -O https://raw.githubusercontent.com/LincWorld/dot-files/master/.eslintrc

if [ -f $HOME/.prettierrc ]; then
    printf "Found existing .prettierrc, moving it to .prettierrc.backup\n"
    mv $HOME/.prettierrc $HOME/.prettierrc.backup
fi
wget https://raw.githubusercontent.com/LincWorld/dot-files/master/.prettierrc 2>/dev/null || curl -O https://raw.githubusercontent.com/LincWorld/dot-files/master/.prettierrc

if [ -f $HOME/.gitconfig ]; then
    printf "Found existing .gitconfig, moving it to .gitconfig.backup\n"
    mv $HOME/.gitconfig $HOME/.gitconfig.backup
fi
wget https://raw.githubusercontent.com/LincWorld/dot-files/master/.gitconfig 2>/dev/null || curl -O https://raw.githubusercontent.com/LincWorld/dot-files/master/.gitconfig

if [ -f $HOME/.npmrc ]; then
    printf "Found existing .npmrc, moving it to .npmrc.backup\n"
    mv $HOME/.npmrc $HOME/.npmrc.backup
fi
wget https://raw.githubusercontent.com/LincWorld/dot-files/master/.npmrc 2>/dev/null || curl -O https://raw.githubusercontent.com/LincWorld/dot-files/master/.npmrc
