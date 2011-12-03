/*
	jQuery Plugin StoryLine
	
	This plugin was made with a particular function of adding multiple inputs with autocomplete with some other functions like adding a new item to the list that is not into
	the autocomplete list or removing an item (when there are more than one into a list).
	
	Author: Julian Xhokaxhiu
	Date: 07/01/2010
	Changelog:
		- 0.1:  initial relase version.
*/
var StoryLine;
(function($){
	StoryLine = function(options){
		var father = $(this).parent();
		var scrollBar;
		var scrollContent = $(this);
		var scrollPane;
		var handleHelper;
		var settings = $(this).data('storylinesettings');
		// If settings are not declared, we set the default value for them
		if(!settings){
			settings = {
				elementwidth: 0,
				elementsperview: 0,
				tonextonslide: 100,
				tonextonclick: 200,
				step: 1,
				touchstep: 2
			}
		};
		// Private methods - can only be called from within this object
		var IntFunz = {
			//size scrollbar and handle proportionally to scroll distance
			sizeScrollbar:function(){
				var remainder = scrollContent.width()-scrollPane.width();
				var proportion = remainder/scrollContent.width();
				var handleSize = scrollPane.width()-(proportion*scrollPane.width());
				scrollBar.find(".ui-slider-handle").css({width:handleSize,"margin-left":-handleSize/2});
				handleHelper.width("").width(scrollBar.width()-handleSize);
			},
			//reset slider value based on scroll content position
			resetValue:function(){
				var remainder = scrollPane.width()-scrollContent.width();
				var leftVal = scrollContent.css("margin-left")==="auto"?0:parseInt(scrollContent.css("margin-left"));
				var percentage = Math.round(leftVal/remainder*100);
				scrollBar.slider("value",percentage);
			}
		};
		
		if(typeof(options)=='string'){
			if(IntFunz[options])IntFunz[options].apply(null,Array.prototype.slice.call(arguments,1));
		}else if(options){
			settings = $.extend(settings, options || {});
			$(this).data('storylinesettings',settings);
			
			// Do this only if the control is not already binded
			if (!scrollContent.parent().hasClass('ui-storyline')){
				// Get the number of the elements
				var elementsnumber = scrollContent.children().length;
				scrollBar = $('<div/>',{'class':'scroll-bar'});
				scrollPane = $('<div/>',{'class':'ui-storyline scroll-pane'})
				// Append HTML
				scrollContent.width(elementsnumber*settings.elementwidth).children().each(function(i,v){$(v).addClass('box scroll-content-item').width(settings.elementwidth).touchwipe({wipeLeft:function(){scrollBar.slider('value',scrollBar.slider('value')+settings.touchstep)},wipeRight:function(){scrollBar.slider('value',scrollBar.slider('value')-settings.touchstep)},preventDefaultEvents:false})});
				scrollPane = scrollContent.addClass('scroll-content').wrap(scrollPane).parent();
				father.width(settings.elementwidth*settings.elementsperview).append($('<div/>',{'class':'scroll-bar-wrap ui-widget-content ui-corner-bottom'}).width(settings.elementwidth*settings.elementsperview).touchwipe({wipeLeft:function(){scrollBar.slider('value',scrollBar.slider('value')-settings.touchstep)},wipeRight:function(){scrollBar.slider('value',scrollBar.slider('value')+settings.touchstep)},preventDefaultEvents:false}).append(scrollBar)).append($('<ul/>',{'class':'ui-storyline-command-buttons'}).append($('<li/>').append($('<button/>',{'id':'prev'}).text('Prev').button().click(function(){scrollBar.slider('value',scrollBar.slider('value')-settings.step)}))).append($('<li/>').append($('<button/>',{'id':'next'}).text('Next').button().click(function(){scrollBar.slider('value',scrollBar.slider('value')+settings.step)}))));
				// Make it a slider
				scrollBar.slider({
					slide:function(event,ui){
						if(ui.value)scrollContent.animate({"margin-left":ui.value*(-settings.elementwidth)},settings.tonextonslide);
						else scrollContent.animate({"margin-left":0},settings.tonextonslide);
					},
					change:function(event,ui){
						if(ui.value)scrollContent.animate({"margin-left":ui.value*(-settings.elementwidth)},settings.tonextonclick);
						else scrollContent.animate({"margin-left":0},settings.tonextonclick);
					},
					min:0,
					max:(elementsnumber-settings.elementsperview),
					step:settings.step,
					animate:true
				});
				//append icon to handle
				handleHelper = scrollBar.find(".ui-slider-handle").mousedown(function(){scrollBar.width(handleHelper.width())}).mouseup(function(){scrollBar.width("100%")}).append($('<span/>',{'class':'ui-icon ui-icon-grip-dotted-vertical'})).wrap($('<div/>',{'class':'ui-handle-helper-parent'})).parent();
				//change overflow to hidden now that slider handles the scrolling
				scrollPane.css("overflow","hidden");
				// Resize and position correctly the scrollbar on window resize
				$(window).resize(function(){
					IntFunz.resetValue();
					IntFunz.sizeScrollbar();
				});
				//safari wants a timeout
				setTimeout(function(){
					IntFunz.sizeScrollbar();
				},10);
			}
		}
	};
	$.fn.extend({
		storyline:function(){
			var args = arguments;
			this.each(function(){StoryLine.apply(this,args)});
		}
	});
})(jQuery);