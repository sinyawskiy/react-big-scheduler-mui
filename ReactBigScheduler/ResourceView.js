import React, {Component} from 'react';
import {PropTypes} from 'prop-types'
import AddBox from '@material-ui/icons/AddBox';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import IconButton from '@material-ui/core/IconButton';

class ResourceView extends Component {

    constructor(props) {
        super(props);
    }

    static propTypes = {
        schedulerData: PropTypes.object.isRequired,
        contentScrollbarHeight: PropTypes.number.isRequired,
        slotClickedFunc: PropTypes.func,
        slotItemTemplateResolver: PropTypes.func,
        toggleExpandFunc: PropTypes.func
    }

    render() {

        const {schedulerData, contentScrollbarHeight, slotClickedFunc, slotItemTemplateResolver, toggleExpandFunc} = this.props;
        const {renderData} = schedulerData;

        let width = schedulerData.getResourceTableWidth() - 2;
        let paddingBottom = contentScrollbarHeight;
        let displayRenderData = renderData.filter(o => o.render);
        let resourceList = displayRenderData.map((item) => {
            let indents = [];
            for(let i=0;i<item.indent;i++) {
                indents.push(<span key={`es${i}`} className="expander-space"></span>);
            }
            let indent = <span key={`es${item.indent}`} className="expander-space"></span>;
            if(item.hasChildren) {
                indent = item.expanded ? (
                    <IconButton size={'small'} key={`es${item.indent}`} onClick={() => {
                        if(!!toggleExpandFunc)
                            toggleExpandFunc(schedulerData, item.slotId);
                    }}>
                        <IndeterminateCheckBoxIcon />
                    </IconButton>
                ) : (
                    <IconButton size={'small'} key={`es${item.indent}`} onClick={() => {
                        if(!!toggleExpandFunc)
                            toggleExpandFunc(schedulerData, item.slotId);
                    }}>
                        <AddBox />
                    </IconButton>
                );
            }
            indents.push(indent);
            let a = typeof(slotClickedFunc) != 'undefined' ? <span className="slot-cell">{indents}<a className="slot-text" onClick={() => {
                slotClickedFunc(schedulerData, item);
            }}>{item.slotName}</a></span>
                : <span className="slot-cell">{indents}<span className="slot-text">{item.slotName}</span></span>;
            let slotItem = (
                <div title={item.slotName} className="overflow-text header2-text" style={{textAlign: "left"}}>
                    {a}
                </div>
            );
            if(!!slotItemTemplateResolver) {
                let temp = slotItemTemplateResolver(schedulerData, item, slotClickedFunc, width, "overflow-text header2-text");
                if(!!temp)
                    slotItem = temp;
            }

            let tdStyle = {height: item.rowHeight};
            if(item.groupOnly) {
                tdStyle = {
                    ...tdStyle,
                    backgroundColor: schedulerData.config.groupOnlySlotColor
                };
            }

            return (
                <tr key={item.slotId}>
                    <td data-resource-id={item.slotId} style={tdStyle}>
                        {slotItem}
                    </td>
                </tr>
            );
        });

        return (
            <div style={{paddingBottom: paddingBottom}}>
                <table className="resource-table">
                    <tbody>
                        {resourceList}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default ResourceView