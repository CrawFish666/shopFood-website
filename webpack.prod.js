const path = require('path');
const Dotenv = require('dotenv-webpack');
const htmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // для вынесения в отдельный файл css
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin'); // минифицирует css
const TerserPlugin = require('terser-webpack-plugin'); // минификация js
const UnminifiedWebpackPlugin = require('unminified-webpack-plugin'); // позволит сделать и не минифицированную версию js/css
const CopyPlugin = require("copy-webpack-plugin"); // для копирования файлов
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin"); // для оптимизацияя gif,jpg,png,svg
const ImageminWebpWebpackPlugin = require("imagemin-webp-webpack-plugin"); // оптимизация webp и конвертация в webp
const fs = require('fs');

const walkSync = require("walk-sync");

const srcfolderPath = "./src/"
const pages = walkSync(srcfolderPath, { globs: ["**/*.html"] });



// поиск в папке всех .html файлов и подключает к ним JS, css файлы и они будут по названию html файла
const multipleHtmlPlugins = pages.map((name) => {
	// console.log(`${srcfolderPath}zzz${name}`);
	const filename = path.basename(
		path.resolve(__dirname, `${srcfolderPath}${name}`)
	);
	// console.log(filename);
	// console.log(`dfasdasda ${name.slice(0, name.indexOf('.'))}`);
	return new htmlWebpackPlugin({
		template: `${srcfolderPath}${name}`,
		filename,
		minify: false,
		inject: 'body',
		hash: true,
		chunks: [`${name.slice(0, name.indexOf('.'))}`],
	});
});

const customEntryPoints = [
	// { filename: './src/js/index.js' },
	// {filename like index: 'path to index.js'}

]

// все входные точки будут по названию html файлов
const entryPoints = function () {
	const entryes = pages.map((name, index, array) => {
		const filename = path.basename(
			path.resolve(__dirname, `${srcfolderPath}${name}`)
		);
		return {
			[name.slice(0, name.indexOf('.'))]: srcfolderPath + 'js/' + name.slice(0, name.indexOf('.')) + '.js'
		}

	});
	return entryes[0] = Object.assign(...entryes, ...customEntryPoints)
}




