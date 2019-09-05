#!/usr/bin/env bash
command -v npm >/dev/null 2>&1 || { echo >&2 "node/npm is required, but it's not installed.  Aborting."; exit 1; }
function is_platform(){
  [[ `uname` = "$1" ]] && return 0 || return 1
}
function is_linux(){
  ( is_platform Linux ) && return 0 || return 1
}
function is_mac(){
  ( is_platform Darwin ) && return 0 || return 1
}

function install_firacode(){
	fonts_dir="${HOME}/.local/share/fonts"
	if [ ! -d "${fonts_dir}" ]; then
		echo "mkdir -p $fonts_dir"
		mkdir -p "${fonts_dir}"
	else
		echo "Found fonts dir $fonts_dir"
	fi

	for type in Bold Light Medium Regular Retina; do
		file_path="${HOME}/.local/share/fonts/FiraCode-${type}.ttf"
		file_url="https://github.com/tonsky/FiraCode/blob/master/distr/ttf/FiraCode-${type}.ttf?raw=true"
		if [ ! -e "${file_path}" ]; then
			echo "wget -O $file_path $file_url"
			wget -O "${file_path}" "${file_url}"
		else
		echo "Found existing file $file_path"
		fi;
	done

	echo "fc-cache -f"
	fc-cache -f
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

cd $HOME

install_firacode
install_powerline_fonts
# clone
git clone https://github.com/LincWorld/dot-files --depth=1
# install
cd dot-files
npm run setup
# clean-up a bit
cd ..
rm -rf dot-files
