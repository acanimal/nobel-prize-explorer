/**
 * Encapsulates all the functionalities to load and query data from nobel prizes.
 */
function DataQuery(laureates, prizes) {

	var getPrizes = function() {
		return prizes;
	}
	var getLaureates = function() {
		return laureates;
	}

	/**
	 * Returns an array of laureates grouped by country.
	 * Note all laureates without born neither died country code are ignored.
	 * 
	 * @param  {boolean} died Specifies if we must group by born or died country
	 * @return {Array}               Array of {code, laureateList}
	 */
	var laureatesByCountry = function(died) {
		var result = [], i;
		var l, c, item;
		for(i=0; i< laureates.length; i ++) {
			l = laureates[i];

			// Avoid laureates without country code
			if(!l.bornCountryCode && !l.diedCountryCode) {
				continue;
			}

			if(died && l.diedCountryCode) {
				c = l.diedCountryCode;
			} else {
				c = l.bornCountryCode;
			}

			// Check if an item with the code exists
			item = $.grep(result, function(e){ return e.code === c; });
			if(!item.length) {
				result.push({code: c, laureates: [ l ]});
			} else {
				item[0].laureates.push( l );
			}
		}
		return result;
	}

	/**
	 * Returns the number of prizes grouped by category
	 * 
	 * @param  {String} country If set the group is only done for this country
	 * @return {Array}         Array of {category, value}
	 */
	var prizesByCategory = function(country, died, year) {
		var result = [], i, j, none;
		var p, c, item, l, cc, inc;
		for(i=0; i< prizes.length; i ++) {
			p = prizes[i];
			c = p.category;
			
			inc = 1;
			if(year && year!='All' && year!=p.year) {
				inc = 0;
			} else {
				if(country && country!='World') {
					none = true;
					// If none of the laureates are from the given country ignore the prize
					for(j=0; j< p.laureates.length; j++) {
						l = findLaureateById(p.laureates[j].id);
						if(died && l.diedCountryCode) {
							cc = l.diedCountryCode;
						} else {
							cc = l.bornCountryCode;
						}
						if(cc === country) {
							none = false;
							break;
						}
					}
					inc = none ? 0 : 1;
				}
			}

			// Check if an item with the category exists
			item = $.grep(result, function(e){ return e.category === c; });
			if(!item.length) {
				result.push({category: c, value: inc});
			} else {
				item[0].value+=inc;
			}
		}
		return result;
	}

	/**
	 * Returns the number of laureates grouped by category
	 * 
	 * @param  {[type]} country [description]
	 * @param  {[type]} died    [description]
	 * @param  {[type]} year    [description]
	 * @return {[type]}         [description]
	 */
	var laureatesByCategory = function(country, died, year) {
		var result = [], i, j;
		var p, c, item, l, inc;
		for(i=0; i< prizes.length; i ++) {
			p = prizes[i];
			c = p.category;
			
			if(year && year!='All' && year!=p.year) {
				inc = 0;
			} else {
				// Compute increment
				inc = p.laureates.length;
				if(country) {
					inc = 0;
					for(j=0; j< p.laureates.length; j++) {
						l = findLaureateById(p.laureates[j].id);
						if( (died && l.diedCountryCode === country) || l.bornCountryCode === country) {
							inc++;
						}
					}
				}	
			}

			// Check if an item with the category exists
			item = $.grep(result, function(e){ return e.category === c; });
			if(!item.length) {
				result.push({category: c, value: inc});
			} else {
				item[0].value+=inc;
			}
		}
		return result;
	}

	/**
	 * Returns the prizes grouped by number of laureates that share it
	 * 
	 * @param  {String} country If set the group is only done for this country
	 * @return {Array}         Array of {category, value}
	 */
	var prizesByLaureatesShared = function(country, died, year) {
		var result = [], i, j;
		var p, c, item, cc, none, l;
		for(i=0; i< prizes.length; i ++) {
			p = prizes[i];
			c = p.laureates.length;
			
			if(year && year!='All' && year!=p.year) {
				continue;
			}

			if(country && country!='World') {
				none = true;
				// If none of the laureates are from the given country ignore the prize
				for(j=0; j< p.laureates.length; j++) {
					l = findLaureateById(p.laureates[j].id);
					if(died && l.diedCountryCode) {
						cc = l.diedCountryCode;
					} else {
						cc = l.bornCountryCode;
					}
					if(cc === country) {
						none = false;
						break;
					}
				}
				if(none) {
					continue;
				}
			}

			// Check if an item with the category exists
			item = $.grep(result, function(e){ return e.shared === c; });
			if(!item.length) {
				result.push({shared: c, value: 1});
			} else {
				item[0].value++;
			}
		}
		return result;
	}

	/**
	 * Returns the number of prizes by year
	 * 
	 * @param  {String} country If set the group is only done for this country
	 * @return {Array}         Array of {year, value}
	 */
	var prizesByYear = function(country, died) {
		var result = [], i, j, l;
		var p, c, item, cc, none;
		for(i=0; i< prizes.length; i ++) {
			p = prizes[i];
			c = p.year;
			
			if(country && country!='World') {
				none = true;
				// If none of the laureates are from the given country ignore the prize
				for(j=0; j< p.laureates.length; j++) {
					l = findLaureateById(p.laureates[j].id);
					if(died && l.diedCountryCode) {
						cc = l.diedCountryCode;
					} else {
						cc = l.bornCountryCode;
					}
					if(cc === country) {
						none = false;
						break;
					}
				}
				if(none) {
					continue;
				}
			}

			// Check if an item with the year exists
			item = $.grep(result, function(e){ return e.year === c; });
			if(!item.length) {
				result.push({year: c, value: 1});
			} else {
				item[0].value++;
			}
		}
		return result;
	}

	/**
	 * Returns the number of laureates by year
	 * 
	 * @param  {String} country If set the group is only done for this country
	 * @return {Array}         Array of {year, value}
	 */
	var laureatesByYear = function(country, died) {
		var result = [], i, j, l;
		var p, c, item, inc;
		for(i=0; i< prizes.length; i ++) {
			p = prizes[i];
			c = p.year;
			
			// Compute increment
			inc = p.laureates.length;
			if(country) {
				inc = 0;
				for(j=0; j< p.laureates.length; j++) {
					l = findLaureateById(p.laureates[j].id);
					if( (died && l.diedCountryCode === country) || l.bornCountryCode === country) {
						inc++;
					}
				}
			}

			// Check if an item with the year exists
			item = $.grep(result, function(e){ return e.year === c; });
			if(!item.length) {
				result.push({year: c, value: inc});
			} else {
				item[0].value+= inc;
			}
		}
		return result;
	}

		/**
	 * Find a laureate by its ID
	 * 
	 * @param  {[type]} id [description]
	 * @return {[type]}    [description]
	 */
	var findLaureateById = function(id) {
		for(var i=0; i< laureates.length; i++) {
			if(laureates[i].id === id) {
				return laureates[i];
			}
		}
		return null;
	}

	/** 
	 * Helper method to get a [x,y] array from an array of objects.
	 */
	var convertToXyArray = function(arr, attributes, noParse) {
		var result = [], r, i, j;

		for(i=0; i< arr.length; i++) {
			r = [];
			for(j=0; j< attributes.length; j++) {
				r.push( noParse ? arr[i][attributes[j]]: parseInt(arr[i][attributes[j]]) );
			}
			result.push(r);
		}

		return result.sort(function(a,b) {
			return a[0]-b[0];
		});
	}

	return {
		getPrizes: getPrizes,
		getLaureates: getLaureates,
		laureatesByCountry: laureatesByCountry,
		prizesByCategory: prizesByCategory,
		laureatesByCategory: laureatesByCategory,
		prizesByLaureatesShared: prizesByLaureatesShared,
		prizesByYear: prizesByYear,
		laureatesByYear: laureatesByYear,
		convertToXyArray: convertToXyArray,
		findLaureateById: findLaureateById
	}

}

