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
	var menuItemsUrl ="https://davids-restaurant.herokuapp.com/menu_items.json?category=";
	var menuItemsTitleHtml = "snippets/menu-items-title.html";
	var menuItemHtml = "snippets/menu-item.html";

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

	var switchMenuToActive = function () {

		var classes = document.querySelector("#navHomeButton").className;
		classes = classes.replace(new RegExp("active", "g"), "");
		document.querySelector("#navHomeButton").className = classes;

		classes = document.querySelector("#navMenuButton").className;
		if (classes.indexOf("active") == -1) {
		    classes += " active";
		    document.querySelector("#navMenuButton").className = classes;
		}
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
		);
	};

	dc.loadMenuItems = function (categoryShort) {
		showLoading('#main-content');
		$ajaxUtils.sendGetRequest(
			menuItemsUrl + categoryShort,
			buildAndShowMenuItemsHtml
		);
	};

	function buildAndShowCategoriesHtml(categories) {
		$ajaxUtils.sendGetRequest(
			categoriesTitleHtml,
			function (categoriesTitleHtml) {
				$ajaxUtils.sendGetRequest(
					categoryHtml,
					function (categoryHtml) {

						switchMenuToActive();

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

	function buildAndShowMenuItemsHtml(categoryMenuItems) {
		$ajaxUtils.sendGetRequest(
			menuItemsTitleHtml,
			function (menuItemsTitleHtml) {
				$ajaxUtils.sendGetRequest(
					menuItemHtml,
					function (menuItemHtml) {

						switchMenuToActive();

						var menuItemsViewHtml = buildMenuItemsHtml(
							categoryMenuItems,
							menuItemsTitleHtml,
							menuItemHtml
						);
						insertHTML('#main-content', menuItemsViewHtml);
					},
					false
				)
			},
			false
		)
	}

	function buildMenuItemsHtml(categoryMenuItems, menuItemsTitleHtml, menuItemHtml) {
		
		menuItemsTitleHtml = insertProperty(menuItemsTitleHtml, 'name', categoryMenuItems.category.name);
		menuItemsTitleHtml = insertProperty(menuItemsTitleHtml, 'special_instructions', categoryMenuItems.category.special_instructions);

		var finalHtml = menuItemsTitleHtml + "<section class=\"row\">";

		var menuItems = categoryMenuItems.menu_items;
		var catShortName = categoryMenuItems.category.short_name;

		for (var i = 0; i < menuItems.length; i++) {
			
			var html = menuItemHtml;
			html = insertProperty(html, 'short_name', menuItems[i].short_name);
			html = insertProperty(html, 'catShortName', catShortName);
			html = insertItemPrice(html, 'price_small', menuItemHtml[i].price_small);
			html = insertItemPortionName(html, 'small_portion_name', menuItems[i].small_portion_name);
			html = insertItemPrice(html, 'price_large', menuItems[i].price_large);
			html = insertItemPortionName(html, "large_portion_name", menuItems[i].large_portion_name);
			html = insertProperty(html, "name", menuItems[i].name);
			html = insertProperty(html, "description", menuItems[i].description);

			if (i % 2 != 0) {
			  html += "<div class='clearfix visible-lg-block visible-md-block'></div>";
			}

			finalHtml += html;

		}

		return finalHtml + '</section>';
	}

	function insertItemPrice(html, pricePropName, priceValue) {
		if (!priceValue) {
			return insertProperty(html, pricePropName, "");
		}

		priceValue = '$' + priceValue.toFixed(2);
		html = insertProperty(html, pricePropName, priceValue);
		return html;
	}

	function insertItemPortionName(html, portionPropName, portionValue) {
	  
	  	if (!portionValue) {
	    	return insertProperty(html, portionPropName, "");
	  	}

		  portionValue = "(" + portionValue + ")";
	  	html = insertProperty(html, portionPropName, portionValue);
	  	return html;
	}

	global.$dc = dc;

})(window);