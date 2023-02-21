const path = require('path');
const webpack = require('webpack');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

const childProcess = require('child_process');

const removeNewLine = buffer => {
    return buffer.toString().replace('\n', '');
};

const env = process.env.NODE_ENV;

module.exports = {
    mode: 'development',

    entry: {
        config: '/js/config.js',
        login: '/js/login/login.js',
        pwChange: '/js/login/pwChange.js',
        head: '/js/main/head.js',
        user: '/js/user/user.js',
        auth: '/js/user/auth.js',
        userAuth: '/js/user/userAuth.js',
        userAuthWrite: '/js/user/userAuthWrite.js',
        code: '/js/mng/code.js',
        menu: '/js/menu/menu.js',
        menuAuth: '/js/menu/menuAuth.js',
        board: '/js/board/board.js',
        post: '/js/board/post.js',
        postPage: '/js/board/postPage.js',
        postEdit: '/js/board/postEdit.js',
        postView: '/js/board/postView.js',
        postWrite: '/js/board/postWrite.js',
        faq: '/js/board/faq.js',
        faqEdit: '/js/board/faqEdit.js',
        faqWrite: '/js/board/faqWrite.js',
        qna: '/js/board/qna.js',
        qnaEdit: '/js/board/qnaEdit.js',
    },
    output: {
        path: path.resolve(`${__dirname}/dist`),
        filename: '[name].js',
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.s?css$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.js$/,
                use: ['babel-loader'],
            },
            {
                test: /\.(gif|png|jpe?g|svg)$/i,
                use: [
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            mozjpeg: {
                                progressive: true,
                                quality: 65,
                            },
                            optipng: {
                                enabled: false,
                            },
                            pngquant: {
                                quality: [0.65, 0.9],
                                speed: 4,
                            },
                            gifsicle: {
                                interlaced: false,
                            },
                            webp: {
                                quality: 75,
                            },
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin({
            cleanAfterEveryBuildPatterns: ['dist'],
        }),
        new webpack.DefinePlugin({
            VERSION: JSON.stringify('v.1.0.0'),
            'api.domain': JSON.stringify('http://localhost:8080'),
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            moment: 'moment',
            _: 'lodash',
            Swal: 'sweetalert2',
        }),
    ],
};