module.exports = {

	mode: "production", // продакшен мод

	// entry: {
	// 	// index: './src/js/index.js', // можно указать как несколько точек входа
	// 	// home: './src/js/home.js',
	// 	// ...entryPoints
	// 	// entryPoints()
	// },
	entry: entryPoints(),

	output: { // куда перекидываем скомбинированный файл
		filename: './js/[name].min.js', // указываем то что файлу из entry filename даем название filename
		path: path.resolve(__dirname, 'dist'), // в какую папку перебрасываем
		clean: true, // отчистка папки,
		assetModuleFilename: './assets/[name][ext]' // если в JS файле будет импорт изображения, то он вставится в dist с таким названием

	},
	optimization: {
		splitChunks: {
			chunks: "all",
			minSize: 1,
			minChunks: 2,
			name: (module, chunks, cacheGroupKey) => {
				const allChunksNames = chunks.map((chunk) => chunk.name).join('-');
				return allChunksNames;
			},
		},

		minimize: true, // минификация js файла,
		minimizer: [
			new TerserPlugin({// плагин минификации js
				extractComments: true, // удаляет комменты
				// minify: TerserPlugin.uglifyJsMinify,
				// terserOptions: {},
			}),
			new CssMinimizerPlugin(), // минифицирует css
			new ImageMinimizerPlugin({
				minimizer: {
					implementation: ImageMinimizerPlugin.imageminMinify,
					options: {
						plugins: [
							["gifsicle", { interlaced: true }], // оптимизация gif
							["imagemin-mozjpeg", { quality: 75, progressive: true }], // оптимизация jpg
							["imagemin-pngquant", { quality: [0.65, 0.75] }], // оптимизация png
							["svgo", { removeViewBox: false }], // оптимизация svg, мб багается
						]
					}
				},

			}),
			new ImageminWebpWebpackPlugin({
				// config: [{
				// 	test: /\.(jpe?g|png)/,
				// 	options: {
				// 		quality: 70
				// 	}
				// }],
				// overrideExtension: true,
				// detailedLogs: false,
				// silent: false,
				// strict: true
			}), // параллельно берет исходники картинок, оптимизирует и делает webp
		],
	},
	// devtool: "source-map", // делает мапу css/js
	module: { // указываем правила для подключения модулей
		rules: [
			{
				test: /\.(scss|css)$/, // выбираем какие файлы проверяем
				use: [MiniCssExtractPlugin.loader, // позволяет вытащить css файл отдельно и подключить его через js import
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
				test: /\.(png|svg|jpg|jpeg|gif,webp)$/i,
				type: 'asset/resource'
			}, // если в JS файле будет импорт изображения, то он вставится в dist

		]
	},
	plugins: [ // плагины позволяют обрабатывать файлы, которые не импортируются через JS
		new UnminifiedWebpackPlugin(), // сделает и не минифицированную версию js,css
		new MiniCssExtractPlugin({
			filename: './css/[name].min.css', // вытаскивает css в отдельный файл, и подключить его через js import и он автоматом добавится в html
		}),
		new Dotenv(), // юзает файл .env
		// new htmlWebpackPlugin({
		// 	minify: false, // не будет сжимать html файл
		// 	template: './src/index.html', // возьмет за основу
		// 	inject: 'body', // отключит авто подключение js файла, true/head/body/false куда вставлять js,
		// 	hash: true, // добавляет автохеш для css and js, во избежания кеширования
		// }),
		...multipleHtmlPlugins,
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


// функция мультистраничного сайта, у каждого html будут разные css and js

// result.entry = {
// 	'main': path.join(__dirname, '../src/main.js'),
// 	'articles': path.join(__dirname, '../src/articles.js'),
// 	'users': path.join(__dirname, '../src/users.js'),
// }

// result.pages = [
// 	{ chunks: ['main'], page: 'index.html', template: path.join(__dirname, '../src/index.html'), },
// 	{ chunks: ['users'], page: 'pages/users.html', template: path.join(__dirname, '../pages/users.html') },
// 	{ chunks: ['articles'], page: 'pages/articles.html', template: path.join(__dirname, '../pages/articles.html') },
// 	{ chunks: ['articles'], page: 'pages/articles/articles1.html', template: path.join(__dirname, '../pages/articles/articles1.html') },
// 	{ chunks: ['articles'], page: 'pages/articles/articles2.html', template: path.join(__dirname, '../pages/articles/articles2.html') },
// 	{ chunks: ['articles'], page: 'pages/articles/articles3.html', template: path.join(__dirname, '../pages/articles/articles3.html') },
// 	{ chunks: ['articles'], page: 'pages/articles/articles4.html', template: path.join(__dirname, '../pages/articles/articles4.html') },
// 	{ chunks: ['articles'], page: 'pages/articles/articles5.html', template: path.join(__dirname, '../pages/articles/articles5.html') },
// ]

// const srcfolderPath = "./src/";
// const pages = fs.readdirSync(srcfolderPath)
// 	.map((filename) => filename)
// 	.filter((filename) => filename.includes(".html"));
// const multipleHtmlPlugins = pages.map((name) => {
// 	// const filename = path.basename(
// 	// 	path.resolve(__dirname, `${srcfolderPath}${name}`)
// 	// );
// 	return new htmlWebpackPlugin({
// 		template: `${srcfolderPath}${name}`,
// 		minify: false,
// 		inject: 'body',
// 		hash: true,
// 	});
// });
// console.log(pages);
/*

		new htmlWebpackPlugin({
			minify: false, // не будет сжимать html файл
			template: './src/index.html', // возьмет за основу
			inject: 'body', // отключит авто подключение js файла, true/head/body/false куда вставлять js,
			hash: true, // добавляет автохеш для css and js, во избежания кеширования
		}),
*/