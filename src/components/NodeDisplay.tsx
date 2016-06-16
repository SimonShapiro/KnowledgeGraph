import * as React from "react";

let nodeStyle = {
    color: "blue",
    cursor: "pointer"
}
let detailDivStyle = {
	backgroundColor: "#f9f9f9",
	padding: "1px 5px 5px 5px"
}

export const NodeDisplay = (props) => {
	const sizeGuess = (txt) => {
		let MAXCOLS = 160
		let MINCOLS = 50
		let MAXROWS = 25
		let rowsByBreaks = (txt.match(/\n/g) || []).length
		let txtMaxLength = txt.split("\n").map((e) => e.length).reduce((acc, e, i, a) => {return Math.max(acc, e)}, 0)
		let rowsByLength = Math.floor(txt.length / MAXCOLS) + 1
		let cols = Math.min(Math.max(txtMaxLength + 3, MINCOLS), MAXCOLS)
		let rows =  Math.min(Math.max(rowsByBreaks, rowsByLength), MAXROWS)
		return {
			rows: rows,
			cols: cols
		}
	}
	if(props.schema.properties !== undefined) {
		let keys = Object.keys(props.schema.properties)
		return (
		<div id="NodeDetail" style={ detailDivStyle }>
			<h4>{ props.node["name"] } ({ props.node["id"] })</h4>
			<table style={ {border: "1px solid grey"} }>
			<tbody>
			{keys.map((k, i) => {
				let l = props.node[k].length 
				let itemStyle = {
					readonly: "true"  //,
				//	cols: cols,
				//	rows: MAXROWS
				}
				return (
					<tr key={ i }>
						<td><b>{ k }</b></td>
						<td><textarea style={ itemStyle } value={ props.node[k] } rows={ sizeGuess(props.node[k]).rows } 
						     cols={ sizeGuess(props.node[k]).cols }/></td>
					</tr>
				)}
			)}
			</tbody>
			</table>
			<p>Related:</p>
	        <ul>
	            {props.outbound.map((item, i, a) => {
	                return (
	                <li key={"From_"+i}><i>This { item.fromType }</i> {item.label} <span style={nodeStyle} onClick={(e)=>props.nodeSurf(item.toNodeId, item.toType)}>{item.toName}</span></li>
	                )
	            })}
	            {props.inbound.map((item, i, a) => {
	                return (
	                <li key={"To_"+i}><span style={nodeStyle} onClick={(e)=>props.nodeSurf(item.fromNodeId, item.fromType)}>{item.fromName}</span> {item.label} <i>this { item.toType }</i></li>
	                )
	            })}
	        </ul>
	        <span><b>Trail</b> (<a style={ nodeStyle } onClick={(e)=>props.resetTrail()}> reset</a>) ... </span>
	        <ul>
	        {props.trail.map((t, i) =>
	        	(
	        		<li key={ i } style={ {display: "inline"} } > <a style={ nodeStyle } onClick={(e) => props.trimTrail(i)}>{ t }</a> > </li>
	        		))}
	        </ul>
		</div>)	
		}
	else return null				
	}