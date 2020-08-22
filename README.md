# nodejs-hmr

## A nodejs hot module reload 

### First Step

Add in the first line of code

```js
import hot from 'nodejs-hmr';

// initilaize hot reload api
hot.run();

// or 
// hot.run({ cwd:path.resolve('xx/xx') })

```

### Second Step

By default, if a module change is detected again, the modified module will be reloaded in turn, and the parent module that references this module will also be reloaded.


#### Life cycle

```js
// preload ---> preend ---> accept ---> postend
```

#### preload

Triggered before reloading the module, the event will be dispatched to all parent modules that reference this module

> xxx.js

```js

import hot from 'nodejs-hmr';

hot
  .create(module)
  .preload((old)=>{
    // do somthing at pre reload module
  })
  .preend((old)=>{
    // on preload end
  })

```

##### accept

Accept child module change,

If the change module defines the `accept` function, the parent module will stop reloading.


>  xxx.js

```js

import hot from 'nodejs-hmr';

hot
  .create(module)
  .accept((newModule,oldModule)=>{
    // do somehting
  })

```

##### postend

```js

import hot from 'nodejs-hmr';

hot
  .create(module)
  .postend((newModule,oldModule)=>{
    // do somehting
  })

```