/**
 * Draws a world map with the nobel prizes information.
 * 
 * @param {String} mapElement ID of the element where to place the map.
 * @param {String} countryElement ID of the element where to place the name
 * of the selected country
 * @param {DataLoad} [dataQuery] Instance of DataQuery to query information.
 */
function MapChart(mapElement, titleElement, dataQuery) {
	var map, geojson, previousSelected, info, legend, countryCodes, zoomedToFeature;

	updateTitle();
	initializeMap();
	updateCountryCodes();

	function updateTitle() {
		$('#bornCountryOption').off('click');
		$('#dieCountryOption').off('click');

		$('#'+titleElement).empty();

		var msg;
		if(!chartOptions.died) {
			msg = 'Laureates by country depending '+
			'on <em>born</em> <input type="radio" name="borndieRadios" id="bornCountryOption" value="born" checked> '+
			'or <em>died</em> <input type="radio" name="borndieRadios" id="dieCountryOption" value="die"> '+
			' country'
		} else {
			msg = 'Laureates by country depending '+
			'on <em>born</em> <input type="radio" name="borndieRadios" id="bornCountryOption" value="born" > '+
			'or <em>died</em> <input type="radio" name="borndieRadios" id="dieCountryOption" value="die" checked> '+
			' country'
		}
		$('#'+titleElement).html(msg);

		// Register listeners 
		$('#bornCountryOption').on('click', function() {
			chartOptions.died = false;
			updateCountryCodes();
			
			// Refresh countries
			geojson.setStyle(style);
			legend.removeFrom(map);
			addLegendControl();

			// Ugly way to trigger events
			$.event.trigger({
				type: 'onCountrySelected',
				message: chartOptions
			});
		});
		$('#dieCountryOption').on('click', function() {
			chartOptions.died = true;
			updateCountryCodes();

			// Refresh countries
			geojson.setStyle(style);
			legend.removeFrom(map);
			addLegendControl();

			// Ugly way to trigger events
			$.event.trigger({
				type: 'onCountrySelected',
				message: chartOptions
			});
		});
	}

	function updateCountryCodes() {
		countryCodes = dataQuery.laureatesByCountry(chartOptions.died);
	}

	function getColor(d) {

		if(chartOptions.died) {
			// Red palette
		    return d > 100 ? '#800026' :
		           d > 50  ? '#BD0026' :
		           d > 20  ? '#E31A1C' :
		           d > 10  ? '#FC4E2A' :
		           d > 5   ? '#FD8D3C' :
		           d > 2   ? '#FEB24C' :
		           d > 0   ? '#FED976' :
		                      '#FFEDA0';
	    } else {
	    	// Blue palette
		    return d > 100 ? '#034E7B' :
		           d > 50  ? '#0570B0' :
		           d > 20  ? '#3690C0' :
		           d > 10  ? '#74A9CF' :
		           d > 5   ? '#A6BDDB' :
		           d > 2   ? '#D0D1E6' :
		           d > 0   ? '#ECE7F2' :
		                      '#FFF7FB';
	    }

	    // Green palette
	    // return d > 100 ? '#005824' :
	    //        d > 50  ? '#238B45' :
	    //        d > 20  ? '#41AE76' :
	    //        d > 10  ? '#66C2A4' :
	    //        d > 5   ? '#99D8C9' :
	    //        d > 2   ? '#CCECE6' :
	    //        d > 0   ? '#E5F5F9' :
	    //                   '#F7FCFD';
	}

	function style(feature) {
		var c = $.grep(countryCodes, function(item) {
			return item.code === feature.properties.iso_a2;
		});

		var color = 0;
		if(c.length) {
			color = c[0].laureates.length;
		}

	    return {
	        fillColor: getColor(color),
	        weight: 1,
	        opacity: 1,
	        color: 'white',
	        fillOpacity: 0.7,
	        label: "d"
	    };
	}

	function resetHighlight(e) {
	    geojson.resetStyle(e.target);
	    info.update();
	}

	function highlightFeature(e) {
	    var layer = e.target;

	    layer.setStyle({
	        weight: 2,
	        color: '#666',
	        dashArray: '2',
	        fillOpacity: 0.7
	    });

	    if (!L.Browser.ie && !L.Browser.opera) {
	        layer.bringToFront();
	    }

	    info.update(layer.feature.properties);
	}	

	function zoomToFeature(e) {
		if(e.target !== previousSelected) {
			if(previousSelected) {
				previousSelected.selected = false;
			}
			previousSelected = e.target;
		}
		if(e.target.selected) {
			e.target.selected = false;
			map.setView([30,0], 2)

			chartOptions.countryName = "World";
			chartOptions.countryCode = null;
			updateTitle();

			zoomedToFeature = true;
		} else {
			e.target.selected = true;
			map.fitBounds(e.target.getBounds());

			chartOptions.countryName = e.target.feature.properties.name;
			chartOptions.countryCode = e.target.feature.properties.iso_a2;

			updateTitle();

			zoomedToFeature = true;
		}
	}

	function onEachFeature(feature, layer) {
	    layer.on({
	        mouseover: highlightFeature,
	        mouseout: resetHighlight,
	        click: zoomToFeature
	    });
	}

	function addInfoControl() {
		// Add info control
		info = L.control();
		info.onAdd = function (map) {
		    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
		    this.update();
		    return this._div;
		};

		// method that we will use to update the control based on feature properties passed
		info.update = function (props) {
			if(!props) {
				return;
			}

			var c = $.grep(countryCodes, function(item) {
				return item.code === props.iso_a2;
			});

			var num = 0;
			if(c.length) {
				num = c[0].laureates.length;
			}

		    this._div.innerHTML = "<h4>"+props.name+" <b>"+num+"</b></h4>";
		};
		info.addTo(map);
	}

	function addLegendControl() {
		// Add legend
		legend = L.control({position: 'bottomright'});
		legend.onAdd = function (map) {

		    var div = L.DomUtil.create('div', 'info legend'),
		        grades = [0, 1, 2, 5, 10, 20, 50, 100],
		        labels = [];

		    // loop through our density intervals and generate a label with a colored square for each interval
		    for (var i = 0; i < grades.length; i++) {
		        div.innerHTML +=
		            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
		            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
		    }

		    return div;
		};
		legend.addTo(map);
	}

	function initializeMap() {
		// create a map in the "map" div, set the view to a given place and zoom
		map = L.map(mapElement, {
			minZoom: 1,
			maxZoom: 7
		}).setView([30,0], 2);

		// Listen for zoomend event to fire onCountrySelected event.
		map.on('moveend', function() {
			if(zoomedToFeature) {
				// Ugly way to trigger events
				$.event.trigger({
					type: 'onCountrySelected',
					message: chartOptions
				});
				zoomedToFeature = false;
			}
		});

		// Add controls
		addInfoControl();
		addLegendControl();

		// Add GeoJson data
		$.get(countriesUrl, function(data) {
			geojson = L.geoJson(data, {
				style: style,
				onEachFeature: onEachFeature
			}).addTo(map);
		});
	}

	return {
		map: map
	}

}


