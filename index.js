/* eslint-disable no-console */
const path = require("path");
const fs = require("fs");
const writeGitConfig = require("gitconfig");
const readGitConfig = require("git-config");
const deepmerge = require("deepmerge");
let ynPrompt = require("yn-prompt");
const homedir = require("os").homedir();
const platform = require("os").platform();

ynPrompt("This operation will overwrite your dotfiles. Continue? (y/n)").then(function (yn) {
	if (yn.toUpperCase() !== "Y") {
		return process.exit(0);
	}
	console.log("Using HOME directory:", homedir);

	//ESLINT
	(function () {
		const userConfigFile = path.join(homedir, ".eslintrc.json");
		let userConfig = {};
		if (fs.existsSync(userConfigFile)) {
			userConfig = JSON.parse(fs.readFileSync(userConfigFile, "utf8"));
			fs.writeFileSync(
				path.join(homedir, ".eslintrc.json.backup"),
				JSON.stringify(userConfig, null, "\t"),
				{
					flag: "w+"
				}
			);
		}
		const customConfig = JSON.parse(
			fs.readFileSync(path.join(__dirname, ".eslintrc.json"), "utf8")
		);
		const newUserConfig = deepmerge(userConfig, customConfig);
		fs.writeFileSync(userConfigFile, JSON.stringify(newUserConfig, null, "\t"), {
			flag: "w+"
		});
		console.log("Updated ESLINT");
	})();

	//PRETTIER
	(function () {
		let userConfig = path.join(homedir, ".prettierrc");
		if (fs.existsSync(userConfig)) {
			fs.writeFileSync(path.join(homedir, ".prettierrc.backup"), fs.readFileSync(userConfig), {
				flag: "w+"
			});
		}
		fs.writeFileSync(userConfig, fs.readFileSync(path.join(__dirname, ".prettierrc")), {
			flag: "w+"
		});
		console.log("Updated PRETTIER");
	})();

	//VSCODE
	(function () {
		const userConfigFile_Linux = path.join(homedir, "/.config/Code/User/settings.json");
		const userConfigFile_LinuxAlt = path.join(homedir, "/.config/Code-Insiders/User/settings.json");
		const userConfigFile_OSX = path.join(
			homedir,
			"/Library/Application Support/Code/settings.json"
		);
		const userConfigFile_OSXAlt = path.join(
			homedir,
			"/Library/Application Support/Code-Insiders/settings.json"
		);
		const userConfigFile_Win = path.join(homedir, "/AppData/Roaming/Code/User/settings.json");
		const userConfigFile_WinAlt = path.join(
			homedir,
			"/AppData/Roaming/Code-Insiders/User/settings.json"
		);
		let userConfig = {};
		let activeConfig = "";
		if (fs.existsSync(userConfigFile_Linux)) {
			activeConfig = userConfigFile_Linux;
			userConfig = JSON.parse(fs.readFileSync(userConfigFile_Linux, "utf8"));
			fs.writeFileSync(userConfigFile_Linux + ".backup", JSON.stringify(userConfig, null, "\t"), {
				flag: "w+"
			});
		} else if (fs.existsSync(userConfigFile_LinuxAlt)) {
			activeConfig = userConfigFile_LinuxAlt;
			userConfig = JSON.parse(fs.readFileSync(userConfigFile_LinuxAlt, "utf8"));
			fs.writeFileSync(
				userConfigFile_LinuxAlt + ".backup",
				JSON.stringify(userConfig, null, "\t"),
				{
					flag: "w+"
				}
			);
		} else if (fs.existsSync(userConfigFile_OSX)) {
			activeConfig = userConfigFile_OSX;
			userConfig = JSON.parse(fs.readFileSync(userConfigFile_OSX, "utf8"));
			fs.writeFileSync(userConfigFile_OSX + ".backup", JSON.stringify(userConfig, null, "\t"), {
				flag: "w+"
			});
		} else if (fs.existsSync(userConfigFile_OSXAlt)) {
			activeConfig = userConfigFile_OSXAlt;
			userConfig = JSON.parse(fs.readFileSync(userConfigFile_OSXAlt, "utf8"));
			fs.writeFileSync(userConfigFile_OSXAlt + ".backup", JSON.stringify(userConfig, null, "\t"), {
				flag: "w+"
			});
		} else if (fs.existsSync(userConfigFile_Win)) {
			activeConfig = userConfigFile_Win;
			userConfig = JSON.parse(fs.readFileSync(userConfigFile_Win, "utf8"));
			fs.writeFileSync(userConfigFile_Win + ".backup", JSON.stringify(userConfig, null, "\t"), {
				flag: "w+"
			});
		} else if (fs.existsSync(userConfigFile_WinAlt)) {
			activeConfig = userConfigFile_WinAlt;
			userConfig = JSON.parse(fs.readFileSync(userConfigFile_WinAlt, "utf8"));
			fs.writeFileSync(userConfigFile_WinAlt + ".backup", JSON.stringify(userConfig, null, "\t"), {
				flag: "w+"
			});
		}
		const customConfig = JSON.parse(
			fs.readFileSync(path.join(__dirname, "/vscode/settings.json"), "utf8")
		);
		const newUserConfig = deepmerge(userConfig, customConfig);
		if (activeConfig != "") {
			fs.writeFileSync(activeConfig, JSON.stringify(newUserConfig, null, "\t"), {
				flag: "w+"
			});
		} else
			switch (platform) {
				case "win32":
					fs.mkdirSync(path.join(homedir, "/AppData/Roaming/Code/User/"));
					fs.writeFileSync(userConfigFile_Win, JSON.stringify(newUserConfig, null, "\t"), {
						flag: "w+"
					});
					break;
				case "linux":
					fs.mkdirSync(path.join(homedir, "/.config/Code/User/"));
					fs.writeFileSync(userConfigFile_Linux, JSON.stringify(newUserConfig, null, "\t"), {
						flag: "w+"
					});
					break;
				case "darwin":
					fs.mkdirSync(path.join(homedir, "/Library/Application Support/Code/"));
					fs.writeFileSync(userConfigFile_OSX, JSON.stringify(newUserConfig, null, "\t"), {
						flag: "w+"
					});
					break;
			}
		console.log("Updated VSCode");
	})();

	//GITCONFIG
	(function () {
		let userConfig = path.join(homedir, ".gitconfig");
		if (fs.existsSync(userConfig)) {
			fs.writeFileSync(path.join(homedir, ".gitconfig.backup"), fs.readFileSync(userConfig), {
				flag: "w+"
			});
		}

		let trimObj = function (obj) {
			if (!Array.isArray(obj) && typeof obj !== "object") {
				return obj;
			}
			return Object.keys(obj).reduce(
				function (acc, key) {
					// eslint-disable-next-line no-param-reassign
					acc[key.replace(" ", ".").replace('"', "").replace('"', "")] =
						typeof obj[key] === "string" ? obj[key].trim() : trimObj(obj[key]);
					return acc;
				},
				Array.isArray(obj) ? [] : {}
			);
		};

		const userGit = readGitConfig.sync();
		const customGit = readGitConfig.sync(path.join(__dirname, ".gitconfig"));
		const newGit = deepmerge(userGit, customGit);
		if (platform === "win32") {
			newGit.core = newGit.core || {};
			newGit.core.autocrlf = true;
		}
		writeGitConfig
			.set(trimObj(newGit), {
				location: "global"
			})
			.then(function () {
				console.log("Updated GITCONFIG");
				process.exit(0);
			});
	})();
});
