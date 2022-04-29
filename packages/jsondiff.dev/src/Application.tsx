import { calculate, field } from "@bryntum/chronograph/src/replica2/Entity.js"
import { ChronoGraphJSX } from "@bryntum/siesta/src/chronograph-jsx/ChronoGraphJSX.js"
import { Component } from "@bryntum/siesta/src/chronograph-jsx/Component.js"
import { compareDeepDiff } from "@bryntum/siesta/src/compare_deep/DeepDiff.js"
import { JsonDeepDiffComponent } from "@bryntum/siesta/src/compare_deep/JsonDeepDiffComponent.js"
import { buffer }  from "@bryntum/siesta/src/util/TimeHelpers.js"
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
    leftText            : string                = ''

    @field()
    rightText           : string                = ''

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
                <textarea spellcheck={ false }
                    on:change={ (e : Event) => this.leftText = (e.target as HTMLTextAreaElement).value }
                    on:input={ buffer((e : Event) => this.leftText = (e.target as HTMLTextAreaElement).value, 250) }
                >
                    { this.$.leftText }
                </textarea>
                <div class='jd-json-error-indicator'>

                </div>
            </div>
            <div class="jd-content-middle">
            </div>
            <div class="jd-content-right">
                <textarea spellcheck={ false }
                    on:change={ (e : Event) => this.rightText = (e.target as HTMLTextAreaElement).value }
                    on:input={ buffer((e : Event) => this.rightText = (e.target as HTMLTextAreaElement).value, 250) }
                >
                    { this.$.rightText }
                </textarea>
                <div class='jd-json-error-indicator'></div>
            </div>
        </>
    }


    renderDiffContent () : Element {
        return JsonDeepDiffComponent.new({
            // @ts-ignore - we know the values are valid json at this point
            difference      : compareDeepDiff(this.value1.value, this.value2.value)
        }).el
    }


    render () : Element {
        return <div class="jd-application">
            <div class="jd-header">
                {
                    () => this.mode === 'diff'
                        ? <button on:click={ () => this.mode = 'text' } class='fa-btn fa-keyboard btn-text'>Back to text</button>
                        : <>
                            <button
                                disabled={ () => this.hasBothValidValues ? undefined : true }
                                on:click={ () => this.hasBothValidValues ? this.mode = 'diff' : undefined }
                                class='fa-btn fa-not-equal btn-diff'
                            >
                                Show me the diff
                            </button>
                            <button
                                on:click={ () => this.onSampleDataClick() }
                                class='fa-btn fa-file-import btn-sample-data'
                            >
                                Sample data
                            </button>
                        </>

                }
            </div>
            <div class="jd-content">
                {
                    () => this.mode === 'diff'
                        ? this.renderDiffContent()
                        : this.renderTextContent()
                }
            </div>
            <div class="jd-footer">© Nickolay Platonov 2022</div>
        </div>
    }


    onSampleDataClick () {
        this.leftText = '{ commonKey: 1, leftOnlyKey : 2 }'
        this.rightText = '{ commonKey: 1, rightOnlyKey : 2 }'

        this.mode = 'diff'
    }
}
