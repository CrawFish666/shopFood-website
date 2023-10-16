const path = require('path');
const Dotenv = require('dotenv-webpack');
const htmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // для вынесения в отдельный файл css
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin'); // минифицирует css
const TerserPlugin = require('terser-webpack-plugin'); // минификация js
const UnminifiedWebpackPlugin = require('unminified-webpack-plugin'); // позволит сделать и не минифицированную версию js/css
const CopyPlugin = require("copy-webpack-plugin"); // для копирования файлов


module.exports = {
	mode: "production", // продакшен мод
	entry: {
		filename: './src/js/index.js', // можно указать как несколько точек входа
	},
	output: { // куда перекидываем скомбинированный файл
		filename: './js/index.min.js', // указываем то что файлу из entry filename даем название filename
		path: path.resolve(__dirname, 'dist'), // в какую папку перебрасываем
		clean: true, // отчистка папки,
		assetModuleFilename: './assets/[name][ext]' // если в JS файле будет импорт изображения, то он вставится в dist с таким названием

	},
	optimization: {
		minimize: true, // минификация js файла,
		minimizer: [
			new TerserPlugin({
				extractComments: true,
			}),
			new CssMinimizerPlugin(), // минифицирует css
		],
	},
	devtool: "source-map", // делает мапу css/js
	module: { // указываем правила для подключения модулей
		rules: [
			{
				test: /\.(scss|css)$/, // выбираем какие файлы проверяем
				use: [MiniCssExtractPlugin.loader, // позволяет вытащить css файл отдельно и подключить его
				{
					loader: 'css-loader',
					options: {
						url: {
							filter: (url, resourcePath) => {
								if (url.includes("img") || url.includes("fonts")) {
									return false;
								}
								return true;
							}, // запрещаем в css копировать картинки и шрифты через url в папку dist
						},
					}
				},
				{
					loader: 'sass-loader',
					options: {
						sassOptions: {
							outputStyle: "expanded",
						},
					}
				}], // какие библиотеки будем использовать при нахождении файла
				// библиотеки используются справа налево
			},
			{
				test: /\.(png|svg|jpg|jpeg|gif)$/i,
				type: 'asset/resource'
			}, // если в JS файле будет импорт изображения, то он вставится в dist

		]
	},
	plugins: [
		new UnminifiedWebpackPlugin(), // сделает и не минифицированную версию js,css
		new MiniCssExtractPlugin({
			filename: './css/style.min.css', // вытаскивает css в отдельный файл
		}),
		new Dotenv(),
		new htmlWebpackPlugin({
			minify: false, // не будет сжимать html файл
			template: './src/index.html', // возьмет за основу
			inject: 'body', // отключит авто подключение js файла, true/head/body/false куда вставлять js,
			hash: true, // добавляет автохеш для css and js, во избежания кеширования
		}),
		new CopyPlugin({
			patterns: [
				{
					from: `src/img`, to: `./img`,
					noErrorOnMissing: true
				}, // копирование всех картинок
				{
					from: `src/fonts`, to: `./fonts`,
					noErrorOnMissing: true
				}, // копирование всех шрифтов
			],
		})
	],
};


