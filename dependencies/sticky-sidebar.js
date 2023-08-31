/**
* sticky-sidebar - A JavaScript plugin for making smart and high performance.
* @version v2.0
* @link https://github.com/abouolia/sticky-sidebar
* @author Ahmed Bouhuolia
* @license The MIT License (MIT)
**/
!function(){"use strict";function e(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}!function(e){for(var t=0,i=["webkit","moz"],n=e.requestAnimationFrame,s=e.cancelAnimationFrame,r=i.length;--r>=0&&!n;)n=e[i[r]+"RequestAnimationFrame"],s=e[i[r]+"CancelAnimationFrame"];n&&s||(n=function(e){var i=+new Date,n=Math.max(t+16,i);return setTimeout(function(){e(t=n)},n-i)},s=clearTimeout),e.requestAnimationFrame=n,e.cancelAnimationFrame=s}(window);var t=function(){function e(e,t){for(var i=0;i<t.length;i++){var n=t[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,i,n){return i&&e(t.prototype,i),n&&e(t,n),t}}(),i=function(){var i=".stickySidebar",n={topSpacing:0,bottomSpacing:0,containerSelector:!1,innerWrapperSelector:".inner-wrapper-sticky",stickyClass:"is-affixed",resizeSensor:!0,minWidth:!1};return function(){function s(t){var i=this,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};if(e(this,s),this.options=s.extend(n,r),this.sidebar="string"==typeof t?document.querySelector(t):t,void 0===this.sidebar)throw new Error("There is no specific sidebar element.");if(this.sidebarInner=!1,this.container=this.sidebar.parentElement,this.options.containerSelector){var o=document.querySelectorAll(this.options.containerSelector);if((o=Array.prototype.slice.call(o)).forEach(function(e,t){e.contains(i.sidebar)&&(i.container=e)}),!o.length)throw new Error("The container does not contains on the sidebar.")}this.affixedType="STATIC",this.direction="down",this.support={transform:!1,transform3d:!1},this._initialized=!1,this._breakpoint=!1,this._resizeListeners=[],this.dimensions={translateY:0,topSpacing:0,bottomSpacing:0,sidebarHeight:0,sidebarWidth:0,containerTop:0,containerHeight:0,viewportHeight:0,viewportTop:0,lastViewportTop:0},["_resizeListener"].forEach(function(e){i[e]=i[e].bind(i)}),this.initialize()}return t(s,[{key:"initialize",value:function(){if(this._setSupportFeatures(),this.options.innerWrapperSelector&&(this.sidebarInner=this.sidebar.querySelector(this.options.innerWrapperSelector),null!==this.sidebarInner&&(this.sidebarInner=!1)),!this.sidebarInner){var e=document.createElement("div");for(e.setAttribute("class","inner-wrapper-sticky"),this.sidebar.appendChild(e);this.sidebar.firstChild!=e;)e.appendChild(this.sidebar.firstChild);this.sidebarInner=this.sidebar.querySelector(".inner-wrapper-sticky")}null!==this.container&&(this.container=this.sidebar.parentElement),"function"!=typeof this.options.topSpacing&&(this.options.topSpacing=parseInt(this.options.topSpacing)||0),"function"!=typeof this.options.bottomSpacing&&(this.options.bottomSpacing=parseInt(this.options.bottomSpacing)||0),this._widthBreakpoint(),this.calcDimensions(),this.stickyPosition(),this.bindEvents(),this._initialized=!0}},{key:"bindEvents",value:function(){window.addEventListener("resize",this,{passive:!0}),window.addEventListener("scroll",this,{passive:!0}),this.sidebar.addEventListener("update"+i,this),this.options.resizeSensor&&(this.addResizerListener(this.sidebarInner,this),this.addResizerListener(this.container,this))}},{key:"handleEvent",value:function(e){this.updateSticky(e)}},{key:"calcDimensions",value:function(){if(!this._breakpoint){var e=this.dimensions;e.containerTop=s.offsetRelative(this.container).top,e.containerHeight=this.container.clientHeight,e.containerBottom=e.containerTop+e.containerHeight,e.sidebarHeight=this.sidebarInner.offsetHeight,e.sidebarWidth=this.sidebar.offsetWidth,e.viewportHeight=window.innerHeight,this._calcDimensionsWithScroll()}}},{key:"_calcDimensionsWithScroll",value:function(){var e=this.dimensions;e.sidebarLeft=s.offsetRelative(this.sidebar).left,e.viewportTop=document.documentElement.scrollTop||document.body.scrollTop,e.viewportBottom=e.viewportTop+e.viewportHeight,e.viewportLeft=document.documentElement.scrollLeft||document.body.scrollLeft,e.topSpacing=this.options.topSpacing,e.bottomSpacing=this.options.bottomSpacing,"function"==typeof e.topSpacing&&(e.topSpacing=parseInt(e.topSpacing(this.sidebar))||0),"function"==typeof e.bottomSpacing&&(e.bottomSpacing=parseInt(e.bottomSpacing(this.sidebar))||0)}},{key:"isSidebarFitsViewport",value:function(){return this.dimensions.sidebarHeight<this.dimensions.viewportHeight}},{key:"observeScrollDir",value:function(){var e=this.dimensions;if(e.lastViewportTop!==e.viewportTop){var t="down"===this.direction?Math.min:Math.max;e.viewportTop===t(e.viewportTop,e.lastViewportTop)&&(this.direction="down"===this.direction?"up":"down")}}},{key:"getAffixType",value:function(){var e=this.dimensions,t=!1;this._calcDimensionsWithScroll();var i=e.sidebarHeight+e.containerTop,n=e.viewportTop+e.topSpacing,s=e.viewportBottom-e.bottomSpacing;return"up"===this.direction?n<=e.containerTop?(e.translateY=0,t="STATIC"):n<=e.translateY+e.containerTop?(e.translateY=n-e.containerTop,t="VIEWPORT-TOP"):!this.isSidebarFitsViewport()&&e.containerTop<=n&&(t="VIEWPORT-UNBOTTOM"):this.isSidebarFitsViewport()?e.sidebarHeight+n>=e.containerBottom?(e.translateY=e.containerBottom-i,t="CONTAINER-BOTTOM"):n>=e.containerTop&&(e.translateY=n-e.containerTop,t="VIEWPORT-TOP"):e.containerBottom<=s?(e.translateY=e.containerBottom-i,t="CONTAINER-BOTTOM"):i+e.translateY<=s?(e.translateY=s-i,t="VIEWPORT-BOTTOM"):e.containerTop+e.translateY<=n&&(t="VIEWPORT-UNBOTTOM"),e.translateY=Math.max(0,e.translateY),e.translateY=Math.min(e.containerHeight,e.translateY),e.lastViewportTop=e.viewportTop,t}},{key:"_getStyle",value:function(e){if(void 0!==e){var t={inner:{},outer:{}},i=this.dimensions;switch(e){case"VIEWPORT-TOP":t.inner={position:"fixed",top:this.options.topSpacing,left:i.sidebarLeft-i.viewportLeft,width:i.sidebarWidth};break;case"VIEWPORT-BOTTOM":t.inner={position:"fixed",top:"auto",left:i.sidebarLeft,bottom:this.options.bottomSpacing,width:i.sidebarWidth};break;case"CONTAINER-BOTTOM":case"VIEWPORT-UNBOTTOM":var n=this._getTranslate(0,i.translateY+"px");t.inner=n?{transform:n}:{position:"absolute",top:i.containerTop+i.translateY}}switch(e){case"VIEWPORT-TOP":case"VIEWPORT-BOTTOM":case"VIEWPORT-UNBOTTOM":case"CONTAINER-BOTTOM":t.outer={height:i.sidebarHeight,position:"relative"}}return t.outer=s.extend({height:"",position:""},t.outer),t.inner=s.extend({position:"relative",top:"",left:"",bottom:"",width:"",transform:this._getTranslate()},t.inner),t}}},{key:"stickyPosition",value:function(e){if(!this._breakpoint){e=e||!1;this.options.topSpacing,this.options.bottomSpacing;var t=this.getAffixType(),n=this._getStyle(t);if((this.affixedType!=t||e)&&t){var r="affix."+t.toLowerCase().replace("viewport-","")+i;s.eventTrigger(this.sidebar,r),"STATIC"===t?this.sidebar.classList.remove(this.options.stickyClass):this.sidebar.classList.add(this.options.stickyClass);for(var o in n.outer){n.outer[o];this.sidebar.style[o]=n.outer[o]}for(var a in n.inner){var c="number"==typeof n.inner[a]?"px":"";this.sidebarInner.style[a]=n.inner[a]+c}var p="affixed."+t.toLowerCase().replace("viewport","")+i;s.eventTrigger(this.sidebar,p)}else this._initialized&&(this.sidebarInner.style.left=n.inner.left);this.affixedType=t}}},{key:"_widthBreakpoint",value:function(){window.innerWidth<=this.options.minWidth?(this._breakpoint=!0,this.affixedType="STATIC",this.sidebar.removeAttribute("style"),this.sidebar.classList.remove(this.options.stickyClass),this.sidebarInner.removeAttribute("style")):this._breakpoint=!1}},{key:"updateSticky",value:function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};this._running||(this._running=!0,function(t){requestAnimationFrame(function(){switch(t){case"scroll":e._calcDimensionsWithScroll(),e.observeScrollDir(),e.stickyPosition();break;case"resize":default:e._widthBreakpoint(),e.calcDimensions(),e.stickyPosition("resize"===t||!1)}e._running=!1})}(t.type))}},{key:"_setSupportFeatures",value:function(){var e=this.support;e.transform=s.supportTransform(),e.transform3d=s.supportTransform(!0)}},{key:"_getTranslate",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0;return this.support.transform3d?"translate3d("+e+", "+t+", "+i+")":!!this.support.translate&&"translate("+e+", "+t+")"}},{key:"addResizerListener",value:function(e,t){e.resizeListeners||(e.resizeListeners=[],this._appendResizeSensor(e)),e.resizeListeners.push(t)}},{key:"removeResizeListener",value:function(e,t){var i=e.resizeListeners.indexOf(t);if(this._resizeListeners.splice(i,1),null!==e.resizeListeners){var n=e.resizeTrigger;n.contentDocument.defaultView.removeEventListener("resize",this._resizeListener),n=n.remove()}}},{key:"_appendResizeSensor",value:function(e){var t=this;"static"===e.style.position&&(e.style.position="relative");var i=document.createElement("object");i.setAttribute("style","display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%;overflow: hidden; pointer-events: none; z-index: -1;");i.setAttribute("aria-label","sticky sidebar"),i.resizeElement=e,i.addEventListener("load",function(e){var i=e.currentTarget;i.contentDocument.defaultView.resizeTrigger=i.resizeElement,i.contentDocument.defaultView.addEventListener("resize",t._resizeListener)}),i.type="text/html",s.isIE()&&(i.data="about:blank"),e.resizeTrigger=i,e.appendChild(i)}},{key:"_resizeListener",value:function(e){var t=this,i=(e.target||e.srcElement).resizeTrigger;i.resizeListeners.forEach(function(n){"object"==typeof n&&(n=n.handleEvent,i=t),n.call(i,e)})}},{key:"destroy",value:function(){window.removeEventListener("resize",this._onResize),window.removeEventListener("scroll",this._onScroll),this.sidebar.classList.remove(this.options.stickyClass),this.sidebar.style.minHeight="",this.removeEventListener("update"+i,this.updateSticky);var e={position:"",top:"",left:"",bottom:"",width:"",transform:""};for(var t in e)this.sidebar.style[t]=e[t];this.options.resizeSensor&&(this.removeResizeListener(this.sidebarInner,this.updateSticky),this.removeResizeListener(this.container,this.updateSticky))}}],[{key:"isIE",value:function(){return Boolean(navigator.userAgent.match(/Trident/))}},{key:"supportTransform",value:function(e){var t=!1,i=e?"perspective":"transform",n=i.charAt(0).toUpperCase()+i.slice(1),s=["Webkit","Moz","O","ms"],r=document.createElement("support").style;return(i+" "+s.join(n+" ")+n).split(" ").forEach(function(e,i){if(void 0!==r[e])return t=e,!1}),t}},{key:"eventTrigger",value:function(e,t,i){if(window.CustomEvent)var n=new CustomEvent(t,{detail:i});else(n=document.createEvent("CustomEvent")).initCustomEvent(t,!0,!0,i);e.dispatchEvent(n)}},{key:"extend",value:function(e,t){var i={};for(var n in e)void 0!==t[n]?i[n]=t[n]:i[n]=e[n];return i}},{key:"offsetRelative",value:function(e){var t={left:0,top:0};do{var i=e.offsetTop,n=e.offsetLeft;isNaN(i)||(t.top+=i),isNaN(n)||(t.left+=n)}while(e=e.offsetParent);return t}}]),s}()}();window.StickySidebar=i,function(){if("undefined"!=typeof widow){var e=window.$||window.jQuery||window.Zepto;if(e){e.fn.stickySidebar=_jQueryPlugin,e.fn.stickySidebar.Constructor=i;var t=e.fn.stickySidebar;e.fn.stickySidebar.noConflict=function(){return e.fn.stickySidebar=t,this}}}}()}();