/* eslint-disable no-console */
let noStdin = false;
process.stdin.on("end", function() {
	noStdin = true;
});
process.stdin.on("data", function(data) {
	console.log(data);
});
const path = require("path");
const fs = require("fs");
const writeGitConfig = require("gitconfig");
const readGitConfig = require("git-config");
const deepmerge = require("deepmerge");
console.log(noStdin);
return process.exit(0);
let ynPrompt = require("yn-prompt");


process.stdin.on("data", function(data) {
	console.log(data);
});
process.stdin.on("end", function() {
	console.log("EOF");
});
const homedir = require("os").homedir();
const platform = require("os").platform();

ynPrompt("This operation will overwrite your dotfiles. Continue? (y/n)").then(
	function(yn) {
		if (yn.toUpperCase() !== "Y") {
			return process.exit(0);
		}
		console.log("Using HOME directory:", homedir);

		//ESLINT
		(function() {
			const userConfigFile = path.join(homedir, ".eslintrc.json");
			let userConfig = {};
			if (fs.existsSync(userConfigFile)) {
				userConfig = fs.readFileSync(userConfigFile);
				fs.writeFileSync(
					path.join(homedir, ".eslintrc.json.backup"),
					userConfig,
					{
						flag: "w+"
					}
				);
			}
			const customConfig = fs.readFileSync(
				path.join(__dirname, ".eslintrc.json")
			);
			const newUserConfig = deepmerge(userConfig, customConfig);
			fs.writeFileSync(userConfigFile, newUserConfig, {
				flag: "w+"
			});
			console.log("Updated ESLINT");
		})();

		//PRETTIER
		(function() {
			let userConfig = path.join(homedir, ".prettierrc");
			if (fs.existsSync(userConfig)) {
				fs.writeFileSync(
					path.join(homedir, ".prettierrc.backup"),
					fs.readFileSync(userConfig),
					{
						flag: "w+"
					}
				);
			}
			fs.writeFileSync(
				userConfig,
				fs.readFileSync(path.join(__dirname, ".prettierrc")),
				{
					flag: "w+"
				}
			);
			console.log("Updated PRETTIER");
		})();

		//VSCODE
		(function() {
			const userConfigFile_Linux = path.join(
				homedir,
				"/.config/Code/settings.json"
			);
			const userConfigFile_OSX = path.join(
				homedir,
				"/Library/Application Support/Code/settings.json"
			);
			const userConfigFile_Win = path.join(
				homedir,
				"/AppData/Roaming/Code/User/settings.json"
			);
			let userConfig = {};
			if (fs.existsSync(userConfigFile_Linux)) {
				userConfig = fs.readFileSync(userConfigFile_Linux);
				fs.writeFileSync(userConfigFile_Linux + ".backup", userConfig, {
					flag: "w+"
				});
			} else if (fs.existsSync(userConfigFile_OSX)) {
				userConfig = fs.readFileSync(userConfigFile_OSX);
				fs.writeFileSync(userConfigFile_OSX + ".backup", userConfig, {
					flag: "w+"
				});
			} else if (fs.existsSync(userConfigFile_Win)) {
				userConfig = fs.readFileSync(userConfigFile_Win);
				fs.writeFileSync(userConfigFile_Win + ".backup", userConfig, {
					flag: "w+"
				});
			}
			const customConfig = fs.readFileSync(
				path.join(__dirname, ".eslintrc.json")
			);
			const newUserConfig = deepmerge(userConfig, customConfig);
			switch (platform) {
				case "win32":
					fs.writeFileSync(userConfigFile_Win, newUserConfig, {
						flag: "w+"
					});
					break;
				case "linux":
					fs.writeFileSync(userConfigFile_Linux, newUserConfig, {
						flag: "w+"
					});
					break;
				case "darwin":
					fs.writeFileSync(userConfigFile_OSX, newUserConfig, {
						flag: "w+"
					});
					break;
			}
			console.log("Updated VSCode");
		})();

		//GITCONFIG
		(function() {
			let userConfig = path.join(homedir, ".gitconfig");
			if (fs.existsSync(userConfig)) {
				fs.writeFileSync(
					path.join(homedir, ".gitconfig.backup"),
					fs.readFileSync(userConfig),
					{
						flag: "w+"
					}
				);
			}

			let trimObj = function(obj) {
				if (!Array.isArray(obj) && typeof obj !== "object") {
					return obj;
				}
				return Object.keys(obj).reduce(
					function(acc, key) {
						// eslint-disable-next-line no-param-reassign
						acc[
							key
								.replace(" ", ".")
								.replace('"', "")
								.replace('"', "")
						] =
							typeof obj[key] === "string"
								? obj[key].trim()
								: trimObj(obj[key]);
						return acc;
					},
					Array.isArray(obj) ? [] : {}
				);
			};

			const userGit = readGitConfig.sync();
			const customGit = readGitConfig.sync(path.join(__dirname, ".gitconfig"));
			const newGit = deepmerge(userGit, customGit);
			writeGitConfig
				.set(trimObj(newGit), {
					location: "global"
				})
				.then(function() {
					console.log("Updated GITCONFIG");
					process.exit(0);
				});
		})();
	}
);