/**
 * Draws a line chart show the number of prizes and laureates per year.
 * 
 * @param {[type]} chartElement [description]
 * @param {[type]} titleElement  [description]
 * @param {[type]} dataQuery   [description]
 */
function YearChart(chartElement, titleElement, dataQuery) {

	updateTitle();

	var lyArr = dataQuery.convertToXyArray(dataQuery.laureatesByYear(), ['year', 'value']);
	var pyArr = dataQuery.convertToXyArray(dataQuery.prizesByYear(), ['year', 'value']);

	var yearChart = new Highcharts.Chart({
		chart: {
			renderTo: chartElement,
			type: 'spline',
			events: {
				click: function(e) {
					chartOptions.year = 'All';
					updateTitle();

					// Ugly way to trigger events
					$.event.trigger({
						type: 'onYearSelected',
						message: chartOptions
					});
				}
			}
		},
		title: {
            text: ''
        },
        xAxis: {
            title: {
                text: ''
            }
        },
        yAxis: {
            title: {
                text: ''
            },
            min: 0
        },
        plotOptions: {
        	series: {
        		point: {
        			events: {
        				click: function(e) {
        					chartOptions.year = e.point.category;
        					updateTitle();

        					// Ugly way to trigger events
							$.event.trigger({
								type: 'onYearSelected',
								message: chartOptions
							});
        				}
        			}
        		}
        	}
        },
        tooltip: {
            formatter: function() {
                var s = 'On year <b>'+this.points[0].key+'</b> there were: <br/>';
                $.each(this.points, function(i, point) {
                    s += '<b>'+point.y +'</b> ' + point.series.name+'<br/>';
                });
                
                return s;
            },
            shared: true
        },
		series: [
			{id: 'Laureates', name: 'Laureates', data: lyArr},
			{id: 'Prizes', name: 'Prizes', data: pyArr}
		]
	});

	function updateTitle() {
		$('#'+titleElement).html('Laureates & Prizes on <b>'+chartOptions.countryName+'</b>');
	}

	/**
	 * Update chart properties
	 * 
	 * @param  {Object} options Options to update the chart: name, code and died.
	 */
	function update() {
		
		updateTitle();

		lyArr = dataQuery.convertToXyArray(dataQuery.laureatesByYear(chartOptions.countryCode, chartOptions.died), ['year', 'value']);
		pyArr = dataQuery.convertToXyArray(dataQuery.prizesByYear(chartOptions.countryCode, chartOptions.died), ['year', 'value']);

		// Update series data
		yearChart.get('Laureates').setData(lyArr);
		yearChart.get('Prizes').setData(pyArr);
	}

	return {
		update: update
	}
}

