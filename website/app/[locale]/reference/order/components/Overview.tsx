import syntaxes from '../syntaxes'
import SyntaxTable from '~/website/components/SyntaxTable'
import SyntaxTr from '~/website/components/SyntaxTr'
import SyntaxPreview from './SyntaxPreview'

export default () => {
    const previewSyntax = 'order:0'
    return (
        <>
            <SyntaxTable>
                {syntaxes.map((syntax) =>
                    <SyntaxTr value={syntax} key={syntax} previewSyntax={previewSyntax}></SyntaxTr>)
                }
            </SyntaxTable>
            <SyntaxPreview className={previewSyntax} />
        </>
    )
}