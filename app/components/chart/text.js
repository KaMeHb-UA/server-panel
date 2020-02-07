import { html, Component } from '../3rd-party/preact.js'

export default class extends Component{
    render(){
        const { children, x, y, class: className } = this.props;
        return html`<text class=${className} transform=${`matrix(1 0 0 1 ${x} ${y})`}>${children}</text>`
    }
}
