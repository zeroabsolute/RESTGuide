# RESTGuide

*An opinionated guide on how to build a RESTful API in with Node.js and Express*

Gerald Haxhi<br />
Softup Technologies<br />
2020<br />

# Introduction

This is a short guide on how to set up a Node.js project with Express and start building a RESTful API. The structure of the boilerplate and the practices that are suggested here are entirely opinion-based and as such, they can be subject to debate and improvement. Most of the content, however, is heavily influenced by many articles (which are mentioned in the [References](#references) section) from Paypal, Microsoft, Swagger, and the REST dissertation itself from Roy Thomas Fielding.<br /><br />
The article is organized in many sections, starting with a short introduction to HTTP and REST architecture and then moving on to more specific topics related to RESTful design best practices. The final parts suggest one way how a Node.js Express API can be structured and a step-by-step example on how to set up a project and start writing some simple endpoints.<br /><br />
The article is intended for everyone (beginner or not) who wants to build a readable, usable, performant, scalable, and easy-to-use API in Node.js with Express.  

# Table of contents

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
   - [Summary of REST and HTTP main concepts](#summary-of-rest-and-http-main-concepts)
     - [Methods](#methods)
     - [Headers](#headers)
     - [Status codes](#status-codes)
   - [How to design your REST API](#how-to-design-your-rest-api)
     - [Create a resource](#create-a-resource)
     - [Create a sub-resource](#create-a-sub-resource)
     - [Read resources](#read-resources)
     - [Read a single resource](#read-a-single-resource)
     - [Update a resource](#update-a-resource)
     - [Partially update a resource](#partially-update-a-resource)
     - [Delete a resource](#delete-a-resource)
     - [Check if a resource exists](#check-if-a-resource-exists)
	 - [Bulk operations](#bulk-operations)
	 - [Asynchronous operations](#asynchronous-operations)
	 - [File uploads](#file-uploads)
   - [Error handling](#error-handling)
   - [API versioning](#api-versioning)
 - [Best practices](#best-practices)
 - [A sample project structure](#a-sample-project-structure)
 - [Build a RESTful API in Express from scratch](#build-a-restful-api-in-express-from-scratch)
 - [References](#references)

# Definitions

**HTTP:** The Hypertext Transfer Protocol is an application layer protocol for distributed, collaborative, hypermedia information systems.<br /><br />
**REST:** REST is an acronym for REpresentational State Transfer. It is an architectural style for distributed hypermedia systems and was first presented by Roy Fielding in 2000.<br /><br />
**Resource:** An object or representation of something, which has some associated data with it and there can be a set of methods to operate on it. (e.g. *User* is a resource and *add*, *delete*, *update*, *read* are operations that can be performed on it).<br /><br />
**Method:** Actions performed on a resource. HTTP methods like GET, POST, PUT, DELETE, PATCH are used for different operations.<br /><br />
**Identifier:** An URI which uniquely identifies a resource.<br /><br />
**Representation:** How a resource is returned to the client. Resources are decoupled from their representations. You can represent a resource with any of the following: JSON, HTML, XML, plain text, PDF.<br /><br />
**Collection:** A group of resources. Can be one single resource, many resources, or resources and sub-resources together.<br /><br />
**Idempotency:** From a RESTful service standpoint, for an operation (or service call) to be idempotent, clients can make that same call repeatedly while producing the same result. In other words, making multiple identical requests has the same effect as making a single request. Note that while idempotent operations produce the same result on the server (no side effects), the response itself may not be the same (e.g. a resource's state may change between requests).

# HTTP and REST

## REST basic principles

**Client-Server:** Separate user interface from the data layer to make the user interface portable and to allow all layers to evolve independently.<br /><br />
**Stateless:** The server cannot store any context. All the necessary information to fulfill the request must be present on the request itself. State is kept entirely on the client.<br /><br />
**Cacheable:** To improve network efficiency, we add cache constraints. Cache constraints require that the data within a response to a request be implicitly or explicitly labeled as cacheable or non-cacheable. If a response is cacheable, then a client cache is given the right to reuse that response data for later, equivalent requests.<br /><br />
**Uniform interface:** The central feature that distinguishes the REST architectural style from other network-based styles is its emphasis on a uniform interface between components. REST is defined by four interface constraints: identification of resources, manipulation of resources through representations, self-descriptive messages, and hypermedia as the engine of application state. The downside of the uniform interface is that in some cases it degrades efficiency since the information is transferred in a standardized way, rather than one which is specific to an application's needs.<br /><br />
**Layered system:** The layered system style allows an architecture to be composed of hierarchical layers by constraining component behavior such that each component cannot “see” beyond the immediate layer with which they are interacting.<br /><br />
**Code on demand**: REST allows client functionality to be extended by downloading and executing code in the form of applets or scripts. [1, 9]

## REST vs HTTP

HTTP (HyperText Transfer Protocol) is an application-level protocol and it defines a set of rules on how information is transmitted in the world-wide-web. It is not the only protocol on the application layer (e.g. FTP, SMTP, etc...), but it is the most popular and the accepted standard.
REST is a set of rules (or an architectural style) that standardizes the way applications are built on the web.<br /><br />
REST might seem a lot like HTTP because most of the constraints and standards are based on HTTP concepts (e.g. resources, identifiers, methods, responses and status codes, caching, etc...). However, the REST specification does not imply that HTTP must be mandatorily used as a transfer protocol. A REST API could use another transfer protocol and it would be perfectly correct, provided that it was compliant with all REST constraints. Of course, this is just theory because almost all REST APIs today are built on top of HTTP.
Finally, we must also keep in mind that not all HTTP APIs are RESTful APIs. An HTTP API is every API that uses HTTP as a transfer protocol (e.g. SOAP APIs).

## REST architectural elements

From this section onwards, the discussions regarding REST details will be based on the assumption that HTTP is used as a transfer protocol. The main architectural elements of REST over HTTP are: [1, 5, 6, 9]

- Resources
- Collections
- Identifiers
- Representations
- HTTP methods

### Resources:
REST APIs are designed around _resources_, which are any kind of object, data, or service that can be accessed by the client. Any information that can be named can be a resource: a document or image, a temporal service, a collection of other resources, a non-virtual object (e.g. a person), and so on. A resource has data, relationships to other resources, and methods that operate against it to allow for accessing and manipulating the associated information. A group of resources is called a collection.

### Identifiers:
A resource has an _identifier_, which is a URI that uniquely identifies that resource. The naming authority (e.g. an organization providing APIs) that assigned the resource identifier making it possible to reference the resource, is responsible for maintaining the semantic validity of the mapping over time (ensuring that the membership function does not change).

### Representations:
REST components perform actions on a resource by using a representation to capture the current or intended state of that resource and transferring that representation between components. A representation is a sequence of bytes, plus representation metadata to describe those bytes. Other commonly used but less precise names for a representation include document, file, and HTTP message entity, instance, or variant.
Most web APIs use JSON as the exchange format, but a resource could be represented even as plain text, HTML, XML, PDF, etc...

### HTTP methods:
All resources have a set of methods that can be operated against them to work with the data being exposed by the API. REStful APIs comprise majorly of HTTP methods which have well defined and unique actions against any resource. Here’s a list of commonly used HTTP methods that define the CRUD operations for any resource or collection in a RESTful API: 

-   GET  retrieves a representation of the resource at the specified URI. The body of the response message contains the details of the requested resource.
-   POST  creates a new resource at the specified URI. The body of the request message provides the details of the new resource. Note that POST can also be used to trigger operations that don't create resources.
-   PUT  either creates or replaces the resource at the specified URI. The body of the request message specifies the resource to be created or updated.
-   PATCH  performs a partial update of a resource. The request body specifies the set of changes to apply to the resource.
-   DELETE  removes the resource at the specified URI.

# Guides

## Summary of REST and HTTP main concepts

### Methods

| HTTP Method | Description | Idempotent |
|---|---|---|
| `POST` | To _create_ a resource, or to _execute_ a complex operation on a resource. | No |
| `GET` | To _retrieve_ a resource. | Yes |
| `PUT` | To _update_ a resource. | Yes |
| `PUT` | To _partially update_ a resource. | Yes |
| `DELETE` | To _delete_ a resource. | Yes |
| `HEAD` | A more lightweight version of GET. | Yes |


### Headers

This is a list of the most common HTTP headers. For a full list, you can check [10].

| HTTP Header | Description
|---|---|
| `Accept` | Advertises which content types, expressed as MIME types, the client can understand.
| `Accept-Encoding` | Advertises which content-encoding, usually a compression algorithm, the client can understand.
| `Accept-Language` | Advertises which languages the client can understand, and which locale variant is preferred. (By languages, we mean natural languages, such as English, and not programming languages.)
| `Access-Control-Allow-Origin` | Indicates whether the response can be shared with requesting code from the given origin.
| `Authorization` | Contains the credentials to authenticate a user agent with a server.
| `Cache-Control` | Holds _directives_ (instructions) for caching in both requests and responses.
| `Host` | Specifies the host and port number of the server to which the request is being sent.
| `Referer` | Contains the address of the page making the request.
| `User-Agent` | A characteristic string that lets servers and network peers identify the application, operating system, vendor, and/or version of the requesting user agent.

### Status codes
Here we will only show the most used status code ranges. For a full list of codes, you can check [11].<br /><br />
The most used status code ranges are the following:
- `2xx`: The request has succeeded (the server received the request, understood it, accepted it, and processed it). The meaning of success depends on the HTTP method.
- `4xx`: A client error has occurred. In most cases, the client can modify the request and resend it.
- `5xx`: A server error has occurred. The client request is correct, but the operation could not be completed because of an internal software error on the server.

The most used status codes in RESTful APIs [11]:
| HTTP status code | Description
|---|---|
| `200 OK` | The request has succeeded. The meaning of success depends on the HTTP method.
| `201 Created` | The request has succeeded and a new resource has been created as a result. This is typically the response sent after POST requests or some PUT requests.
| `202 Accepted` | The request has been received but not yet acted upon. It is noncommittal since there is no way in HTTP to later send an asynchronous response indicating the outcome of the request. It is intended for cases where another process or server handles the request, or for batch processing.
| `204 No Content` | There is no content to send for this request, but the headers may be useful. The user-agent may update its cached headers for this resource with the new ones.
| `400 Bad Request` | The server could not understand the request due to invalid syntax.
| `401 Unauthorized` | Although the HTTP standard specifies "unauthorized", semantically this response means "unauthenticated". That is, the client must authenticate itself to get the requested response.
| `403 Forbidden` | The client does not have access rights to the content; that is, it is unauthorized, so the server is refusing to give the requested resource. Unlike 401, the client's identity is known to the server.
| `404 Not Found` | The server can not find the requested resource. In the browser, this means the URL is not recognized. In an API, this can also mean that the endpoint is valid but the resource itself does not exist. Servers may also send this response instead of 403 to hide the existence of a resource from an unauthorized client.
| `422 Unprocessable Entity` | The request was well-formed but was unable to be followed due to semantic errors.
| `429 Too Many Requests` | The user has sent too many requests in a given amount of time ("rate limiting").
| `500 Internal Server Error` | The server has encountered a situation it doesn't know how to handle.

Below you can find a mapping of HTTP methods and the status codes they can return (taken from [2]). For each HTTP method, API developers should use only status codes marked as "X" in this table. If an API needs to return any of the status codes marked with an **`X`**, then the use case should be reviewed as part of the API design review process and maturity level assessment. Most of these status codes are used to support very rare use cases (more info can be found in [2]).

|  | 200 Success | 201 Created | 202 Accepted | 204 No Content | 400 Bad Request | 404 Not Found | 422 Unprocessable Entity | 500 Internal Server Error |
|---|---|---|---|---|---|---|---|---|
| `GET` | X |   |   |   | X | X |**`X`**| X |
| `POST` | X | X |**`X`**|   | X |**`X`**|**`X`**| X |
| `PUT` | X |  |**`X`**| X | X | X |**`X`**| X |
| `PATCH` | X |  |  | X | X | X |**`X`**| X |
| `DELETE` | X |  |  | X | X | X |**`X`**| X |


## How to design your REST API

This section will describe how you can structure your API endpoints. For each operation, the following information will be given:
- A short description of the purpose of the operation (e.g. what should we achieve when using POST, GET, etc..).
- A sample URL template.
- A sample request body (we will concentrate on JSON representations).
- A sample response body.
- HTTP statuses that we can return for each operation.
- Other notes.

The examples will be based on the following data model (a MongoDB schema):
```
const Book = {
  _id: Object,
  title: String,
  author: ObjectId,
  pages: Number,
  genre: String,
  publications: [{
    _id: Object,
    date: Date,
  }],
  images: [{
    _id: Object,
    url: String,
  }]
};
```

### Create a resource
Under normal circumstances, when we want to create a new resource we must use the *POST* method. The request will have a body, where the client will provide the required and non-required fields. The content type of the request body will be JSON. Most of the fields will be provided by the client, but the service can also generate some values, depending on the application logic. 
The response will contain a full JSON representation of the created resource, together with the HTTP status code. (*Note: In a pure RESTful API, together with the resource representation, Hypermedia Links must also be included to make it easier to access the newly created resource for reading, updating, and deleting it. In this article we will omit HATEOAS*).

#### URL sample
```
POST /api/{version}/books
```

#### Request body sample
```
{
  "title": "1984",
  "author": "5e95e25b4d749e01161f92af",
  "pages": 328,
  "genre": "dystopian_fiction",
  "publications": [{
    "date": "1949-06-08"
  }]
}
```

#### Response sample
```
{
  "status": 201,
  "body": {
    "_id": "5e96bd5641971b0117987a43",
    "title": "1984",
    "author": "5e95e25b4d749e01161f92af",
    "pages": 328,
    "genre": "dystopian_fiction",
    "publications": [{
      "_id": "5e96bd5641971b0117987a44",
      "date": "1949-06-08"
    }],
    "images": [],
    "createdAt": "2020-10-15 07:52:54.829Z",
    "updatedAt": "2020-10-15 07:52:54.829Z"
  }
}
```

#### HTTP status codes
The most common errors that could be returned from a POST request are the following:
- 200 Success: Rare case. When the method does some processing but it doesn't create a new resource, it can return status 200 with the result of the operation in the response body. 
- 201 Created: When the operation is finished successfully and the new resource is created.
- 202 Accepted: This status is returned in case of asynchronous operations when you want to return control to the client and continue doing background work.
- 204 No Content: This is similar to the 200 situation, but in this case, the processing does not return a result.
- 400 Bad Request: This status is returned when the format of the request body is not correct.
- 404 Not Found: When the resource is not found.
- 422 Unprocessable Entity: This is returned when the request body is correct, but the operation cannot be performed due to semantic errors. 
- 500 Internal Server Error: This is returned when the request cannot be satisfied because of some unexpected error in the server. 

#### Other notes
If a POST request is intended to create a new resource, the effects of the request should be limited to the new resource (and possibly any directly related resources if there is some sort of linkage involved). For example, in an e-commerce system, a POST request that creates a new order for a customer might also amend inventory levels and generate billing information, but it should not modify information not directly related to the order or have any other side-effects on the overall state of the system [7].

### Create a sub-resource
### Read resources
### Read a single resource
### Update a resource
### Partially update a resource
### Delete a resource
### Check if a resource exists
### Bulk operations
### Asynchronous operations
### File uploads

## Error handling

## API versioning

# Best practices

## Naming conventions

# A sample project structure

# Build a RESTful API in Express from scratch

# References
- [[1] Roy Thomas Fielding: Architectural Styles and the Design of Network-based Software Architectures (Dissertation)](https://www.ics.uci.edu/~fielding/pubs/dissertation/fielding_dissertation.pdf)
- [[2] Paypal API Design Guidelines](https://github.com/paypal/api-standards/blob/master/api-style-guide.md)
- [[3] Paypal API Design Patterns And Use Cases](https://github.com/paypal/api-standards/blob/master/patterns.md)
- [[4] Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [[5] Swagger Best Practices in API Design](https://swagger.io/resources/articles/best-practices-in-api-design/)
- [[6] Microsoft API design guidance](https://docs.microsoft.com/en-us/azure/architecture/best-practices/api-design)
- [[7] Microsoft Web API implementation](https://docs.microsoft.com/en-us/azure/architecture/best-practices/api-implementation)
- [[8] Hackernoon RESTful API Designing guidelines — The best practices](https://hackernoon.com/restful-api-designing-guidelines-the-best-practices-60e1d954e7c9)
- [[9] REST API Tutorial](https://restfulapi.net/)
- [[10] HTTP headers (MDN)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers)
- [[11] HTTP status codes (MDN)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