/**
 * Draws a chart with prizes grouped by category
 * 
 * @param {[type]} chartElement    [description]
 * @param {[type]} categoryElement [description]
 * @param {[type]} dataQuery      [description]
 */
function CategoryChart(chartElement, titleElement, dataQuery) {

	updateTitle();

	var lcArr = dataQuery.convertToXyArray(dataQuery.laureatesByCategory(), ['category', 'value'], true);
	var pcArr = dataQuery.convertToXyArray(dataQuery.prizesByCategory(), ['category', 'value'], true);

	var categories = [];
	for(var i=0; i< lcArr.length; i++) { categories.push(lcArr[i][0]);}

	var categoryChart = new Highcharts.Chart({
		chart: {
			renderTo: chartElement,
			type: 'column',
			events: {
				click: function(e) {
					chartOptions.category = 'All';
					updateTitle();

					// Ugly way to trigger events
					$.event.trigger({
						type: 'onCategorySelected',
						message: chartOptions
					});
				}
			}
		},
		title: {
            text: ''
        },
        legend: {
        	enabled: false
        },
        plotOptions: {
        	series: {
        		point: {
        			events: {
        				click: function(e) {
        					chartOptions.category = e.point.category;
        					updateTitle();
        					
        					// Ugly way to trigger events
							$.event.trigger({
								type: 'onCategorySelected',
								message: chartOptions
							});
        				}
        			}
        		}
        	}
        },
        xAxis: {
        	id: 'xAxis',
            title: {
                text: ''
            },
            categories: categories,
            labels: {
            	rotation: -45
            }
        },
        yAxis: {
            title: {
                text: ''
            }
        },
        tooltip: {
            formatter: function() {
            	if(this.series.chart.get('nLaureates') == this.series) {
            		return '<b>' + this.y + ' laureates</b> on the <br/><b>'+this.key+'</b> category';
            	} else {
            		return '<b>' + this.y + ' prizes</b> on the <br/><b>'+this.key+'</b> category';
            	}
            }
        },
		series: [
			{id: 'nLaureates', name: 'Num Laureates', data: lcArr},
			{id: 'nPrizes', name: 'Num Prizes', data: pcArr}
		]
	});

	function updateTitle() {
		var msg;
		if(chartOptions.year === 'All') {
			msg = 'Prizes on <b>'+chartOptions.countryName+'</b> grouped by category and for <b>All</b> years';
		} else {
			msg = 'Prizes on <b>'+chartOptions.countryName+'</b> grouped by category and for year <b>'+chartOptions.year+'</b>';
		}
		$('#'+titleElement).html(msg);
	}

	function update() {
		updateTitle();
		lcArr = dataQuery.convertToXyArray(dataQuery.laureatesByCategory(chartOptions.countryCode, chartOptions.died, chartOptions.year), ['category', 'value'], true);
		pcArr = dataQuery.convertToXyArray(dataQuery.prizesByCategory(chartOptions.countryCode, chartOptions.died, chartOptions.year), ['category', 'value'], true);
		categories = [];
		for(var i=0; i< lcArr.length; i++) { categories.push(lcArr[i][0]);}

		// Update series data
		categoryChart.get('xAxis').setCategories(categories);
		categoryChart.get('nPrizes').setData(pcArr);
		categoryChart.get('nLaureates').setData(lcArr);
	}

	return {
		update: update
	}
}

