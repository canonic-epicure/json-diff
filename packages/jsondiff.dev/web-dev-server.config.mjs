import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

import { fromRollup } from '@web/dev-server-rollup'

export default {
    plugins : [
        fromRollup(resolve),
        fromRollup(commonjs),
    ]
}
