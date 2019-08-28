# micro-mvc

This package exposes two very basic classes that can be used create reactive MVC interfaces. 

Models are created from basic objects. Simply create an object with the desired properties, and instantiate the Model class with the object as the argument in the constructor: 

JavaScript 
```
let Model = mvc.Model;

let application = {
    name: 'My Application',
    version: '1.0.0'
};

let applicationModel = new Model(application);
``` 

The `applicationModel` above will encapsulate the raw object and provide getters and setters for its properites. Setters for the properties will trigger events for which a View listens. 

Views are established from a DOM object and existing models. It is assumed that the DOM is left unfilled, and upon construction, the View with force the model to emit an event that fills in all the data: 

HTML 
```
<div class="application-container">
    <p><span mvc-observes="name"></span> <span mvc-observes="version"></span></p>
</div>
``` 

JavaScript 
```
let View = mvc.View;

let applicationContainer = document.querySelector('.application-container');
let applicationView = new View(applicationContainer, applicationModel);
``` 

[View the demo here](https://christophergorexyz.github.io/micro-mvc/demo/)