/**
 * Draw a chart grouping the prizes by the number of shared laureates
 * 
 * @param {[type]} chartElement [description]
 * @param {[type]} dataQuery   [description]
 */
function SharedChart(chartElement, titleElement, dataQuery) {
	
	updateTitle();

	var pslArr = dataQuery.convertToXyArray(dataQuery.prizesByLaureatesShared(), ['shared', 'value']);
	var sharedChart = new Highcharts.Chart({
		chart: {
			renderTo: chartElement,
			type: 'column'
		},
		title: {
            text: ''
        },
        legend: {
        	enabled: false
        },
        tooltip: {
            formatter: function() {
                return '<b>' + this.y + '</b> prizes shared by <br/><b>'+ this.key + '</b> laureates';
            }
        },
        xAxis: {
            title: {
                text: ''
            }
        },
        yAxis: {
            title: {
                text: ''
            }
        },
		series: [
			{id: 'shared', name: "# shared", data: pslArr}
		]
	});

	function updateTitle() {
		var msg;
		if(chartOptions.year === 'All') {
			msg = 'Prizes on <b>'+chartOptions.countryName+'</b> grouped by number of shared laureates and for <b>All</b> years';
		} else {
			msg = 'Prizes on <b>'+chartOptions.countryName+'</b> grouped by number of shared laureates and for year <b>'+chartOptions.year+'</b>';
		}
		$('#'+titleElement).html(msg);
	}

	function update() {
		updateTitle();
		pslArr = dataQuery.convertToXyArray(dataQuery.prizesByLaureatesShared(chartOptions.countryCode, chartOptions.died, chartOptions.year), ['shared', 'value']);

		// Update series data
		sharedChart.get('shared').setData(pslArr);
	}

	return {
		update: update
	}

}

