#!/usr/bin/env bash
cd $HOME
function is_platform(){
  [[ `uname` = "$1" ]] && return 0 || return 1
}
function is_linux(){
  ( is_platform Linux ) && return 0 || return 1
}
function is_mac(){
  ( is_platform Darwin ) && return 0 || return 1
}

function install_powerline_fonts(){
	# clone
	git clone https://github.com/powerline/fonts.git --depth=1
	# install
	cd fonts
	./install.sh
	# clean-up a bit
	cd ..
	rm -rf fonts
}

function install_vscode(){
	local vscode_path

	if( is_linux ); then
	vscode_path="$HOME/.config/Code"
	elif( is_mac ); then
	vscode_path="$HOME/Library/Application Support/Code"
	else
	error "Can't detect your platform. This support *Linux* and *Mac* only"
	exit
	fi;


	mkdir -p "$vscode_path/User"
	cd "$vscode_path/User";
	if [ -f settings.json ]; then
		printf "Found existing VSCode settings, moving it to settings.json.backup\n"
		mv settings.json settings.json.backup
	fi
	wget https://raw.githubusercontent.com/LincWorld/dot-files/master/vscode/settings.json 2>/dev/null || curl -O https://raw.githubusercontent.com/LincWorld/dot-files/master/vscode/settings.json 
	
	cd $HOME

	install_powerline_fonts
}


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

install_vscode
