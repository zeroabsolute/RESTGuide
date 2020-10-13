

# RESTGuide

*An opinionated guide on how to build a RESTful API in with Node.js and Express*

Gerald Haxhi<br />
Softup Technologies<br />
2020<br />

## Introduction
This is a short guide on how to set up a Node.js project with Express and start building a RESTful API. The structure of the boilerplate and the practices that are suggested here are entirely opinion-based and as such, they can be subject to debate and improvement. Most of the content, however, is heavily influenced by many articles (which are mentioned in the [References](#references) section) from Paypal, Microsoft, Swagger, and other authors.<br /><br />
The article is organized in many sections, starting with a short introduction to HTTP and REST architecture and then moving on to more specific topics related to RESTful design best practices. The final parts suggests one way how a Node.js Express API can be structured and a step-by-step example on how to set up a project and start writing some simple endpoints.<br /><br />
The article is intended for everyone (beginner or not) who wants to build a readable, usable, performant, scalable and easy-to-use API in Node.js with Express.  

## Table of contents

 - [Definitions](#definitions)
 - [HTTP and REST](#http-and-rest)
   - [REST basic principles](#rest-basic-principles)
   - [Resources and methods](#resources-and-methods)
   - [REST vs HTTP](#rest-vs-http)
 - [Guides](#guides)
 - [Best practices](#best-practices)
 - [A sample project structure](#a-sample-project-structure)
 - [Build a RESTful API in Express from scratch](#build-a-restful-api-in-express-from-scratch)

## Definitions

**HTTP:** The Hypertext Transfer Protocol is an application layer protocol for distributed, collaborative, hypermedia information systems.<br /><br />
**REST:** REST is acronym for REpresentational State Transfer. It is architectural style for distributed hypermedia systems and was first presented by Roy Fielding in 2000.<br /><br />
**Resource:** An object or representation of something, which has some associated data with it and there can be set of methods to operate on it. (e.g. *User* is a resource and *add*, *delete*, *update*, *read* are operations that can be performed on it).<br /><br />
**Method:** Actions performed on a resource. HTTP methods like GET, POST, PUT, DELETE, PATCH are used for different operations.<br /><br />
**Identifier:** An URI which uniquely identifies a resource.<br /><br />
**Representation:** How a resource is returned to the client. Resources are decoupled from their representations. You can represent a resource with any of the following: JSON, HTML, XML, plain text, PDF.<br /><br />
**Collection:** A group of resources. Can be one single resource, many resources, or resources and sub-resources together.

## HTTP and REST

### REST basic principles

### Resources and methods

### REST vs HTTP

## Guides

## Best practices

## A sample project structure

## Build a RESTful API in Express from scratch

## References
- [Paypal API Design Guidelines](https://github.com/paypal/api-standards/blob/master/api-style-guide.md)
- [Paypal API Design Patterns And Use Cases](https://github.com/paypal/api-standards/blob/master/patterns.md)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Swagger Best Practices in API Design](https://swagger.io/resources/articles/best-practices-in-api-design/)
- [Microsoft API design guidance](https://docs.microsoft.com/en-us/azure/architecture/best-practices/api-design)
- [Microsoft Web API implementation](https://docs.microsoft.com/en-us/azure/architecture/best-practices/api-implementation)
- [Hackernoon RESTful API Designing guidelines — The best practices](https://hackernoon.com/restful-api-designing-guidelines-the-best-practices-60e1d954e7c9)
- [REST API Tutorial](https://restfulapi.net/)
