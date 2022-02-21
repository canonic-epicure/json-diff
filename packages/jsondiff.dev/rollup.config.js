import { defineConfig } from 'rollup'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import multiInput from 'rollup-plugin-multi-input'
// import { terser } from 'rollup-plugin-terser'
// import { preserveShebangs } from "rollup-plugin-preserve-shebangs"
// import visualizer from "rollup-plugin-visualizer"
// import { importMetaAssets } from "@web/rollup-plugin-import-meta-assets"


export default defineConfig({
    input : [
        'index.js'
    ],

    output : {
        dir     : 'dist',
        format  : 'esm',
        chunkFileNames  : 'chunks/[name]-[hash].js'
    },

    plugins : [
        resolve({ preferBuiltins : true }),
        commonjs(),
        multiInput(),
        // terser(),
        // preserveShebangs(),
        // importMetaAssets(),
        // visualizer({
        //     filename    : 'dist/stats.html',
        //     template    : 'treemap'
        // })
    ],

    external : [
        '@web/dev-server',
    ]
})
