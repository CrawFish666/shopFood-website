const path = require('path');
const Dotenv = require('dotenv-webpack');
const htmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin"); // для копирования файлов
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // для вынесения в отдельный файл css

module.exports = {
	mode: "development", // девелопмент мод
	devtool: "source-map", //
	optimization: {
		minimize: false
	},
	entry: {
		filename: './src/js/index.js', // можно указать как несколько точек входа
	},
	output: { // куда перекидываем скомбинированный файл
		filename: './js/index.js', // указываем то что файлу из entry index даем название index
		path: path.resolve(__dirname, 'dist'), // в какую папку перебрасываем
		clean: true, // отчистка папки
	},
	// watch: true,
	devServer: {
		client: {
			overlay: true, // показ ошибок в браузере на черном фоне
		},
		port: 8084, // port
		host: 'local-ip', // localhost
		compress: true, // сжимает файлы
		hot: true, // при изменении любого файла в папке dist будет перезагрузка или если другой аутпут указать,
		static: {
			directory: path.join(__dirname, 'dist') // использует файлы из папки dist
		},
		open: true, // открывать вкладку при запуске сервера
		watchFiles: [
			`./src/**/*.html`,
			`./src/img/**/*.*`
		],
	},
	module: { // указываем правила для подключения модулей
		rules: [
			{
				test: /\.(scss|css)$/, // выбираем какие файлы проверяем
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							sourceMap: true,
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
							sourceMap: true,
						}
					}
				], // какие библиотеки будем использовать при нахождении файла
				// библиотеки используются справа налево
			},
			{
				test: /\.(png|svg|jpg|jpeg|gif)$/i,
				type: 'asset/resource'
			}, // если в JS файле будет импорт изображения, то он вставится в dist
		]
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: './css/style.css', // вытаскивает css в отдельный файл
		}),
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
		}),
		new Dotenv()
	],
};


// const path = require('path');
// const Dotenv = require('dotenv-webpack');

// module.exports = {
// 	entry: './src/js/index.js',
// 	output: {
// 		filename: './js/index.js',
// 		path: path.resolve(__dirname, 'dist'),
// 		clean: true, // отчистка папки
// 	},
// 	watch: true,
// 	devtool: "source-map",
// 	devServer: {
// 		port: 8084

// 	},
// 	plugins: [
// 		new Dotenv()
// 	],
// };