/**
 * Show information for the selected laureates and prizes.
 */
var LaureatesTable = function(tableElement, titleElement, dataQuery) {

	var pArr=[], $el=$('#'+tableElement);

	var table = $('#laureates-table').dataTable({
		"bPaginate": true,
        "bLengthChange": false,
        "bFilter": false,
        "bSort": true,
        "bInfo": true,
        "bAutoWidth": false,
        "bProcessing": true
	});

	update();

	function updateTitle() {
		var msg = '';
		if(chartOptions.countryName === 'World') {
			msg += "Lauretas in the <b>World</b> "
		} else {
			if(chartOptions.died) {
				msg += "Lauretas <em>died</em> in <b>"+chartOptions.countryName+"</b> "
			}
			else {
				msg += "Lauretas <em>born</em> in <b>"+chartOptions.countryName+"</b> "
			}
		}

		if(chartOptions.year === 'All') {
			msg += "for <b>All</b> years "
		} else {
			msg += "for year <b>"+chartOptions.year+"</b> "
		}

		if(chartOptions.category === 'All') {
			msg += "and for <b>All</b> categories "
		} else {
			msg += "and for category <b>"+chartOptions.category+"</b> "
		}

		$('#'+titleElement).html(msg);
	}

	function update() {
		updateTitle();

		pArr = dataQuery.getPrizes();

		// Remove old values
		table.fnClearTable();

		// Add new info
		var row = '', i, j, l, data = [];
		for(i=0; i<pArr.length; i++) {

			if(chartOptions.year && chartOptions.year!='All' && chartOptions.year!=pArr[i].year) {
				continue;
			}

			if(chartOptions.category && chartOptions.category!='All' && chartOptions.category!=pArr[i].category) {
				continue;
			}

			for(j=0; j< pArr[i].laureates.length; j++) {
				l = dataQuery.findLaureateById(pArr[i].laureates[j].id);

				if(chartOptions.countryCode && chartOptions.countryCode!='World') {
					
					if( (chartOptions.died && l.diedCountryCode!==chartOptions.countryCode) || 
						(!chartOptions.died && l.bornCountryCode!==chartOptions.countryCode)) {
						continue;
					}
				}

				// Add laureate and prize information
				data.push([
					pArr[i].year,
					pArr[i].category,
					l.firstname+" "+l.surname,
					pArr[i].laureates[j].motivation || ""
				]);
			}			
		}

		table.fnAddData(data);
	}

	return {
		update: update
	}
}

