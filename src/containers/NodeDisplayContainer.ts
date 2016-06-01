import { connect } from "react-redux";
import { Provider } from "react-redux";

import { NodeDisplay } from "../components/NodeDisplay"

const objectToSchema = (obj, name) => {
	let keys = Object.keys(obj)
	let propList = {}
	keys.forEach((k) => {
		propList[k] = {
			type: Array.isArray(obj[k]) ? 'Array' : typeof(obj[k])
		}
	})
	let schema = {
		title: name,
		type: "object",
		properties: propList}
	return schema
}

const relatedFromThis = (state, nodeId: string) => {
	let nodes = state.data.model.nodes
	let edges = state.data.model.edges
	let edgeIterator = Object.keys((edges))
	let sub = edgeIterator.filter((e) => {
		return edges[e].fromNodeId == nodeId
	}).map((e) => {
		let edge = edges[e]
		edge.fromName = nodes[edge.fromNodeId].name
		edge.toName = nodes[edge.toNodeId].name
		edge.fromType = nodes[edge.fromNodeId].nodeType
		edge.toType = nodes[edge.toNodeId].nodeType
		return edge})
    console.log("Got this out ", sub)    
	return sub
}

const relatedToThis = (state, nodeId: string) => {
	let nodes = state.data.model.nodes
	let edges = state.data.model.edges
	let edgeIterator = Object.keys((edges))
	let sub = edgeIterator.filter((e) => {
		return edges[e].toNodeId == nodeId
	}).map((e) => {
		let edge = edges[e]
		edge.fromName = nodes[edge.fromNodeId].name
		edge.fromType = nodes[edge.fromNodeId].nodeType
		edge.toType = nodes[edge.toNodeId].nodeType
		edge.toName = nodes[edge.toNodeId].name
		return edge})
    console.log("Got this in ", sub)    
	return sub
}


const mapStateToProps = (state) => {
	let node = state.data.model.nodes[state.UIstate.nodeDetailId]
	console.log("new node", node)
	let schema = (node === undefined) ? {} : objectToSchema(node, node.nodeType)  //todo get the schema from the metamodel
	return {
		trail: state.UIstate.nodeCrumbTrail,
		node: node,
		schema: schema,
		outbound: relatedFromThis(state, state.UIstate.nodeDetailId),
		inbound: relatedToThis(state, state.UIstate.nodeDetailId)		
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		nodeSurf: (id, type) => {		
			console.log("Surfing to Node ", id, type)

		 	dispatch({type:"MenuStripOnClick", selected: type})  // not sure if this should change the uior not

			dispatch({type: "NodeListAction", data: {
		 		action: "view",
		 		id: id,
		 		nodeType: type
		 	}})},
		 resetTrail: () => {
		 	console.log("Resetting trail")
		 	dispatch({type:"ResetTrail", data:{}})
		 },
		 trimTrail: (pos) => {
		 	console.log("Trimming trail")
		 	dispatch({type:"TrimTrail", trimTo: pos})
		 } 	
	}
}

export const NodeDisplayContainer = connect(
	mapStateToProps,
	mapDispatchToProps
	)(NodeDisplay)