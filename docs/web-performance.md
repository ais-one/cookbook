# Web Performance

1. use HTTP2
- enabled on server level

2. 3rd Party Requests
- risks of 3rd party static assets
  - security
  - downtime
  - network negotiation
  - loss or priority ?
- convert 3rd party to 1st party (serve assets locally)
- self-hosted forms also...

3. image resizing
- png to jpg (or a better format)
- one size of desktop, one size for mobile
- ...srcset
  - resolution switching
  <img srcset="elva-fairy-480w.jpg 480w,
             elva-fairy-800w.jpg 800w"
     sizes="(max-width: 600px) 480px,
            800px"
     src="elva-fairy-800w.jpg"
     alt="Elva dressed as a fairy">
  - art direction
  <picture>
    <source media="(max-width: 799px)" srcset="elva-480w-close-portrait.jpg">
    <source media="(min-width: 800px)" srcset="elva-800w.jpg">
    <img src="elva-800w.jpg" alt="Chris standing up holding his daughter Elva">
  </picture>

4. image optimization
- reduce quality
- progressive jpg
- better formats e.g. webp
- gif to mp4 / webm
  <video controls width="250">
      <source src="/media/cc0-videos/flower.webm" type="video/webm">
      <source src="/media/cc0-videos/flower.mp4" type="video/mp4">
      Sorry, your browser doesn't support embedded videos.
  </video>

5. resource hints
- head -> <link rel="dns-prefetch" href="https://some.3pl-or-Cdn.com">
- head -> <link rel="preconnect" href="https://some.3pl-or-Cdn.com">
- head -> <link rel="prefetch" href="https://some.3pl-or-Cdn.com"> // not on safari
- head -> <link rel="preload" href="https://some.3pl-or-Cdn.com/somefile.js" as="script"> // not on safari
- head -> <link rel="prerender" href="https://example.com/another-page"> // not good support

6. async/ defer
- defer: JS exec until HTML fully parsed (script is no longer render blocking)
- async: JS exec as soon as possible, parallel to HTML parsing (JS does not require complete DOM, or dependency on other script being loaded)

7. text compression - works better on larger files
- gzip / brotli (faster but less compression)
- supported by server

8. text asset optimization
- bundling of html/js/css

9. critical CSS
- extract critical css
- cover for desktop and mobile


10. Above the fold
- preload resources above the fold
  - e.g. images above the fold

11. google fonts optimization
- preconnect to fonts.gstatic.com domain, add crossorigin attribute

12. self host fonts & tree shake icons
- @font-face { font-display: swap
- preload of fonts (because self hosted) still makes performance worse, so dont preload fonts
- use system fonts instead of self hosted fonts

13. lazy loading
- intersection observer
- loading="lazy" //  check browser support
  - images 
  - iframe
- set width & height attributes of images

14. remove unused css / js

15. caching strategies (server side caching)