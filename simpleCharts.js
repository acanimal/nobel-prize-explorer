(function() {
	SC = window.SC || {};

	/**
	 * Base class for all the charts implementations
	 * 
	 * @param  {string} selector Selector to the element to fill with the chart
	 * @param  {data} data     Data to fill the chart
	 * @return {chart}         A new chart instance
	 */
	SC.baseChart = function(selector, data) {
		var _chart = {};
		var _selector = selector;
		var _data = data;
		
		var _svg, _xScale, _yScale = null;
		var _width = 420, _height = 120, _xPadding = 5, _yPadding = 20;

		_chart.selector = function(d) {
			if(!arguments.length) { 
				return selector; 
			}
			selector = d;
			return _chart;
		};

		_chart.data = function(d) {
			if(!arguments.length) { 
				return _data; 
			}
			_data = d;
			return _chart;
		};

		_chart._svg = function(s) {
			if(!arguments.length) { 
				return _svg; 
			}
			_svg = s;
			return _chart;
		};

		_chart._xScale = function(s) {
			if(!arguments.length) { 
				return _xScale; 
			}
			_xScale = s;
			return _chart;
		};

		_chart._yScale = function(s) {
			if(!arguments.length) { 
				return _yScale; 
			}
			_yScale = s;
			return _chart;
		};

		_chart.xPadding = function(s) {
			if(!arguments.length) { 
				return _xPadding; 
			}
			_xPadding = s;
			return _chart;
		};

		_chart.yPadding = function(s) {
			if(!arguments.length) { 
				return _yPadding; 
			}
			_yPadding = s;
			return _chart;
		};

		_chart.width = function(w) {
			if(!arguments.length) { 
				return _width; 
			}
			_width = w;
			return _chart;
		};

		_chart.height = function(h) {
			if(!arguments.length) { 
				return _height; 
			}
			_height = h;
			return _chart;
		};

		return _chart;
	};

	SC.lineChart = function(selector, data) {
		var _chart = new SC.baseChart(selector, data);

		var _xAxis, _yAxis = null, _xAxisOrient = "bottom", _xAxisTicks = 10;
		var _color = d3.scale.category20c();

		_chart.xAxisOrient = function(s) {
			if(!arguments.length) { 
				return _xAxisOrient; 
			}
			_xAxisOrient = s;
			return _chart;
		};

		_chart.xAxisTicks = function(n) {
			if(!arguments.length) { 
				return _xAxisTicks; 
			}
			_xAxisTicks = n;
			return _chart;	
		}

		_chart.render = function() {
			if(!_chart._svg() ) {

				_chart._svg( d3.select( _chart.selector() )
				  .append("svg")
					.attr("class", "sc-chart-bar")
					.attr("width", _chart.width() )
					.attr("height", _chart.height() )
				  .append("g")
					.attr("transform", "translate("+ _chart.xPadding()*5 +", " + (-_chart.yPadding()) + ")")
				); 

				_chart._xScale( d3.scale.linear()
					.domain([d3.min( _chart.data() , function(d){return d.key;}), d3.max( _chart.data() , function(d){return d.key;})])
					.range([0, (_chart.width() - _chart.xPadding() )])
				);

				_chart._yScale( d3.scale.linear()
					.domain([d3.max( _chart.data() , function(d){return d.value;}), d3.min( _chart.data() , function(d){return d.value;})])
					.range([0, (_chart.height() - _chart.yPadding() )])
				);

				_xAxis = d3.svg.axis().scale( _chart._xScale() ).ticks( _chart.xAxisTicks() ).orient( _chart.xAxisOrient() );
				_yAxis = d3.svg.axis().scale( _chart._yScale() ).ticks( _chart.xAxisTicks() ).orient("left");
			}

			_renderGraph();
			// _renderLabels();
			_renderRule();

			return _chart;
		};

		_renderGraph = function() {
			var line = d3.svg.line()
				.x(function(d) { return _chart._xScale()(d.key); })
				.y(function(d) { return _chart._yScale()(d.value); })

			_chart._svg().append("path")
				.attr("class", "line")
				.attr("transform", "translate(0," + _chart.yPadding() + ")")
				.attr("d", line( _chart.data() ) )
				.on("mouseover", function() {
					console.log(arguments, this, d3.event);
					d3.select(this).transition()
						.style("stroke-width", 3);
				})
				.on("mouseout", function() {
					d3.select(this).transition()
						.style("stroke-width", 1);
				});
		};

		_renderRule = function() {
			_chart._svg().append("svg:g")
				.attr("class", "xAxis")
				.attr("transform", "translate(0," + _chart.height() + ")")
				.call( _xAxis );

			_chart._svg().append("svg:g")
				.attr("class", "yAxis")
				.attr("transform", "translate(0," + _chart.yPadding() + ")")
				.call( _yAxis );
		};

		return _chart;
	};

	SC.horizontalBarChart = function(selector, data) {
		var _chart = new SC.baseChart(selector, data);

		var _xAxis = null, _xAxisOrient = "top", _xAxisTicks = 10;
		var _color = d3.scale.category20c();

		_chart.xAxisOrient = function(s) {
			if(!arguments.length) { 
				return _xAxisOrient; 
			}
			_xAxisOrient = s;
			return _chart;
		};

		_chart.xAxisTicks = function(n) {
			if(!arguments.length) { 
				return _xAxisTicks; 
			}
			_xAxisTicks = n;
			return _chart;	
		}

		_chart.render = function() {
			if(!_chart._svg() ) {

				_chart._svg( d3.select( _chart.selector() )
				  .append("svg")
					.attr("class", "sc-chart-bar")
					.attr("width", _chart.width() )
					.attr("height", _chart.height() )
				  .append("g")
					.attr("transform", "translate("+ _chart.xPadding() +", " + _chart.yPadding() + ")")
				); 

				_chart._xScale( d3.scale.linear()
					.domain([0, d3.max( _chart.data() , function(d){return d.value;})])
					.range([0, _chart.width() ])
				);

				_chart._yScale( d3.scale.ordinal()
					.domain( _chart.data().map(function(d, i){ return i; }))
					.rangeBands([0, (_chart.height() - _chart.yPadding())])
				);

				
				_xAxis = d3.svg.axis().scale( _chart._xScale() ).ticks( _chart.xAxisTicks() ).orient( _chart.xAxisOrient() );
			}
			
			_renderGraph();
			_renderLabels();
			_renderRule();

			return _chart;
		};

		_renderGraph = function() {
			_chart._svg().selectAll("rect")
				.data( _chart.data() )
			  .enter().append("rect")
				.attr("y", function(d, i){ return _chart._yScale()(i); })
				.attr("width", function(d) { return _chart._xScale()(d.value); })
				.attr("height", _chart._yScale().rangeBand())
				.attr("fill", function(d){ return _color(d.value); });
		};

		_renderLabels = function() {
			var total = _chart.data().reduce(function(p, c, index, array){
			  return (p.value  + c.value) || (p + c.value);
			});

			_chart._svg().selectAll("text")
				.data(_chart.data())
			  .enter().append("text")
				.attr("x", function(d){ return _chart._xScale()(d.value); })
				.attr("y", function(d, i) { return _chart._yScale()(i) + _chart._yScale().rangeBand() / 2; })
				.attr("dx", -3) // padding-right
				.attr("dy", ".35em") // vertical-align: middle
				.attr("text-anchor", "end") // text-align: right
				.text(function(d){ return d.key + " ( "+d.value+" | "+ Math.round(d.value * 100 / total) +"% )"; });
		};

		_renderRule = function() {
			_chart._svg().append("svg:g")
				.attr("class", "xAxis")
				.call( _xAxis );
		};

		return _chart;
	};

})();