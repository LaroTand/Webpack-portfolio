const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const CopyPlugin = require("copy-webpack-plugin")
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin")
const TerserPlugin = require("terser-webpack-plugin")
const Dotenv = require("dotenv-webpack")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")

// Aquí irán las configuraciones de webpack
module.exports = {
    entry: "./src/index.js", // Punto de entrada
    output: {
        // Configuraciones de salida
        path: path.resolve(__dirname, "dist"), // Ruta de salida
        filename: "[name].[contenthash].js", // Nombre del archivo de salida
        assetModuleFilename: 'assets/images/[hash][ext][query]' // Ruta de las imagenes
    },
    resolve: {
        // Configuraciones de resolución de dependencias
        extensions: [".js", ".jsx"], // Extensiones que webpack debe reconocer
        alias: {
            // Alias de rutas
            '@utils': path.resolve(__dirname, 'src/utils/'),
            '@templates': path.resolve(__dirname, 'src/templates/'),
            '@styles': path.resolve(__dirname, 'src/styles/'),
            '@images': path.resolve(__dirname, 'src/assets/images/'),
        }
    },

    module: {
        rules: [
            // Configuraciones de carga de archivos
            {
                test: /\.m?js$/, // Expresión regular para buscar archivos mjs o js
                exclude: /node_modules/, // Excluir archivos que no sean de node_modules
                use: {
                    loader: "babel-loader", // Usar el loader de babel
                },
            },
            {
                test: /\.css|.styl$/i, // Expresión regular para buscar archivos css
                use: [MiniCssExtractPlugin.loader, "css-loader", "stylus-loader"], // Usar el loader de css
                
            },
            {
                test: /\.(png|jpg)$/, // Expresión regular para buscar archivos de imágenes
                type: 'asset/resource' 
            },
            {
                test: /\.(woff|woff2)$/, // Expresión regular para buscar archivos de fuentes
                use: {
                    loader: "url-loader", // Usar el loader de url
                    options: {
                        limit: 100000, // Tamaño máximo de archivo
                        mimetype: "application/font-woff", // Tipo de archivo
                        name: "[name].[contenthash].[ext]", // Nombre del archivo
                        outputPath: "./assets/fonts/", // Ruta de salida
                        publicPath: "../assets/fonts/", // Ruta pública
                        esModule: false, // No es un modulo
                    }
                }
            }
        ],
    },
    plugins: [
        // Configuraciones de plugins
        new HtmlWebpackPlugin({
            inject: true, // Inyectar el código de salida en el html
            template: "./public/index.html", // Archivo de plantilla
            filename: "./index.html", // Nombre del archivo de salida
        }),
        new MiniCssExtractPlugin({
            filename: "assets/[name].[contenthash].css", // Nombre del archivo de salida
        }),

        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "src", "assets/images"),
                    to: "assets/images",
                }
            ]
        }),
        new Dotenv(),

        new CleanWebpackPlugin(),

    ],
    optimization: {
        minimize: true,
        minimizer: [
            new CssMinimizerPlugin(),
            new TerserPlugin()
        ]
    }
}


