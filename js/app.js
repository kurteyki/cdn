let xsetting = {
	spinner : ` <div class="spinner-border spinner-border-sm button-spinner" role="status"></div>`,
	toast : function(status, message, useIcon = true, autohide = true) {

		let icon = ['danger','warning'].includes(status) ? '<i class="bi bi-exclamation-triangle-fill"></i>' : '<i class="bi bi-check"></i>';

		var html = `
		<div class="toast-container position-fixed bottom-0 start-0 p-3" style="z-index: 10000">
		<div class="toastElement toast align-items-center text-bg-${status} border-0" role="alert" aria-live="assertive" aria-atomic="true" data-bs-delay="5000" data-bs-autohide="${autohide}">
		<div class="d-flex">
		<div class="toast-body" style='overflow:auto'>
		${useIcon ? icon : ''}
		${message}
		</div>
		<button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
		</div>
		</div>
		</div>
		`;

		$("#toastWrapper").html(html);
		new bootstrap.Toast($(".toastElement")).show();
	},
	submit : {
		start : function(form){
			$("#message").empty();
			$("#result").empty();
			$("input, textarea, button, select", form).prop("disabled",true); 
			$(".button-submit").html($(".button-submit").html() + xsetting.spinner);
		},
		stop : function(form){
			$("input, textarea, button, select", form).prop("disabled",false); 
			$(".button-spinner").remove();
		},
		error : function(message){
			$("#message").html(`<div class="alert alert-danger text-break">${message}</div>`)
		}
	},
	submitToolbar : {
		start : function(){
			xsetting.toast('dark','Memproses...' + xsetting.spinner, false, false); 
		},
		error : function(err){
			alert(err);
			$("#toastWrapper").empty();
		},
	},
	formatRupiah : function(angka, prefix){
		var number_string = angka.replace(/[^,\d]/g, '').toString(),
		split           = number_string.split(','),
		sisa            = split[0].length % 3,
		rupiah          = split[0].substr(0, sisa),
		ribuan          = split[0].substr(sisa).match(/\d{3}/gi);
		if(ribuan){
			separator = sisa ? '.' : '';
			rupiah += separator + ribuan.join('.');
		}
		rupiah = split[1] != undefined ? rupiah + ',' + split[1] : rupiah;
		return prefix == undefined ? rupiah : (rupiah ? 'Rp ' + rupiah : '');
	},
	loadScript : function(uri){
		/* skip if has loaded */
		if ($('script[src*="' + uri +'"]').length > 0) return;
		return new Promise((resolve, reject) => {
			var tag = document.createElement('script');
			tag.src = uri;
			tag.async = true;
			tag.onload = () => {
				resolve();
			};
			var scriptTag = document.getElementsByTagName('script')[0];
			scriptTag.parentNode.insertBefore(tag, scriptTag);
		});
	}

}   

document.addEventListener("turbo:load", function() {

	/* load script after turbolink loaded page */

	var base_url = $("meta[name='base_url']").attr('content'),
	site_url = $("meta[name='site_url']").attr('content'),
	current_url = $("meta[name='current_url']").attr('content'),
	isPage = $("meta[name='isPage']").attr('content');

	/* search toggle focus */
	$('#navSearch').on('shown.bs.collapse', function() {
		$("#search-navbar input[name='q']").focus();
	})

	/* enable tooltip */
	const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
	const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

	/* footer collapse */
	var footerCollapse = false;
	if (!footerCollapse) {
		$("#footerToggle").html('<i class="bi bi-plus-square"></i>');		
		$("#footerToggle").on("click", function() {
			var button = $(this),
			collapseFooter = $("#collapseFooter");
			if (collapseFooter.hasClass('d-none')) {
				collapseFooter.removeClass('d-none');
				button.html('<i class="bi bi-dash-square"></i>');
			}else{
				collapseFooter.addClass('d-none');
				button.html('<i class="bi bi-plus-square"></i>');
			}      
		});     
		footerCollapse = true;
	}    	

}); 