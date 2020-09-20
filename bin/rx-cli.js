#!/usr/bin/env node
const figlet = require('figlet');
const versionStr = figlet.textSync('yehj');
const Printer = require('@darkobits/lolcatjs');
const {program} = require('commander');
const chalk = require('chalk');
const json2ts = require('json2ts'); // json字符串转换成ts代码
const inquirer = require('inquirer');
const shell = require('shelljs');
const ora = require('ora');
const download  = require('download-git-repo');
const clone = require('git-clone');
const _version = require('../package.json').version;
const input = `脚手架版本：${_version}\n${versionStr}`;
const transformed = Printer.default.fromString(input);

program.version(transformed);
program.option(
	'-c, --create', '初始化项目'
);
const dictionary = {
	create(env){
		inquirer
		.prompt(
			[{
				type: 'text',
				message: '请输入文件件名称：',
				name: 'dirname'
			}, 
			{
				type: 'text',
				message: '请输入用户名：',
				name: 'usename'
			}, {
				type: 'text',
				message: '请输入密码：',
				name: 'password'
			}, {
				type: 'list',
				name: 'projectlist',
				message: '请选择需要初始化的子项目',
				choices: ['a', 'b', 'c']
				
			}]
		).then((answers) => {
			const _pwd = shell.pwd().stdout;
			const projectPath = `${_pwd}/${answers.dirname}/cd`
			shell.rm('-rf', projectPath)
			shell.mkdir(projectPath);
			shell.cp('-R', projectPath, _pwd);
			console.log(answers, _pwd)
			const spinner = ora('downloading......');
			spinner.start();
			const template = 'direct:https://github.com/PanJiaChen/vue-element-admin.git';
			download(template, projectPath, {clone:true}, function(err){
				spinner.stop();
				if (err) {
					console.log('项目初始化失败', err);
				} else {
					shell.sed('-i', 'cascader', answers.dirname, projectPath + '/package.json');
				}
			});
		}).catch((error) => {
			console.log(error)
		})
	}
}
program.usage('[cmd] <options>')
.arguments('[cmd] <env> <env1> <env2>')
.action(function(cmd, env, env1, env2) {
	console.log(cmd, env, env1, env2)
	const handler = dictionary[cmd]
	if (handler) {
		handler(env)
	} else {
		console.log(`${chalk.green(cmd)}${ chalk.red('暂不支持')}`)
	}
})

program.parse(process.argv);