/**
 * General options used for the charts.
 */
var chartOptions = {
	countryName: 'World',
	countryCode: null,
	year: 'All',
	category: 'All',
	died: false
}


//
// Application starts here !!!
//

// Load data
var prizesUrl = 'data/prize-prizes.json',
	laureatesUrl = 'data/prize-laureates.json',
	countriesUrl = 'data/ne-countries-110m.json',
	laureates = prizes = null;	

$.when($.get(laureatesUrl), $.get(prizesUrl))
.done(function(laureatesResp, prizesRes) {
	laureates = laureatesResp[0].laureates;
	prizes = prizesRes[0].prizes;

	var dataQuery = new DataQuery(laureates, prizes);
	var mapChart = new MapChart('map', 'map-title', dataQuery);

	var yearChart = new YearChart(
		'prizes-by-year-number-laureates-chart', 
		'prizes-by-year-number-laureates-title', 
		dataQuery
	);
	var categoryChart = new CategoryChart(
		'prizes-by-category-chart', 
		'prizes-by-category-title', 
		dataQuery
	);
	var sharedChart = new SharedChart(
		'prizes-shared-by-laureates-number-chart', 
		'prizes-shared-by-laureates-number-title',
		dataQuery
	);
	var laureatesTable = new LaureatesTable(
		'laureates-table',
		'laureates-title',
		dataQuery
	);

	// Listen for events to update charts
	$(document).on("onCountrySelected", function(e) {
		yearChart.update();
		categoryChart.update();
		sharedChart.update();
		laureatesTable.update();
	});

	$(document).on("onYearSelected", function(e) {
		categoryChart.update();
		sharedChart.update();
		laureatesTable.update();
	});

	$(document).on("onCategorySelected", function(e) {
		laureatesTable.update();
	});

	$('#loadingMsg').hide(function(){
		$('#loadingMsg').remove();	
	});

	// Start the tour
	showTour();
});

function showTour() {
	introJs().start();
}
