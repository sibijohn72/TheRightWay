//'use strict';

/* Directives */
angular.module('fcApp.directives').directive('appVersion', ['version',
function(version) {
	return function(scope, elm, attrs) {
		elm.text(version);
	};
}]).directive('execMessageRepeatDirective', function() {
	return function(scope, element, attrs) {
		if(scope.$last) {
			$(".Drildown").getReady({
				barColor : "#E7E7EE"
			});
			$('#DrildownMenuItem' + scope.vModel.openTab).click();
		}
	};
}).directive('rvPopup', function() {
	return {
		restrict : 'E',
		replace : false,
		templateUrl : 'app/templates/report-violation-popup.html'

	}
}).directive('policySummaryContent', ['$timeout',
function(timer) {
	return {
		transclude : true,
		link : function(scope, element, attrs) {
			function afterRender() {
				$.each($('.carousel-content div'), function(i, item) {
					$(item).attr('id', 'content' + i);
					$(item).hide();
				});
				$('.carousel-content div:first-child').show()
			}

			timer(afterRender.bind(element), 0);
		}
	};
}]).directive('loading', function () {
      return {
        restrict: 'E',
        replace:true,
        template: '<div class="loading"><div class="loader-img"></div></div>',
        link: function (scope, element, attr) {
              scope.$watch('loading', function (val) {
                  if (val)
                      $(element).show();
                  else
                      $(element).hide();
              });
        }
      }
  }).directive('zoomer', function () {
		return {
			restrict: 'A',
			link: function (scope, element, attr) {
				var el =element[0];
				var hammertime = new Hammer(el, {
                    touchAction: 'pan-y'
                });
				hammertime.get('pinch').set({ enable: true });
				var posX = 0,
					posY = 0,
					scale = 1,
					last_scale = 1,
					last_posX = 0,
					last_posY = 0,
					max_pos_x = 0,
					max_pos_y = 0,
					transform = "";
					hammertime.on('doubletap pan pinch panend pinchend', function(ev) {
						if (ev.type == "doubletap") {
							transform =
								"translate3d(0, 0, 0) " +
								"scale3d(2, 2, 1) ";
							scale = 2;
							last_scale = 2;
							try {
								if (window.getComputedStyle(el, null).getPropertyValue('-webkit-transform').toString() != "matrix(1, 0, 0, 1, 0, 0)") {
									transform =
										"translate3d(0, 0, 0) " +
										"scale3d(1, 1, 1) ";
									scale = 1;
									last_scale = 1;
								}
							} catch (err) {}
							el.style.webkitTransform = transform;
							transform = "";
						}

						//pan    
						if (scale != 1) {
							posX = last_posX + ev.deltaX;
							posY = last_posY + ev.deltaY;
							max_pos_x = Math.ceil((scale - 1) * el.clientWidth / 2);
							max_pos_y = Math.ceil((scale - 1) * el.clientHeight / 2);
							if (posX > max_pos_x) {
								posX = max_pos_x;
							}
							if (posX < -max_pos_x) {
								posX = -max_pos_x;
							}
							if (posY > max_pos_y) {
								posY = max_pos_y;
							}
							if (posY < -max_pos_y) {
								posY = -max_pos_y;
							}
						}

						//pinch
						if (ev.type == "pinch") {
							scale = Math.max(.999, Math.min(last_scale * ev.scale, 2));
						}
						if(ev.type == "pinchend"){last_scale = scale;}

						//panend
						if(ev.type == "panend"){
						last_posX = posX < max_pos_x ? posX : max_pos_x;
						last_posY = posY < max_pos_y ? posY : max_pos_y;
						}

						if (scale != 1) {
							transform =
								"translate3d(" + posX + "px," + posY + "px, 0) " +
								"scale3d(" + scale + ", " + scale + ", 1)";
						}

						if (transform) {
							el.style.webkitTransform = transform;
						}
					});
			}
        }
  });
