document.addEventListener("turbo:load", function() {	
	/* Table of content show hide  */
	$(".toc_toggle").on("click",function(){
		var active_text = $(this).text();
		$(this).text($(this).data('text'));
		$(this).data('text', active_text);
	})

	/* back to top */
	var $backToTop = $("#btn-back-to-top");
	$backToTop.hide();
	$(document).on('scroll', function() {
		if ($(this).scrollTop() > 100) {
			$backToTop.fadeIn();
		} else {
			$backToTop.fadeOut();
		}
	});

	$backToTop.on('click', function(e) {
		$("html, body").animate({scrollTop: 0}, 200);
	});

	/* copy url */
	$("#copy-url").click(function(){
		var button = $(this);
		$("body").append(`<textarea id="gocopy">${button.data('url')}</textarea>`);
		$("#gocopy").select();
		document.execCommand('copy');
		$("#gocopy").remove();
		xsetting.toast('dark', button.data('text'));
	})	
});	

document.addEventListener("turbo:load", function() {	
	Promise.all([ js_stickysidebar ]).then(() => {

		/* section */
		if ($(".topic-section").length > 0) { 

			var stickySidebar = new StickySidebar('#content-sidebar', {
				topSpacing: 10,
				bottomSpacing: 10,
				containerSelector: '#main-content',
				innerWrapperSelector: '.topic-section'
			});

			/* clone section */
			var sectionHasClone = false;
			$(".section-mobile").on("click", function(){
				if (!sectionHasClone) {
					$(".section-copy").html($(".topic-section").clone());				
					sectionHasClone = true;
				}

				// focus
				$(".submenu-link.active").focus();
			})
		}		

	});
});	

document.addEventListener("turbo:load", function() {
	Promise.all([ js_highlightjs1,js_highlightjs2,js_highlightjs4  ]).then(() => {

		/* hljs */
		hljs.addPlugin(new CopyButtonPlugin());
		hljs.highlightAll();
		setTimeout(function(){
			
			/* line number */
			hljs.initLineNumbersOnLoad();

			/* line hihglight */
			var lightCode = $('pre').map(function(i,v) {
				return [$(this).data('light') ?? []];
			}).toArray();
			hljs.highlightLinesAll(lightCode);
		}, 100)

		/* pre show more */ 
		/* taken from : https://blog.csdn.net/yhm_brave/article/details/84988907 */ 
		$("#post-content").find("pre").each(function(i,value) {
			if ($(value).hasClass("code-hide")) {
				$(value).append(`
					<div class="hide-box">
					<i class="bi bi-caret-down-square show-box"></i>
					</div>
					`)
			}
		})

		$(".show-box").on("click", function() {
			$(this).parents("pre").removeClass("code-hide");
			$(this).parents(".hide-box").hide().remove();
			$(window).resize().scroll();
		})		

	});
});		