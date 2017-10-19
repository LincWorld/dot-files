const path = require('path');
const fs = require('fs');
const writeGitConfig = require('gitconfig');
const readGitConfig = require('git-config');
const deepmerge = require('deepmerge');
const ynPrompt = require('yn-prompt');

const homedir = require('os').homedir();

ynPrompt("This operation will overwrite your dotfiles. Continue? (y/n)").then(function(yn) {

	if (yn.toUpperCase() == 'N') {
		return process.exit(0);
	}
	console.log("Using HOME directory:", homedir);

	//ESLINT
	(function() {
		let userConfig = path.join(homedir, '.eslintrc');
		if (fs.existsSync(userConfig)) {
			fs.writeFileSync(path.join(homedir, '.eslintrc.backup'), fs.readFileSync(userConfig), {
				flag: 'w+'
			});
		}
		fs.writeFileSync(userConfig, fs.readFileSync(path.join(__dirname, '.eslintrc')), {
			flag: 'w+'
		});
		console.log('Updated ESLINT');
	}());

	//JSBEAUTIFY
	(function() {
		let userConfig = path.join(homedir, '.jsbeautifyrc');
		if (fs.existsSync(userConfig)) {
			fs.writeFileSync(path.join(homedir, '.jsbeautifyrc.backup'), fs.readFileSync(userConfig), {
				flag: 'w+'
			});
		}
		fs.writeFileSync(userConfig, fs.readFileSync(path.join(__dirname, '.jsbeautifyrc')), {
			flag: 'w+'
		});
		console.log('Updated JSBEAUTIFY');
	}());

	//GITCONFIG
	(function() {
		let userConfig = path.join(homedir, '.gitconfig');
		if (fs.existsSync(userConfig)) {
			fs.writeFileSync(path.join(homedir, '.gitconfig.backup'), fs.readFileSync(userConfig), {
				flag: 'w+'
			});
		}

		let trimObj = function(obj) {
			if (!Array.isArray(obj) && typeof obj != 'object') {
				return obj;
			}
			return Object.keys(obj).reduce(function(acc, key) {
				acc[key.replace(" ", ".").replace("\"", "").replace("\"", "")] = typeof obj[key] == 'string' ? obj[key].trim() : trimObj(obj[key]);
				return acc;
			}, Array.isArray(obj) ? [] : {});
		}

		const userGit = readGitConfig.sync();
		const customGit = readGitConfig.sync(path.join(__dirname, '.gitconfig'));
		const newGit = deepmerge(userGit, customGit);
		writeGitConfig.set(trimObj(newGit), {
			location: 'global'
		}).then(function() {
			console.log("Updated GITCONFIG");
			process.exit(0);
		});
	}());
});
