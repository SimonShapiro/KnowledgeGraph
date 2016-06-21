# Graph-Based-Knowledge-Manager
This project is an experiment in how to set up and use a form of graph-based knowledge representation.  It consists of a number of 
parts that I have been playing with over the past few decades.

It also provides me with a great excuse to learn new technoligies.  Specifically, I have used this project as a vehicle to learn:
* react
* redux
* typescript
* webpack
* pouchdb

## What is graph-based knowledge representation?
We most commonly come across graph-based knowledge representations in the development of conceptual schemas for database systems.
The conceptual schema is a map that describes the semantics of an organization and represents a series of assertions about its nature. 

The easiest way to understand this is through an illustration.

### Example of conceptual schema
Suppose we want to record information about companies and their shareholders and directors.  The conceptual schema (below) illustrates some of the key assertions that can be made.


![Example 1](https://github.com/SimonShapiro/Graph-Based-Knowledge-Manager/blob/WithTypedInfoModel/Documentation/Example1.png)

There are five distinct types of assertions that can be made from this:

1. The ownership structure of companies that own other companies
1. The shareholding by people in companies
1. The directorships held by people in companies
1. Other nformation (assertions) about companies
1. Other information (assertions) about people

There are many possible implementations of this.  In a relational (RDBMS) we would typically create a table for comapnies and people.  Then, depending on the cardinality of the relationships, we might set up a table for each relationship: company ownership, person shareholding, and person directorship.  As the size and complexity of the schema grows so does the number of tables required to store the data.

### Implementation considerations

In this experiment, we are interested in representing both the schema as well as the data in a graph.  We also want to use NOSQL technology to allow more felxible expression of the attributes being stored.

Simply, we have a metaModel which is a graph consisting of vertices (nodes) and edges together with a data model which is "conditioned" by the metaModel.  By "conditioned" we mean that the data are instances of the nodes and edges set out in the metaModel.  Thus, the metaModel acts as a type system over the model ensuring that all data is consistent with the schema for each node and edge.

The schemas are described using json-schema as defined at [json-schema.org](http://json-schema.org).  The snippet below is the code used for the company in the example code.

```
	{
		"metaModel": {
			"nodes": {
				"Company": {
					"id": "Company",
					"name": "Company Meta",
					"nodeType": "metaNode",
					"schema": {
						"title": "Person",
						"type": "object",
						"properties": {
							"id": {
								"type": "string",
								"description": "A unique id for the company"
							},
							"name": {
								"type": "string"
							},
							"notes": {
								"type": "string"
							}					
						}
					}
				}
			}
		}
	}				
```

In a simlar way, edges are defined using json and json-schema.  For example here is the snippet for Person_DIRECTOR_Company.

```
...
   		"edges": {
			"Person_DIRECTOR_Company": {
		        "id": "Person_DIRECTOR_Company",
		        "fromNodeId": "Person",
		        "toNodeId": "Company",
		        "label": "DIRECTOR",
		        "edgeType": "MetaEdge",
				"schema": {
					"title": "Person_DIRECTOR_Company",
					"type": "object",
					"properties": {
						"id": {
							"type": "string",
							"description": "A unique id for the Person_DIRECTOR_Company edge"
						},
						"fromNodeId": {
							"type": "string"
							},
						"toNodeId": {
							"type": "string"
						},
						"startDate": {
							"type": "string"
						},
						"endDate": {
							"type": "string"
						}
					}
				}

```