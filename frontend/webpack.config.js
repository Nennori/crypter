module.exports = {
    entry: './src/components/App.js',
    mode: "development",
    output:  {
       path: `${__dirname}/static/frontend`,
       filename: 'main.js',
        clean:true,
   },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.css$/,
                use: [
                         "style-loader", "css-loader"
                ],
            },
        ],
    },
}
;