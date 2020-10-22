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
   - [Main operations](#main-operations)
     - [Create a resource](#create-a-resource)
     - [Read resources](#read-resources)
     - [Read a single resource](#read-a-single-resource)
     - [Update a resource](#update-a-resource)
     - [Partially update a resource](#partially-update-a-resource)
     - [Delete a resource](#delete-a-resource)
     - [Check if a resource exists](#check-if-a-resource-exists)
     - [Sub-resources](#sub-resources)
     - [Complex operations](#complex-operations)
	 - [Bulk operations](#bulk-operations)
	 - [Asynchronous operations](#asynchronous-operations)
	 - [File uploads](#file-uploads)
   - [Error handling](#error-handling)
   - [API versioning](#api-versioning)
     - [Semantic versioning](#semantic-versioning)
     - [How to handle API versions](#how-to-handle-api-versions)
     - [Deprecation](#deprecation)
 - [Best practices](#best-practices)
    - [Naming conventions](#naming-conventions)
    - [Project structure](#project-structure)
    - [Errors](#errors)
    - [Code style](#code-style)
    - [Testing and overall quality](#testing-and-overall-quality)
    - [Security and going to production](#security-and-going-to-production)
 - [A sample project structure](#a-sample-project-structure)
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


## Main operations 

This section will describe how you can structure your API endpoints. For each operation, the following information will be given:
- A short description of the purpose of the operation (e.g. what should we achieve when using POST, GET, etc..).
- A sample URL template.
- A sample request body, if applicable (we will concentrate on JSON representations).
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

#### URL format
```
POST /{version}/{collection}/{resource}
```

#### Request  sample
```
POST /v1/interests/books
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
The most common status codes that could be returned from a POST request are the following:
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

### Read resources
When we want to read resources, most of the time we must use the GET method. There might be other scenarios (like complex searches) when we could also use a POST request and utilize the request body for sending the query parameters. 
The response body should return a list of objects (representations of the resource). The representations for each object on the list must be the same (same type, same fields, same namings). 
The data that is returned is not supposed to be a list of all existing resources. Usually, it includes a subset of that data for which the client has read access. This means that different clients can get different responses, based on their permissions. 
Finally, for performance reasons (to save bandwidth), it is always advised to return a minimal representation of the resources. For a full representation, the client can always use the endpoints for reading individual resources. 

#### URL format
```
GET /{version}/{collection}/{resource}
```

#### Request  sample
```
GET /v1/interests/books
```

#### Response sample
```
{
  "status": 200,
  "body": [
    {
      "_id": "5e96bd5641971b0117987a43",
      "title": "1984",
      "author": "5e95e25b4d749e01161f92af",
      "pages": 328,
      "genre": "dystopian_fiction",
      "createdAt": "2020-10-15 07:52:54.829Z",
      "updatedAt": "2020-10-15 07:52:54.829Z"
    }
  ]
}
```

#### HTTP status codes
The most common status codes that could be returned from a GET request are the following:
- 200 Success: Most of the cases, either when there are results on the array, or when the array is empty.
- 400 Bad Request: This status is returned when the format of the request (e.g. query params) is not correct.
- 404 Not Found: When the resource is not found. This is returned only if the URL is not found. If the URL is correct and there are no results, we must return status 200 and an empty array of results.
- 422 Unprocessable Entity: This is returned when the params are correct, but the operation cannot be performed due to semantic errors. 
- 500 Internal Server Error.

#### Other notes
When reading resources, we usually send some query parameters to filter the results, to sort them, or for pagination purposes. Some of the most common query parameters would be:
- Sorting: `sort_by` (by which attribute should we sort) and `sort_order` (how should we sort, ascending or descending).
- Pagination: `skip` (from which index should we start reading) and `limit` (the page size, or how many results should we get back per request).
- Filter by time: `start_time` and `end_time` (or date). 

Another thing which needs to be mentioned is "projected responses". As stated above, REST APIs usually return a minimal representation of the resource, to save bandwidth. It is possible, however, that the client sends a list of attributes that he needs to get in the response. These are projected responses. To achieve this, the client must include an extra query parameter _(fields)_ which can be a comma-separated string or an array: 
```
GET /v1/interests/books?fields=title,genre
{
  "status": 200,
  "body": [
    {
      "title": "1984",
      "genre": "dystopian_fiction"
    }
  ]
}
```

### Read a single resource
This request is similar to the one above, but it returns one single object instead of a list and in most cases, the returned representation is much more detailed.

#### URL format
```
GET /{version}/{collection}/{resource}/{resource-id}
```

#### Request  sample
```
GET /v1/interests/books/5e96bd5641971b0117987a43
```

#### Response sample
```
{
  "status": 200,
  "body": {
    "_id": "5e96bd5641971b0117987a43",
    "title": "1984",
    "pages": 328,
    "genre": "dystopian_fiction",
    "publications": [{ 
      "_id": "5e96bd5641971b0117987a44", 
      "date": "1949-06-08" 
    }], 
    "images": [],
    "createdAt": "2020-10-15 07:52:54.829Z",
    "updatedAt": "2020-10-15 07:52:54.829Z",
    "author": {
      "_id": "5e95e25b4d749e01161f92af",
      "firstName": "George",
      "lastName": "Orwell"
    }
  }
}
```

#### HTTP status codes
The most common status codes that could be returned from a GET request for a single resource are the following:
- 200 Success: When the resource is found.
- 400 Bad Request
- 404 Not Found: When the resource on the given URL is not found.
- 422 Unprocessable Entity 
- 500 Internal Server Error

### Update a resource
To update an entire resource, the PUT method must be used. To avoid inconsistencies, when a PUT request is made, the body must contain all the fields of the model. There might be cases when not all attributes are allowed to be updated. In this case, they will be marked as readOnly in the validation schema.

#### URL format
```
PUT /{version}/{collection}/{resource}/{resource-id}
```

#### Request  sample
```
PUT /v1/interests/books/5e96bd5641971b0117987a43
{
  "title": "Nineteen Eighty-Four",
  "author": "5e95e25b4d749e01161f92af",
  "pages": 328,
  "genre": "dystopian_fiction",
  "publications": [{
    "date": "1949-06-08"
  }],
  "images": [],
  "createdAt": "2020-10-15 07:52:54.829Z",
  "updatedAt": "2020-10-15 07:52:54.829Z"
}
```

#### Response sample
```
{
  "status": 204
}
```

#### HTTP status codes
The most common status codes that could be returned from a PUT request are the following:
- 200 Success: Rare case. This status is returned only in those cases when there are some server-generated values during the update, and those values must be sent back to the client. In such scenarios, a 200 status and a response body would be appropriate.  
- 202 Accepted: This status is returned in case of asynchronous operations when you want to return control to the client and continue doing background work.
- 204 No Content: This is the standard success status for PUT requests. If we don't have any server-generated values that the client needs, we just send back a 204 and there is no need to echo the request body (this saves bandwidth).
- 400 Bad Request
- 404 Not Found
- 422 Unprocessable Entity
- 500 Internal Server Error

#### Other notes
Apart from updating the entire resource, PUT is sometimes used for updating one single attribute from a resource. However, this should not be confused with partial updates (where we must use PATCH). If we want to update a single attribute, the URL must point to that attribute which will be updated. This way, that specific attribute becomes a resource on its own. 
This can happen if the update on this specific attribute requires a complex logic to be implemented. Instead of overloading the PATCH endpoint on the main resource, we consider this attribute as a new resource and implement a PUT endpoint on it. 
Example: `PUT /v1/interests/books/5e96bd5641971b0117987a43/author`

### Partially update a resource
Sometimes it is not necessary to update a whole resource. You just need to update a couple of fields and you don't want to send the whole body for that. In these cases, PATCH is more appropriate to use than PUT. Among other advantages, PATCH also saves bandwidth, especially when the target resource is big.

#### URL format
```
PATCH /{version}/{collection}/{resource}/{resource-id}
```

#### Request  sample
```
PATCH /v1/interests/books/5e96bd5641971b0117987a43
{
  "title": "Nineteen Eighty-Four (1984)"
}
```

#### Response sample
```
{
  "status": 204
}
```

#### HTTP status codes
The most common status codes that could be returned from a PATCH request are the following:
- 200 Success: Rare case. This status is returned only in those cases when the client needs the new representation. We return 200 and the updated object in the response body.  
- 204 No Content: This is the standard success status for PATCH requests.
- 400 Bad Request
- 404 Not Found
- 422 Unprocessable Entity
- 500 Internal Server Error

#### Other notes
The method that was explained above for PATCH-ing resources is called "JSON Merge Patch". Its purpose is to send a request body where you specify the new value that the attribute will have after the request is done. The only supported operation you could do on an attribute is updating its value. The standard also shows a convention about deleting a value from the resource, which can be achieved by setting the value of the attribute to null. So, the request shown below would update the title of the book, it would delete the value of the "genre" field, and it would add a new book release:
```
PATCH /v1/interests/books/5e96bd5641971b0117987a43
{
  "title": "Nineteen Eighty-Four (1984)",
  "genre": null,
  "publications": [
    {
      "date": "1949-06-08"
    },
    {
      "date": "1950-07-01"
    }
  ],
}
```
For simple updates, the merge path approach would be enough. However, for more complex operations there is another more advanced standard called "JSON Patch". In JSON Patch, you define a JSON with the instructions on how to update a specific attribute and you also define the order of the operations. All operations must be executed atomically. For each field you want to update, you must define the type of the operation, the path of the attribute within the resource, and the new value (if applicable for the operation). The operations defined in the standard are: _add, remove, replace, move, copy, test_. To achieve the same result as above, but this time using JSON Patch, we would send the following request:
```
PATCH /v1/interests/books/5e96bd5641971b0117987a43
[
  {
    "op": "replace",
    "path": "/title",
    "value": "Nineteen Eighty-Four (1984)"
  },
  {
    "op": "remove",
    "path": "/genre"
  },
  {
    "op": "add",
    "path": "/publications",
    "value": [{
      "date": "1950-07-01"
    }]
  }
]
```
More information about both standards can be found at [12].

### Delete a resource
The DELETE endpoints are used to delete a resource identified by the given URL. If the operation is successful, the server should respond with a 204 status and return no content. If the resource does not exist or has been deleted previously, all subsequent requests can either return 204 or 404 to emphasize that the resource is not found. There is no standard rule for this case. The important thing is that the state of the system is not modified with every request, which makes DELETE idempotent.  

#### URL format
```
DELETE /{version}/{collection}/{resource}/{resource-id}
```

#### Request  sample
```
DELETE /v1/interests/books/5e96bd5641971b0117987a43
```

#### Response sample
```
{
  "status": 204
}
```

#### HTTP status codes
The most common status codes that could be returned from a DELETE request are the following:
- 200 Success: Rare case. This status is returned only in those cases when there is some server-generated value that the client needs after the delete.
- 204 No Content: This is the standard success status for DELETE requests.
- 400 Bad Request
- 404 Not Found
- 422 Unprocessable Entity
- 500 Internal Server Error

### Check if a resource exists
Sometimes we don't need to get a whole resource representation. We just need to know if it exists or not. In these cases, it is advised to use HEAD and return a 200 status if the resource exists, or a 404 if it doesn't. 

#### URL format
```
HEAD /{version}/{collection}/{resource}/{resource-id}
```

#### Request  sample
```
HEAD /v1/interests/books/5e96bd5641971b0117987a43
```

#### Response sample
```
{
  "status": 200
}
```

#### HTTP status codes
The most common status codes that could be returned from a HEAD request are the following:
- 200 Success: When the requested resource exists.
- 400 Bad Request
- 404 Not Found
- 422 Unprocessable Entity
- 500 Internal Server Error

### Sub-resources
Resources can have relations between them. If we want to expose the associations, we could use subresources. <br />
Examples:
```
POST /{version}/{collection}/{resource}/{resource-id}/{sub-resource}
GET /{version}/{collection}/{resource}/{resource-id}/{sub-resource}
GET /{version}/{collection}/{resource}/{resource-id}/{sub-resource}/{sub-resource-id}
PUT /{version}/{collection}/{resource}/{resource-id}/{sub-resource}/{sub-resource-id}
DELETE /{version}/{collection}/{resource}/{resource-id}/{sub-resource}/{sub-resource-id}
```
In practice, it is not advised to build an entire API around the concept of subresources. Instead, it is much more practical to consider the sub-resources as resources on their own.<br /> <br />
From Microsoft guidelines for building REST API:<br />
In more complex systems, it can be tempting to provide URIs that enable a client to navigate through several levels of relationships, such as `/customers/1/orders/99/products`. However, this level of complexity can be difficult to maintain and is inflexible if the relationships between resources change in the future. Instead, try to keep URIs relatively simple. Once an application has a reference to a resource, it should be possible to use this reference to find items related to that resource. The preceding query can be replaced with the URI `/customers/1/orders` to find all the orders for customer 1, and then `/orders/99/products` to find the products in this order [6].

### Complex operations
These are operations that create/update/delete multiple resources in a single request, or handle a very complicated business logic that is not necessarily related to one resource specifically. Some examples of these kinds of operations are (taken from Paypal standards [3]):
- When we have to build a processing function based on a set of inputs from the client.
- When we need to combine many operations over some resources and execute them atomically (e.g. create a new resource, update an existing one, and delete a third one, all within the same request). 
- When we have to implement some complex business logic and we want to hide internal details from the client.

Regarding the naming of these types of operations, it is easier to use verbs rather than nouns (violating the standards for RESTful APIs). Some examples of such verbs could be "confirm", "accept", "reject", "search", "cancel", etc...<br />
The default HTTP method that should be used in these cases is POST. If we need to make the response cacheable, we could use GET.

#### URL format
```
POST /{version}/{collection}/{resource}/{action}
```

#### HTTP status codes
The most common status codes that could be returned from these complex operations are:
- 200 Success: This is the default success code and the response should also include a body describing the result of the operation.
- 201 Created: When the operation leads to the creation of a resource. If the operation creates one or more resources and it is not possible to express them as a composite record, the 200 status could be used.
- 204 No Content: When there is nothing to return in the body. 
- 4xx: For client errors.
- 5xx: Internal errors.

### Bulk operations
Sometimes it is better to create/update/delete multiple resources within the same request instead of doing many HTTP requests. It could be easier for the client and more performant at the same time since the network latency is added only once. The request body should contain all the necessary information for performing the operation on all the resources. The response body would ideally return a similar response, with the status (success or failure) for each resource.

#### URL format
```
POST /{version}/{collection}/{resource}/bulk
```

#### Request  sample
```
POST /v1/interests/books/bulk
[
  {
    "title": "Crime and Punishment",
    "author": "5e95e25b4d749e01161f92ag",
    "pages": 671,
    "genre": "psychological-fiction",
    "publications": [{
      "date": "1866-01-01"
    }]
  },
  {
    "title": "The Trial",
    "author": "5e95e25b4d749e01161f92ah",
    "pages": 255,
    "genre": "absurdist-fiction",
    "publications": [{
      "date": "1925-01-01"
    }]
  }
]
```

#### Response sample
```
{
  "status": 200,
  "body": [
    {
      status: "SUCCESS",
      result: {
        "_id": "5e96bd5641971b0117987a44",
        "title": "Crime and Punishment",
        "author": "5e95e25b4d749e01161f92ah",
        "pages": 671,
        "genre": "psychological-fiction",
        "publications": [{
          "_id": "5e96bd5641971b0117987a45",
          "date": "1866-01-01"
        }],
        "images": [],
        "createdAt": "2020-10-18 07:52:54.829Z",
        "updatedAt": "2020-10-18 07:52:54.829Z"
      }
    },
    {
      status: "ERROR",
      result: {
        "code": 10000,
        "message": "A record with the same name already exists"
      }
    }
  ]
}
```

#### HTTP status codes
The most common status codes that could be returned from a bulk POST request are the following:
- If the operation is transactional (all or nothing), regular POST status codes can be used. 
- If we need to support partial failures, 200 status code should be returned,  including a detailed payload with the result of each resource.
- If there is support for asynchronous operations, 202 must be returned.

### Asynchronous operations
Some types of operations may require a long time to complete (e.g. heavy processing,  analytics, file uploads, etc...). In order to avoid long delays for the client (or timeouts), we could use the asynchronous pattern. Async operations could be applied to any HTTP method. The basic idea is that once the server receives the request with all the necessary information, it immediately returns a "202 Accepted" status and continues to process the request asynchronously. Apart from that, the server must offer a way for the client to know the progress of the operation. There are two cases:
- If the operation is a resource creation (i.e. a POST request), the server must return a generated id that the client can use to retrieve the resource once it is created. Until the resource is ready, the server could respond with a "404 Not Found" status.
- For all the other types of operations, the server should offer an endpoint where the client can do polling to get the current status of the operation. Optionally, the server could also notify the client once the operation is finished (e.g. using sockets or push notifications).

### File uploads
Uploading files is a common functionality in most APIs. There are many ways to do this in a RESTful API:
- Using base64 encoding and treating files like normal fields in a JSON request body: This is the easiest way and it is great for handling small files. When it comes to larger files, however, it is not suggested since it causes performance problems. A base64 representation is 30% bigger in size compared to the original file. In addition, encoding and decoding the file requires time both in the client and in the server.
- Using dedicated endpoints for uploading files as _multipart/form-data_: The client sends the first request to the file upload endpoint. If the operation succeeds, the server responds with the metadata of the file (e.g. url, size, name, type, etc...). Next, the client can use the metadata in subsequent requests.
- Using the same endpoint for uploading files and sending other body parameters: In these cases, we could use a mixed content type. The first part of the request body would be a JSON _(Content-Type: application/json)_ with the normal attributes. The second part would be the binary representation of the file _(e.g. Content-Type: image/jpeg)_. 

## Error handling

Every endpoint we implement must do exception handling. Errors and exceptions happen all the time, so the purpose of the programmer is to catch them and return them as a response to the client. The error should contain enough information for the client to understand what happened, so it should be meaningful and human-readable. On the other hand, the error should be logged somewhere and it needs to be read and understood by machines. So, the way we represent errors must cover both cases. 

### Schema
A good and flexible representation for errors in REST APIs, based on many existing models, would be the following:
- _code_: A unique identifier, which can be an integer or a hash. It will be used to identify the error (we can use only the status code for that since we can have multiple errors with the same status). 
- _name_: The type of the error (usually the name of the HTTP status code).
- _message_: A human-readable message, describing the error in general.
- _details_: This field could be an array or an object with more detailed information on the error. For example, if this is a validation error (i.e. status 400), the details field would be an array of objects, where each item would represent an invalid field and the validation error for that. If this is another error (i.e. thrown from a third-party library or service), we could put the error string as returned by the library to the details field.

## API versioning

APIs change rapidly. Business requirements might change, the data model can change, the relationships between resources might change. The process of making the changes is not difficult, but making the changes and taking into consideration how they affect the clients could be tricky. The API developers do not have control over client applications most of the time. The purpose is to evolve the API, so the clients can take advantage of the new features, but at the same time, it is essential to allow current clients to still work with the API, despite the changes.

### Semantic versioning
Semantic versioning is a set of practical rules and standards on how we can manage our application's versions. It is widely accepted as the standard way by most programmers. The standard is simple and it is based on the following rules:<br /><br/>
Given a version number _MAJOR.MINOR.PATCH_, increment the:

1.  _MAJOR_ version when you make incompatible API changes,
2.  _MINOR_ version when you add functionality in a backward-compatible manner, and
3.  _PATCH_ version when you make backward-compatible bug fixes.

Additional labels for pre-release and build metadata are available as extensions to the _MAJOR.MINOR.PATCH_ format [13].

### How to handle API versions
Semantic versioning is what we should use to handle our application versioning internally. However, we cannot expose all that level of detail to the client. The client is concerned only with changes that break their current logic, so it is more than enough for an API to expose just the major version. <br /><br />
There are many ways how we can deal with API versioning [6]:
- Do not expose API versions at all: This is OK if our changes are always backward-compatible. So, if we keep adding new fields to a response body and the client can ignore all of the fields that it doesn't need, there is no problem at all. The problems occur if the changes are not backward-compatible (i.e. if we remove a field from a response body). 
- URI versioning: This is how we have presented the examples until now. The major API version is attached to the URI (usually at the beginning of the path). Whenever we make a breaking change, we increment the version in the URI. To offer backward-compatibility for existing consumers of the API, we continue to operate old endpoints, returning the resources that match the original schema.
- Query string versioning: This is very similar to URI versioning, but in this case, we don't have many different URIs for each version. Instead, we send the version as a query string parameter. 
- Header versioning: This approach does not rely on the URI at all. The version is sent as a custom header (e.g. Custom-Header: api-version=1).

### Deprecation

One way to handle breaking changes in an API is the one explained above, to release a new major API version and wait for the clients to migrate while keeping the old versions live till the last client has adapted the changes. However, many problems come with this approach.<br />
Firstly, clients are never willing to make changes. It might be costly for them to adopt an entirely new logic, both financially and regarding time.<br />
Secondly, it comes with extra costs for the API provider, because old API versions must be offered until all clients migrate to the new version. Supporting multiple versions at the same time needs separate hosting environments.<br />
Finally, the API might be offering several endpoints and the breaking changes may affect only a small part of the logic. So, it is not effective to release a new major version of the whole API, just because a few endpoints changed.<br /><br/> 
The solution would be to deprecate certain parts of the API and prevent new clients from using them while offering them for the existing clients for as long as the last client has finished the migration. This can be done in a minor version of the API. The deprecated element could be any of the following:
- An entire resource
- A method
- A parameter
- A query parameter
- A header
- A whole JSON request body
- An enum value

The deprecated part must be emphasized in the API documentation and the client must be notified of the deprecated elements even during runtime (e.g. by logging warnings when the API element is used). 

# Best practices

In this section, we will briefly mention some of the best practices you can follow while building a REST API in Node.js. Most of the content is taken from [4, 5, 7, 8].

## Naming conventions

### URIs
URIs have a specific structure:
```
Structure: {scheme}/{authority}/{path}/{query}/{fragment}
Example: https://example.com:8080/api/v1/books?name=1984#tag
```
Naming conventions for URIs [2]:
- URIs must use only lowercase letters.
- Literals/expressions in URI paths should be separated using a hyphen "-".
- Literals/expressions in query strings should be separated using underscore "_".
- Plural nouns should be used in the URI where appropriate to identify collections of data resources.

### Resources
The following rules must be considered when working with resources:
- Nouns must be used for resource names, not verbs.
- Resource names must be lower-case and use only alphanumeric characters and hyphens.
- Collection names must be plural.

### Fields
The following rules must be considered when declaring fields:
- Key names must be lower-case words, written in camel case.
- Prefix such as _is_ or _has_ should not be used for keys of type boolean.
- Fields that represent arrays should be named using plural nouns.

## Project structure

### Structure your code based on components
There are two ways how we can structure our code:
- Component-based: The whole logic regarding one component is in the same directory (e.g. in the same directory you could put the model, the controller, the authorization logic, routes' declaration, and the input validation logic).
- Role-based: Files are grouped by their technical role (e.g. we put routes in the same directory, controllers in another directory, models in a separate directory, and so on).

By grouping files based on components, code becomes more scalable and developers can work more easily.

### Separate Express 'app' and 'server'
Separate your 'Express' definition to at least two files: the API declaration (app.js) and the networking concerns (server.js). This allows testing the API in-process, without performing network calls, with all the benefits that it brings to the table: fast testing execution and getting coverage metrics of the code.

### Use environment aware, secure and hierarchical config
A perfect and flawless configuration setup should ensure:
- Keys can be read from a file and environment variable 
- Secrets are kept outside committed code (c) config is hierarchical for easier findability.

## Errors

### Use Async-Await or promises for async error handling
Handling async errors in callback style is probably the fastest way to hell (a.k.a the pyramid of doom). The best gift you can give to your code is using a reputable promise library or async-await instead which enables a much more compact and familiar code syntax like try-catch.

### Document API errors using Swagger
Let your API callers know which errors might come in return so they can handle these thoughtfully without crashing. For RESTful APIs, this is usually done with documentation frameworks like Swagger.

### Use a mature logger to increase error visibility
A set of mature logging tools will speed-up error discovery and understanding. So forget about console.log.

### Catch unhandled promise rejections
Any exception thrown within a promise will get swallowed and discarded unless a developer didn’t forget to explicitly handle it. Overcome this by registering to the _process.unhandledRejection_ event.

### Validate arguments using a dedicated library
Assert API input to avoid nasty bugs that are much harder to track later. The validation code is usually tedious unless you are using a very cool helper library like _ajv_ and _Joi_.

## Code style

### Use ESLint
ESLint is the de-facto standard for checking possible code errors and fixing code style, not only to identify nitty-gritty spacing issues but also to detect serious code anti-patterns like developers throwing errors without classification. On top of ESLint standard rules that cover vanilla JavaScript, add Node.js specific plugins like _eslint-plugin-node_, _eslint-plugin-mocha_, and _eslint-plugin-node-security_.

### Use naming conventions for variables, constants, functions and classes
Use _lowerCamelCase_ when naming constants, variables, and functions and _UpperCamelCase_ (capital first letter as well) when naming classes. This will help you to easily distinguish between plain variables/functions, and classes that require instantiation. Use descriptive names, but try to keep them short.

### Prefer const over let. Ditch the var
Using _const_ means that once a variable is assigned, it cannot be reassigned. Preferring _const_ will help you to not be tempted to use the same variable for different uses, and make your code clearer. If a variable needs to be reassigned, in a for loop, for example, use _let_ to declare it. Another important aspect of _let_ is that a variable declared using it is only available in the block scope in which it was defined. _Var_ is function scoped, not block-scoped, and shouldn't be used in ES6.

### Require modules first, not inside functions
Require modules at the beginning of each file, before and outside of any functions. This simple best practice will not only help you easily and quickly tell the dependencies of a file right at the top but also avoids a couple of potential problems.

### Use Async Await, avoid callbacks
Node 8 LTS now has full support for Async-await. This is a new way of dealing with asynchronous code which supersedes callbacks and promises. Async-await is non-blocking, and it makes asynchronous code look synchronous. The best gift you can give to your code is using async-await which provides a much more compact and familiar code syntax like try-catch.

### Use arrow function expressions
Though it's recommended to use async-await and avoid function parameters when dealing with older APIs that accept promises or callbacks - arrow functions make the code structure more compact and keep the lexical context of the root function.

### Other conventions
**Start a Codeblock's Curly Braces on the Same Line**: The opening curly braces of a code block should be on the same line as the opening statement.<br /><br />
**Separate your statements properly**: No matter if you use semicolons or not to separate your statements, knowing the common pitfalls of improper linebreaks or automatic semicolon insertion, will help you to eliminate regular syntax errors.<br /><br />
**Use the  `===`  operator**: Prefer the strict equality operator _===_ over the weaker abstract equality operator _==_. _==_ will compare two variables after converting them to a common type. There is no type conversion in _===_, and both variables must be of the same type to be equal.

## Testing and overall quality

### At the very least, write API (component) testing
Most projects just don't have any automated testing due to short timetables or often the 'testing project' ran out of control and was abandoned. For that reason, prioritize and start with API testing which is the easiest way to write and provides more coverage than unit testing (you may even craft API tests without code using tools like Postman. Afterward, should you have more resources and time, continue with advanced test types like unit testing, DB testing, performance testing, etc.

### Include 3 parts in each test name
Make the test speak at the requirements level so it's self-explanatory also to QA engineers and developers who are not familiar with the code internals. State in the test name what is being tested (unit under test), under what circumstances, and what is the expected result.

### Structure tests by the AAA pattern
Structure your tests with 3 well-separated sections: Arrange, Act & Assert (AAA). The first part includes the test setup, then the execution of the unit under test, and finally the assertion phase. Following this structure guarantees that the reader spends no brain CPU on understanding the test plan.

### Detect code issues with a linter
Use a code linter to check the quality and detect anti-patterns early. Run it before any test and add it as a pre-commit git-hook to minimize the time needed to review and correct any issue.

### Avoid global test fixtures and seeds, add data per-test
To prevent test coupling and easily reason about the test flow, each test should add and act on its own set of DB rows. Whenever a test needs to pull or assume the existence of some DB data - it must explicitly add that data and avoid mutating any other records.

### Check your test coverage, it helps to identify wrong test patterns
Code coverage tools like Istanbul/NYC are great for 3 reasons: it comes for free, it helps to identify a decrease in testing coverage, and last but not least it highlights testing mismatches: by looking at colored code coverage reports you may notice, for example, code areas that are never tested like catch clauses (meaning that tests only invoke the happy paths and not how the app behaves on errors). Set it to fail builds if the coverage falls under a certain threshold.

### Constantly inspect for vulnerable dependencies
Even the most reputable dependencies such as Express have known vulnerabilities. This can get easily tamed using community and commercial tools such as `npm audit` that can be invoked from your CI on every build.

### Inspect for outdated packages
Use your preferred tool (e.g. 'npm outdated' or 'npm-check-updates') to detect installed outdated packages, inject this check into your CI pipeline, and even make a build fail in a severe scenario. For example, a severe scenario might be when an installed package is 5 patch commits behind (e.g. local version is 1.3.1 and repository version is 1.3.8) or it is tagged as deprecated by its author - kill the build and prevent deploying this version.

### Refactor regularly using static analysis tools
Using static analysis tools helps by giving objective ways to improve code quality and keeps your code maintainable. You can add static analysis tools to your CI build to fail when it finds code smells. Its main selling points over plain linting are the ability to inspect quality in the context of multiple files (e.g. detect duplications), perform advanced analysis (e.g. code complexity), and follow the history and progress of code issues.

## Security and going to production

### Monitoring
Monitoring is a game of finding out issues before customers do – obviously, this should be assigned unprecedented importance. The market is overwhelmed with offers thus consider starting with defining the basic metrics you must follow, then go over additional fancy features and choose the solution that ticks all boxes.

### Increase transparency using smart logging
Logs can be a dumb warehouse of debug statements or the enabler of a beautiful dashboard that tells the story of your app. Plan your logging platform from day 1: how logs are collected, stored, and analyzed to ensure that the desired information (e.g. error rate, following an entire transaction through services and servers, etc) can really be extracted.

### Delegate anything possible (e.g. gzip, SSL) to a reverse proxy
Node is awfully bad at doing CPU intensive tasks like gzipping, SSL termination, etc. You should use ‘real’ middleware services like Nginx, HAproxy, or cloud vendor services instead.

### Utilize all CPU cores
At its basic form, a Node app runs on a single CPU core while all others are left idling. It’s your duty to replicate the Node process and utilize all CPUs – For small-medium apps you may use Node Cluster or PM2. For a larger app consider replicating the process using some Docker cluster (e.g. K8S, ECS) or deployment scripts that are based on the Linux init system (e.g. systemd).

### Embrace linter security rules
Make use of security-related linter plugins such as _eslint-plugin-security_ to catch security vulnerabilities and issues as early as possible, preferably while they're being coded. This can help to catch security weaknesses like using eval, invoking a child process, or importing a module with a string literal (e.g. user input).

### Avoid using the Node.js crypto library for handling passwords, use Bcrypt
Passwords or secrets (API keys) should be stored using a secure hash + salt function like _bcrypt_, which should be a preferred choice over its JavaScript implementation due to performance and security reasons.

### Escape HTML, JS and CSS output
Untrusted data that is sent down to the browser might get executed instead of just being displayed, this is commonly referred to as a cross-site-scripting (XSS) attack. Mitigate this by using dedicated libraries that explicitly mark the data as pure content that should never get executed (i.e. encoding, escaping).

### Validate incoming JSON schemas
Validate the incoming requests' body payload and ensure it meets expectations, fail fast if it doesn't. To avoid tedious validation coding within each route you may use lightweight JSON-based validation schemas such as _jsonschema_ or _joi_.

### Support blacklisting JWTs
When using JSON Web Tokens (for example, with _Passport.js_), by default there's no mechanism to revoke access from issued tokens. Once you discover some malicious user activity, there's no way to stop them from accessing the system as long as they hold a valid token. Mitigate this by implementing a blacklist of untrusted tokens that are validated on each request.

### Limit payload size using a reverse-proxy or a middleware
The bigger the body payload is, the harder your single thread works in processing it. This is an opportunity for attackers to bring servers to their knees without a tremendous amount of requests (DOS/DDOS attacks). Mitigate this by limiting the body size of incoming requests on the edge (e.g. firewall, ELB) or by configuring _express body parser_ to accept only small-size payloads.

# A sample project structure

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
- [12] [JSON Merge Patch](https://tools.ietf.org/html/rfc7386) and [JSON Patch](https://tools.ietf.org/html/rfc6902)
- [[13] Semantic Versioning](https://semver.org/)
