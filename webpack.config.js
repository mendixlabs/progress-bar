const webpack = require("webpack");
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const widgetConfig = {
    entry: "./src/components/ProgressBarContainer.ts",
    output: {
        path: path.resolve(__dirname, "dist/tmp"),
        filename: "src/com/mendix/widget/custom/progressbar/ProgressBar.js",
        libraryTarget: "umd"
    },
    resolve: {
        extensions: [ ".ts", ".js", ".json" ],
        alias: {
            "tests": path.resolve(__dirname, "./tests")
        }
    },
    module: {
        rules: [
            { test: /\.ts$/, loader: "ts-loader" },
            { test: /\.css$/, loader: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: "css-loader"
            }) },
            { test: /\.scss$/, loader: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: [
                    { loader: "css-loader" },
                    { loader: "sass-loader" }
                ]
            }) }
        ]
    },
    mode: "development",
    devtool: "source-map",
    externals: [ "react", "react-dom" ],
    plugins: [
        new CopyWebpackPlugin([
            { from: "src/**/*.js" },
            { from: "src/**/*.xml" }
        ], {
            copyUnmodified: true
        }),
        new ExtractTextPlugin({ filename: "./src/com/mendix/widget/custom/progressbar/ui/ProgressBar.css" }),
        new webpack.LoaderOptionsPlugin({ debug: true })
    ]
};

const previewConfig = {
    entry: "./src/ProgressBar.webmodeler.ts",
    output: {
        path: path.resolve(__dirname, "dist/tmp"),
        filename: "src/ProgressBar.webmodeler.js",
        libraryTarget: "commonjs"
    },
    resolve: {
        extensions: [ ".ts", ".js" ]
    },
    module: {
        rules: [
            { test: /\.ts$/, use: "ts-loader" },
            { test: /\.css$/, use: "raw-loader" },
            { test: /\.scss$/, use: [
                    { loader: "raw-loader" },
                    { loader: "sass-loader" }
                ]
            }
        ]
    },
    mode: "development",
    devtool: "inline-source-map",
    externals: [ "react", "react-dom" ],
    plugins: [
        new webpack.LoaderOptionsPlugin({ debug: true })
    ]
};

module.exports = [ widgetConfig, previewConfig ];
