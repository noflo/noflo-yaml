---
title: Full-Stack Flow-Based Programming
categories:
  - fbp
  - desktop
  - mobility
location: Berlin, Germany
layout: post
---
The idea of [Full-Stack Development](http://coding.smashingmagazine.com/2013/11/21/introduction-to-full-stack-javascript/) is quite popular at the moment &mdash; building things that run both the browser and the server side of web development, usually utilizing similar languages and frameworks.

With Flow-Based Programming and the emerging [Flowhub](http://flowhub.io/) ecosystem, we can take this even further. Thanks to the [FBP network protocol](http://noflojs.org/documentation/protocol/) we can build and monitor graphs spanning multiple devices and flow-based environments.

[Jon Nordby](http://jonnor.com/) gave a [Flow-Based Programming talk in FOSDEM](https://fosdem.org/2014/schedule/event/deviot02/) Internet of Things track last weekend. His demo was running a FBP network comprising of three different environments that talk together. You can [find the talk online](http://mirrors.dotsrc.org/fosdem/2014/AW1121/Sunday/Flowbased_programming_for_heterogeneous_systems.webm).

<video controls src="http://mirrors.dotsrc.org/fosdem/2014/AW1121/Sunday/Flowbased_programming_for_heterogeneous_systems.webm"></video>

Here are some screenshots of the different graphs.

[MicroFlo](http://microflo.org/) running on an Arduino Microcontroller and monitoring a temperature sensor:

[![MicroFlo on Arduino](/files/fullstack-microcontroller-small.png)](/files/fullstack-microcontroller.png)

[NoFlo](http://noflojs.org/) running on Node.js and communicating with the Arduino over a serial port:

[![NoFlo on Node.js](/files/fullstack-server-embedded-small.png)](/files/fullstack-server-embedded.png)

NoFlo running in browser and communicating with the Node.js process over WebSockets:

[![NoFlo on browser](/files/fullstack-browser-small.png)](/files/fullstack-browser.png)

*(click to see the full-size picture)*

## Taking this further

While this setup already works, as you can see the three graphs are still treated separately. The next obvious step will be to utilize the [subgraph features](http://noflojs.org/) of NoFlo UI and allow different nodes of a graph represent different runtime environments.

This way you could introspect the data passing through all the wires in a single UI window, and "zoom in" to see each individual part of the system.

The FBP ecosystem is growing all the time, with different runtimes popping up for different languages and use cases. While NoFlo's JavaScript focus makes it part of the [Universal Runtime](http://bergie.iki.fi/blog/the_universal_runtime/), there are many valid scenarios where other runtimes would be useful, especially on mobile, embedded, and desktop.

## Work to be done

Interoperability between them is an area we should focus on. The [network protocol](http://noflojs.org/documentation/protocol/) needs more scrutiny to ensure all scenarios are covered, and more of the FBP/dataflow systems need to integrate it.

Some steps are already being taken in this direction. After Jon's session in FOSDEM we had a nice meetup discussing better integration between MicroFlo on microcontrollers, NoFlo on browser and server, and [Lionel Landwerlin's](https://github.com/djdeath) work on porting [NoFlo to the GNOME desktop](http://bergie.iki.fi/blog/noflo-and-gnome/).

![Full-stack FBP discussions at FOSDEM 2014](/files/fullstack-meetup.jpg)

If you're interested in collaborating, please [get in touch](http://noflojs.org/support/)!

*Photo by [Forrest Oliphant](http://www.flickr.com/photos/forresto/12268512046/).*
