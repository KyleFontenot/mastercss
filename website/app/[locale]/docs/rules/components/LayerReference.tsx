import { Layer } from '@master/css'

const LayerReference = () => <table>
    <thead>
        <tr>
            <th className="w:0">Name</th>
            <th>Value</th>
        </tr>
    </thead>
    <tbody>
        {
            // @ts-ignore
            Object.keys(Layer)
                .filter((eachName) => Number.isNaN(+eachName))
                .map((eachName) => {
                    // @ts-ignore
                    const each = Layer[eachName]
                    return (
                        <tr key={eachName}>
                            <td><code className='fg:blue'>{eachName}</code></td>
                            <td><code className='fg:blue'>{each}</code></td>
                        </tr>
                    )
                })
        }
    </tbody>
</table>

export default LayerReference