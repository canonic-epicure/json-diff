import { calculate, field } from "@bryntum/chronograph/src/replica2/Entity.js"
import { ChronoGraphJSX } from "@bryntum/siesta/src/chronograph-jsx/ChronoGraphJSX.js"
import { Component } from "@bryntum/siesta/src/chronograph-jsx/Component.js"
import JSON5 from "json5"


type Value = {
    kind        : 'empty'
} | {
    kind        : 'invalid'
    message     : string
    line        : number
    col         : number
} | {
    kind        : 'valid'
    value       : unknown
}

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export class Application extends Component {
    @field()
    mode                : 'text' | 'diff'       = 'text'

    @field()
    leftText            : string                = undefined

    @field()
    rightText           : string                = undefined

    @field({ lazy : false })
    value1              : Value                 = undefined

    @field({ lazy : false })
    value2              : Value                 = undefined


    calculateValue (text : string) : Value {
        if (text == null || text === '') return { kind : 'empty' }

        try {
            return { kind : 'valid', value : JSON5.parse(text) }
        } catch (e) {
            return { kind : 'invalid', message : String(e), line : e.lineNumber, col : e.columnNumber }
        }
    }


    get hasBothValidValues () : boolean {
        return this.value1.kind === 'valid' && this.value2.kind === 'valid'
    }


    @calculate('value1')
    calculateValue1 () : Value {
        return this.calculateValue(this.leftText)
    }

    @calculate('value2')
    calculateValue2 () : Value {
        return this.calculateValue(this.rightText)
    }


    renderTextContent () : Element {
        return <>
            <div class="jd-content-left">
                <textarea on:change={ (e : Event) => this.leftText = (e.target as HTMLTextAreaElement).value }></textarea>
            </div>
            <div class="jd-content-middle">
            </div>
            <div class="jd-content-right">
                <textarea on:change={ (e : Event) => this.rightText = (e.target as HTMLTextAreaElement).value }></textarea>
            </div>
        </>
    }


    renderDiffContent () : Element {
        return <div></div>
    }


    render () : Element {
        return <div class="jd-application">
            <div class="jd-header">header</div>
            <div class="jd-content">
                {
                    this.hasBothValidValues && this.mode === 'diff'
                        ? this.renderDiffContent()
                        : this.renderTextContent()
                }
            </div>
            <div class="jd-footer">footer</div>
        </div>
    }


}
