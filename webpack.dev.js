const path = require('path');
const Dotenv = require('dotenv-webpack');
const htmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin"); // для копирования файлов
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // для вынесения в отдельный файл css
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin'); // минифицирует css
const TerserPlugin = require('terser-webpack-plugin'); // минификация js
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
	mode: "development", // девелопмент мод
	devtool: "source-map", // мапа для JS,css
	optimization: {
		minimize: false, // если комп позволяет, то true и будет минифицировать все что в minimizer(js,css,png,jpg,gif,svg + webp и делать конвертацию)
		splitChunks: {
			chunks: "all",
			minSize: 1,
			minChunks: 2,
			name: (module, chunks, cacheGroupKey) => {
				const allChunksNames = chunks.map((chunk) => chunk.name).join('-');
				return allChunksNames;
			},
		},
		minimizer: [

			new TerserPlugin({// плагин минификации js
				extractComments: true, // удаляет комменты
				// minify: TerserPlugin.uglifyJsMinify,
				// terserOptions: {},
			}),
			new CssMinimizerPlugin(), // минифицирует css
			new ImageMinimizerPlugin({ // оптимизация картинок svg,jpg,png,gif, svg
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
	// entry: {
	// 	filename: './src/js/index.js', // можно указать как несколько точек входа
	// },
	entry: entryPoints(),
	output: { // куда перекидываем скомбинированный файл
		filename: './js/[name].js', // указываем то что файлу из entry index даем название index
		path: path.resolve(__dirname, 'dist'), // в какую папку перебрасываем
		clean: true, // отчистка папки
		assetModuleFilename: './assets/[name][ext]' // если в JS файле будет импорт изображения, то он вставится в dist с таким названием
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
		// При разработке будет каждый раз переписывать файлы в папку /dist
		// Будет грузить жесткий диск, если слабый ПК, то можно включить
		// devMiddleware: {
		// 	writeToDisk: true,
		// },
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
				test: /\.(png|svg|jpg|jpeg|gif, webp)$/i,
				type: 'asset/resource'
			}, // если в JS файле будет импорт изображения, то он вставится в dist
		]
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: './css/[name].css', // вытаскивает css в отдельный файл
		}),
		...multipleHtmlPlugins,
		// new htmlWebpackPlugin({
		// 	minify: false, // не будет сжимать html файл
		// 	template: './src/index.html', // возьмет за основу
		// 	inject: 'body', // отключит авто подключение js файла, true/head/body/false куда вставлять js,
		// 	hash: true, // добавляет автохеш для css and js, во избежания кеширования
		// }),
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
		new Dotenv()// юзает файл .env
	],
};

