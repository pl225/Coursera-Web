$(() => {
	$('#navbar-toggle').blur((event) => {
		var screenWidth = window.innerWidth;
		if (screenWidth < 768) {
			$('#collapsable-nav').collapse('hide');
		}
	})
});

// ajaxload.info
(function (global) {
	
	var dc = {};
	var homeHTML = "snippets/home-snippet.html";
	var allCategoriesUrl = "https://davids-restaurant.herokuapp.com/categories.json";
	var categoriesTitleHtml = "snippets/categories-title-snippet.html";
	var categoryHtml = "snippets/category-snippet.html";

	var insertHTML = function (selector, html) {
		var targetElem = document.querySelector(selector);
		targetElem.innerHTML = html;
	};

	var insertProperty = function (string, propName, propValue) {
		var propToReplace = `{{${propName}}}`;
		string = string.replace(new RegExp(propToReplace, 'g'), propValue);
		return string;
	}

	var showLoading = function (selector) {
		var html = "<div class=\"text-center\">";
		html += "<img src=\"images/ajax-loader.gif\"></div>";
		insertHTML(selector, html);
	};

	document.addEventListener("DOMContentLoaded", (event) => {
		showLoading('#main-content');
		$ajaxUtils.sendGetRequest(
			homeHTML,
			(responseText) => {
				document
					.querySelector('#main-content')
					.innerHTML = responseText;

			},
			false
		);
	});

	dc.loadMenuCategories = function () {
		showLoading('#main-content');
		$ajaxUtils.sendGetRequest(
			allCategoriesUrl,
			buildAndShowCategoriesHtml
		)
	};

	function buildAndShowCategoriesHtml(categories) {
		$ajaxUtils.sendGetRequest(
			categoriesTitleHtml,
			function (categoriesTitleHtml) {
				$ajaxUtils.sendGetRequest(
					categoryHtml,
					function (categoryHtml) {
						var categoriesViewHtml = buildCategoriesHtml(
							categories,
							categoriesTitleHtml,
							categoryHtml
						);
						insertHTML('#main-content', categoriesViewHtml);
					},
					false
				)
			},
			false
		)
	}

	function buildCategoriesHtml(categories, categoriesTitleHtml, categoryHtml) {
		
		var finalHtml = categoriesTitleHtml;
		finalHtml += "<section class =\"row\">";

		for (var i = 0; i < categories.length; i++) {
			var html = categoryHtml;
			var name = categories[i].name;
			var shortName = categories[i].short_name;
			html = insertProperty(html, "name", name);
			html = insertProperty(html, 'short_name', shortName);
			finalHtml += html;
		}

		return finalHtml + '</section>';
	}

	global.$dc = dc;

})(window);