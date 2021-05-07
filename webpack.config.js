const path = require("path");
module.exports = {
    entry: './src/index.tsx',
    output: {
        filename: "index.js",
        path: path.resolve(__dirname, "public/js/"),
    },

    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    }
}