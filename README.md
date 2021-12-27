This project was bootstrapped with [single-spa](https://github.com/single-spa/single-spa) and [react](https://github.com/facebook/react/)


## structure
* sirius-spa-config-fe
    * sirius-platform-core-fe
        * sirius-sales-fe
        * ...

`sirius-spa-config-fe`: responsible for config the spa project. Take a look the `src/index.ejs`.
* run on port: 9000

`sirius-platform-core-fe`: responsible for render header, side menu and call the others micro frontends.
* run on port: 8500

`sirius-sales-fe`: responsible for render the sales-fe micro frontend.
* run on port: 8600

## build

`yarn build` or `npm build`

the build files will be found in dist folder.

## installation
1. npm install
2. npm start -- --port=8600

## run

`./sirius-spa-config-fe$` npm start 

`./sirius-platform-core-fe$` npm start -- --port=8500

`./sirius-sales-fe$` npm start -- --port=8600

Access:  http://localhost:9000/

## environment

`QA` http://ec2-54-94-40-246.sa-east-1.compute.amazonaws.com/plataformasirius/#/comercial/

## architecture
```
app
├── node_modules
├── package.json
├── .eslintrc
├── .gitignore
├── .prettierrc
├── jest.config.js
├── tsconfig.json
├── webpack.config.js
├── env
├── src
|    │── application
|    │   ├── i18n
|    │   ├── redux
|    │   ├── theme
|    ├── infrastructure
|    │   ├── api
|    ├── presentation
|    │   ├── components
|    │   ├── pages
|    │   ├── App.tsx
├── sirius-platform-core-fe.tsx      
├── Root.tsx
└── README.md      
```