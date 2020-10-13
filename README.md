# RESTGuide

*An opinionated guide on how to build a RESTful API in with Node.js and Express*

Gerald Haxhi<br />
Softup Technologies<br />
2020<br />

## Introduction
This is a short guide on how to set up a Node.js project with Express and start building a RESTful API. The structure of the boilerplate and the practices that are suggested here are entirely opinion-based and as such, they can be subject to debate and improvement. Most of the content, however, is heavily influenced by many articles (which are mentioned in the [References](#references) section) from Paypal, Microsoft, Swagger, and the REST dissertation itself from Roy Thomas Fielding.<br /><br />
The article is organized in many sections, starting with a short introduction to HTTP and REST architecture and then moving on to more specific topics related to RESTful design best practices. The final parts suggest one way how a Node.js Express API can be structured and a step-by-step example on how to set up a project and start writing some simple endpoints.<br /><br />
The article is intended for everyone (beginner or not) who wants to build a readable, usable, performant, scalable, and easy-to-use API in Node.js with Express.  

## Table of contents

 - [Definitions](#definitions)
 - [HTTP and REST](#http-and-rest)
   - [REST basic principles](#rest-basic-principles)
   - [REST vs HTTP](#rest-vs-http)
   - [REST architectural elements](#rest-architectural-elements)
      - [Resources](#resources)
      - [Identifiers](#identifiers)
      - [Representations](#representations)
      - [HTTP methods](#http-methods)
 - [Guides](#guides)
 - [Best practices](#best-practices)
 - [A sample project structure](#a-sample-project-structure)
 - [Build a RESTful API in Express from scratch](#build-a-restful-api-in-express-from-scratch)
 - [References](#references)

## Definitions

**HTTP:** The Hypertext Transfer Protocol is an application layer protocol for distributed, collaborative, hypermedia information systems.<br /><br />
**REST:** REST is an acronym for REpresentational State Transfer. It is an architectural style for distributed hypermedia systems and was first presented by Roy Fielding in 2000.<br /><br />
**Resource:** An object or representation of something, which has some associated data with it and there can be a set of methods to operate on it. (e.g. *User* is a resource and *add*, *delete*, *update*, *read* are operations that can be performed on it).<br /><br />
**Method:** Actions performed on a resource. HTTP methods like GET, POST, PUT, DELETE, PATCH are used for different operations.<br /><br />
**Identifier:** An URI which uniquely identifies a resource.<br /><br />
**Representation:** How a resource is returned to the client. Resources are decoupled from their representations. You can represent a resource with any of the following: JSON, HTML, XML, plain text, PDF.<br /><br />
**Collection:** A group of resources. Can be one single resource, many resources, or resources and sub-resources together.

## HTTP and REST

### REST basic principles
**Client-Server:** Separate user interface from the data layer to make the user interface portable and to allow all layers to evolve independently.<br /><br />
**Stateless:** The server cannot store any context. All the necessary information to fulfill the request must be present on the request itself. State is kept entirely on the client.<br /><br />
**Cacheable:** To improve network efficiency, we add cache constraints. Cache constraints require that the data within a response to a request be implicitly or explicitly labeled as cacheable or non-cacheable. If a response is cacheable, then a client cache is given the right to reuse that response data for later, equivalent requests.<br /><br />
**Uniform interface:** The central feature that distinguishes the REST architectural style from other network-based styles is its emphasis on a uniform interface between components. REST is defined by four interface constraints: identification of resources, manipulation of resources through representations, self-descriptive messages, and hypermedia as the engine of application state. The downside of the uniform interface is that in some cases it degrades efficiency since the information is transferred in a standardized way, rather than one which is specific to an application's needs.<br /><br />
**Layered system:** The layered system style allows an architecture to be composed of hierarchical layers by constraining component behavior such that each component cannot “see” beyond the immediate layer with which they are interacting.<br /><br />
**Code on demand**: REST allows client functionality to be extended by downloading and executing code in the form of applets or scripts. [1, 9]

### REST vs HTTP
HTTP (HyperText Transfer Protocol) is an application-level protocol and it defines a set of rules on how information is transmitted in the world-wide-web. It is not the only protocol on the application layer (e.g. FTP, SMTP, etc...), but it is the most popular and the accepted standard.
REST is a set of rules (or an architectural style) that standardizes the way applications are built on the web.<br /><br />
REST might seem a lot like HTTP because most of the constraints and standards are based on HTTP concepts (e.g. resources, identifiers, methods, responses and status codes, caching, etc...). However, the REST specification does not imply that HTTP must be mandatorily used as a transfer protocol. A REST API could use another transfer protocol and it would be perfectly correct, provided that it was compliant with all REST constraints. Of course, this is just theory because almost all REST APIs today are built on top of HTTP.
Finally, we must also keep in mind that not all HTTP APIs are RESTful APIs. An HTTP API is every API that uses HTTP as a transfer protocol (e.g. SOAP APIs).

### REST architectural elements
From this section onwards, the discussions regarding REST details will be based on the assumption that HTTP is used as a transfer protocol. The main architectural elements of REST over HTTP are: [1, 5, 6, 9]

- Resources
- Collections
- Identifiers
- Representations
- HTTP methods

#### Resources:
REST APIs are designed around _resources_, which are any kind of object, data, or service that can be accessed by the client. Any information that can be named can be a resource: a document or image, a temporal service, a collection of other resources, a non-virtual object (e.g. a person), and so on. A resource has data, relationships to other resources, and methods that operate against it to allow for accessing and manipulating the associated information. A group of resources is called a collection.

#### Identifiers:
A resource has an _identifier_, which is a URI that uniquely identifies that resource. The naming authority (e.g. an organization providing APIs) that assigned the resource identifier making it possible to reference the resource, is responsible for maintaining the semantic validity of the mapping over time (ensuring that the membership function does not change).

#### Representations:
REST components perform actions on a resource by using a representation to capture the current or intended state of that resource and transferring that representation between components. A representation is a sequence of bytes, plus representation metadata to describe those bytes. Other commonly used but less precise names for a representation include document, file, and HTTP message entity, instance, or variant.
Most web APIs use JSON as the exchange format, but a resource could be represented even as plain text, HTML, XML, PDF, etc...

#### HTTP methods:
All resources have a set of methods that can be operated against them to work with the data being exposed by the API. REStful APIs comprise majorly of HTTP methods which have well defined and unique actions against any resource. Here’s a list of commonly used HTTP methods that define the CRUD operations for any resource or collection in a RESTful API: 

-   GET  retrieves a representation of the resource at the specified URI. The body of the response message contains the details of the requested resource.
-   POST  creates a new resource at the specified URI. The body of the request message provides the details of the new resource. Note that POST can also be used to trigger operations that don't create resources.
-   PUT  either creates or replaces the resource at the specified URI. The body of the request message specifies the resource to be created or updated.
-   PATCH  performs a partial update of a resource. The request body specifies the set of changes to apply to the resource.
-   DELETE  removes the resource at the specified URI.

## Guides

## Best practices

## A sample project structure

## Build a RESTful API in Express from scratch

## References
- [[1] Roy Thomas Fielding: Architectural Styles and the Design of Network-based Software Architectures (Dissertation)](https://www.ics.uci.edu/~fielding/pubs/dissertation/fielding_dissertation.pdf)
- [[2] Paypal API Design Guidelines](https://github.com/paypal/api-standards/blob/master/api-style-guide.md)
- [[3] Paypal API Design Patterns And Use Cases](https://github.com/paypal/api-standards/blob/master/patterns.md)
- [[4] Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [[5] Swagger Best Practices in API Design](https://swagger.io/resources/articles/best-practices-in-api-design/)
- [[6] Microsoft API design guidance](https://docs.microsoft.com/en-us/azure/architecture/best-practices/api-design)
- [[7] Microsoft Web API implementation](https://docs.microsoft.com/en-us/azure/architecture/best-practices/api-implementation)
- [[8] Hackernoon RESTful API Designing guidelines — The best practices](https://hackernoon.com/restful-api-designing-guidelines-the-best-practices-60e1d954e7c9)
- [[9] REST API Tutorial](https://restfulapi.net/)
