const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const host = "localhost";

module.exports = function (env, argv) {
	const mode = argv.mode || "development";
	return {
		mode: mode,
		entry: "./src/main.js",
		devtool: 'inline-source-map',
		output: {
			filename: "bundle.js",
			path: path.resolve(__dirname, "docs"),
		},
		module: {
			rules: [{
				test: /.*\.(xml)$/,
				exclude: /node_modules/,
				use: [{
					loader: path.resolve(__dirname, 'webpack/qweb-loader.js')
				}]
			}, {
				test: /\.(jpe?g|png|gif|woff|woff2|eot|ttf|svg)(\?[a-z0-9=.]+)?$/,
				exclude: /node_modules/,
				use: [{
					loader: 'file-loader',
					options: {
						name: '[name].[ext]',
						outputPath: 'img/'
					},
				}
				]
			},
			{
				test: /\.tsx?$/,
				use: 'babel-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.js$/,
				use: ["source-map-loader"],
				exclude: /node_modules/,
				enforce: "pre"
			}, {
				test: /\.css$/,
				use: [
					'style-loader',
					'css-loader'
				]
			}, {
				test: /\.(s[ac]ss)$/,
				use: [{
					loader: 'style-loader'
				}, {
					loader: 'css-loader'
				}, {
					loader: 'postcss-loader',
				}, {
					loader: 'resolve-url-loader'
				}, {
					loader: 'sass-loader',
					options: {
						sourceMap: true,
						additionalData: `@import "${path.resolve(__dirname, './src/variables.scss')}";`,
					},
				}]
			}],
		},
		resolve: {
			extensions: ['.tsx', '.ts', '.js'],
			alias: {
				'@web': path.resolve(__dirname, 'src/'),
			}
		},
		devServer: {
			compress: true,
			hot: true,
			host,
			port: 3000
		},
		plugins: [
			new HtmlWebpackPlugin({
				inject: true,
				template: path.resolve(__dirname, "public/index.html"),
			}),
			new CopyWebpackPlugin({
				patterns: [{
					from: 'public',
					globOptions: {
						ignore: ["**/*.html"],
					}
				}]
			})
		],
	};
};