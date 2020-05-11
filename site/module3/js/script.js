$(() => {
	$('#navbar-toggle').blur((event) => {
		var screenWidth = window.innerWidth;
		if (screenWidth < 768) {
			$('#collapsable-nav').collapse('hide');
		}
	})
});