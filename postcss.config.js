
module.exports = {
  plugins: [
    require('postcss-import')({}),
    // require('postcss-easy-import')({
    //   prefix: '_',
    // }),
    require('tailwindcss')('./src/tailwind/index.js'),
    require('postcss-cssnext')(),
    require('postcss-utilities'),
  ]
}