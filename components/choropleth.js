class Choropleth {
    constructor(selector, data) {
        this.selector = selector;
        this.data = data;
        this.mapRatioAdjuster = 100;
        this.mapRatio = 0.4;
        this.hongKongCenter = [114.15, 22.33];
        this.legendWidth = 230;
        this.legendHeight = 40;
        this.clickedDistrict = [];
        this.handlers = {};
    
        this.showTooltip = this.showTooltip.bind(this);
        this.hideTooltip = this.hideTooltip.bind(this);
    }

    on(eventType, handler) {
        this.handlers[eventType] = handler;
    }

    async initializeData() {
        // Group data by district and calculate statistics
        this.districtData = d3.rollups(
            this.data,
            v => ({
                count: v.length,
                minPrice: Math.min(...v.map(d => +d.price)),
                maxPrice: Math.max(...v.map(d => +d.price)),
                medPrice: d3.median(v, d => +d.price),
                avgPrice: Math.round(d3.mean(v, d => +d.price) * 100) / 100,
                avgReviewCount : Math.round(d3.mean(v, d => +d.number_of_reviews) * 100) / 100,
                avgReviewRating: Math.round(d3.mean(v, d => +d.review_scores_rating) * 100) / 100,
                medReviewRating: Math.round(d3.median(v, d => +d.review_scores_rating) * 100) / 100,
                minReviewRating: Math.min(...v.map(d => +d.review_scores_rating)),
                maxReviewRating: Math.max(...v.map(d => +d.review_scores_rating))
            }),
            d => d.district
        ).map(([key, value]) => ({ district: key, ...value }));

        // Fetch the GeoJSON data
        this.geoData = await d3.json("data/gadm36_HKG.json");
    }

    async initialize() {
        this.svg = d3.select(this.selector)
        await this.initializeData();
        this.resize();

        this.path = d3.geoPath().projection(this.projection);

        this.features = this.svg.append("g");

        $(window).on("resize", () => this.resize());
        this.update();
    }
    
    update(encoding = 'count', encodingOption = 'average') {



        this.encoding = encoding;
        // Define a color scale based on the current encoding
        let colorDomain;

        if (this.encoding === 'count') {
            colorDomain = d3.extent(this.districtData, d => d.count);
        } else if (this.encoding === 'price') {
            switch(encodingOption) {
                case 'min':
                    colorDomain = d3.extent(this.districtData, d => d.minPrice);
                    break;
                case 'max':
                    colorDomain = d3.extent(this.districtData, d => d.maxPrice);
                    break;
                case 'median':
                    colorDomain = d3.extent(this.districtData, d => d.medPrice);
                    break;
                default:
                    colorDomain = d3.extent(this.districtData, d => d.avgPrice);
            }
        } else {
            switch(encodingOption) {
                case 'min':
                    colorDomain = d3.extent(this.districtData, d => d.minReviewRating);
                    break;
                case 'max':
                    colorDomain = d3.extent(this.districtData, d => d.maxReviewRating);
                    break;
                case 'median':
                    colorDomain = d3.extent(this.districtData, d => d.medReviewRating);
                    break;
                default:
                    colorDomain = d3.extent(this.districtData, d => d.avgReviewRating);
            }
        }

        const color = d3.scaleSequential(d3.interpolateYlGn).domain(colorDomain);

        // Bind data and create the map
        this.features.selectAll("path").remove();

        this.features.selectAll("path")
            .data(topojson.feature(this.geoData, this.geoData.objects.gadm36_HKG_1).features)
            .enter().append("path")
            .attr("d", this.path)
            .attr("fill", d => {
                const district = this.districtData.find(dd => dd.district === d.properties.NAME_1);
                if (!district) return "#ccc";
                if (this.encoding === 'count') {
                    return color(district.count);
                } else if (this.encoding === 'price') {
                    let colorPriceData;
                    switch(encodingOption) {
                        case 'min':
                            colorPriceData = district.minPrice;
                            break;
                        case 'max':
                            colorPriceData = district.maxPrice;
                            break;
                        case 'median':
                            colorPriceData = district.medPrice;
                            break;
                        default:
                            colorPriceData = district.avgPrice;
                    }
                    return color(colorPriceData);
                } else {
                    let colorReviewData;
                    switch(encodingOption) {
                        case 'min':
                            colorReviewData = district.minReviewRating;
                            break;
                        case 'max':
                            colorReviewData = district.maxReviewRating;
                            break;
                        case 'median':
                            colorReviewData = district.medReviewRating;
                            break;
                        default:
                            colorReviewData = district.avgReviewRating;
                    }
                    return color(colorReviewData);
                }
            })
            .attr("stroke", "#333")
            .on("mousemove", this.showTooltip)
            .on("mouseout", this.hideTooltip)
            .on("click", (event, d) => this.clickDistrict(event, d)); // Bind the click handler

        this.updateLegend(color, colorDomain, encodingOption);
        this.updateClickedDistrict();
    }

    updateLegend(color, colorDomain, encodingOption = 'average') {
        const legendWidth = this.legendWidth;
        const legendHeight = this.legendHeight;

        const legendSvg = d3.select("#choropleth-legend svg");
        const legendDescription = d3.select("#choropleth-legend-description");

        legendSvg.selectAll("*").remove();
        const encodingOptionText = encodingOption === 'average' ? 'Average' : encodingOption === 'min' ? 'Minimum' : encodingOption === 'max' ? 'Maximum' : 'Median';
        legendDescription.text(this.encoding === 'count' ? "Number of listings" : this.encoding === 'price' ? `${encodingOptionText} price` : `${encodingOptionText} review rating`);

        const defs = legendSvg.append("defs");

        const linearGradient = defs.append("linearGradient")
            .attr("id", "linear-gradient");

        linearGradient.selectAll("stop")
            .data(color.ticks().map((t, i, n) => ({ offset: `${100 * i / n.length}%`, color: color(t) })))
            .enter().append("stop")
            .attr("offset", d => d.offset)
            .attr("stop-color", d => d.color);

        legendSvg.append("rect")
            .attr("width", legendWidth - 20)
            .attr("height", legendHeight - 20)
            .style("fill", "url(#linear-gradient)")
            .attr("transform", "translate(20,10)");

        const legendScale = d3.scaleLinear()
            .domain(colorDomain)
            .range([0, legendWidth - 20]);

        const tickInterval = (colorDomain[1] - colorDomain[0]) / 3;
        const tickValues = d3.range(colorDomain[0], colorDomain[1] + tickInterval, tickInterval);
            

        const legendAxis = d3.axisBottom(legendScale)
            .tickValues(tickValues);


        legendSvg.append("g")
            .attr("transform", `translate(20,${legendHeight - 5})`)
            .call(legendAxis)
            .style("font-size", ".8rem");

    }
    updateClickedDistrict() {
        this.clickedDistrict.forEach(district => {
            const path = this.features.selectAll("path").filter(d => d.properties.NAME_1 === district);
            path.style("opacity", "0.5")
                .style("stroke", "black")
                .style("stroke-width", "2.5px");
        });
    }
    clickDistrict(event, d) {

        const district = d.properties.NAME_1;
        const isClicked = this.clickedDistrict.includes(district);

        d3.select(event.target)
            .style("opacity", isClicked ? "1" : "0.5")
            .style("stroke", isClicked ? null : "black")
            .style("stroke-width", isClicked ? null : "2.5px");
        
        if (isClicked) {
            this.clickedDistrict = this.clickedDistrict.filter(d => d !== district);
        } else {
            this.clickedDistrict.push(district);
        }

        if (this.handlers["click"]) {
            this.handlers["click"](this.clickedDistrict);
        }
    }

    showTooltip(event, d) {
        const district = d.properties.NAME_1;

        d3.select(event.target)
            .style("opacity", 0.5)
            .style("stroke", "black")
            .style("stroke-width", "2.5px")
            .style("cursor", "pointer")

        d3.select("#choropleth-tooltip")
            .style("top", (event.pageY + 20) + "px")
            .style("left", (event.pageX + 20) + "px")
            .select("#choropleth-district-name")
            .text(district);
    
        const tooltipInfo = d3.select("#choropleth-tooltip").select("#district-info-container")
        tooltipInfo.selectAll("*").remove();

        if(this.encoding === 'count') {
            const districtData = this.districtData.find(dd => dd.district === district);
            tooltipInfo.append("div")
                .attr("class", "choropleth-tooltip-field")
                .html("<span class='field-name'>Number of listings : </span><span class='field-value'>" + districtData.count + "</span>")
        } else if(this.encoding === 'price') {
            const districtData = this.districtData.find(dd => dd.district === district);
            tooltipInfo.append("div")
                .attr("class", "choropleth-tooltip-field")
                .html("<span class='field-name'>Average price : </span><span class='field-value'>" + districtData.avgPrice + "</span>")
        
            tooltipInfo.append("div")
                .attr("class", "choropleth-tooltip-field")
                .html("<span class='field-name'>Median price : </span><span class='field-value'>" + districtData.medPrice + "</span>")
        

            tooltipInfo.append("div")
                .attr("class", "choropleth-tooltip-field")
                .html("<span class='field-name'>Minimum price : </span><span class='field-value'>" + districtData.minPrice + "</span>")

            tooltipInfo.append("div")
                .attr("class", "choropleth-tooltip-field")
                .html("<span class='field-name'>Maximum price : </span><span class='field-value'>" + districtData.maxPrice + "</span>")
            
        } else {
            const districtData = this.districtData.find(dd => dd.district === district);
            tooltipInfo.append("div")
                .attr("class", "choropleth-tooltip-field")
                .html("<span class='field-name'>Average review rating : </span><span class='field-value'>" + districtData.avgReviewRating + "</span>")
        
            tooltipInfo.append("div")
                .attr("class", "choropleth-tooltip-field")
                .html("<span class='field-name'>Median review rating : </span><span class='field-value'>" + districtData.medReviewRating + "</span>")

            tooltipInfo.append("div")
                .attr("class", "choropleth-tooltip-field")
                .html("<span class='field-name'>Minimum review rating : </span><span class='field-value'>" + districtData.minReviewRating + "</span>")
        

            tooltipInfo.append("div")
                .attr("class", "choropleth-tooltip-field")
                .html("<span class='field-name'>Maximum review rating : </span><span class='field-value'>" + districtData.maxReviewRating + "</span>")
            

            tooltipInfo.append("div")
                .attr("class", "choropleth-tooltip-field")
                .html("<span class='field-name'>Average review count : </span><span class='field-value'>" + districtData.avgReviewCount + "</span>")}


        d3.select("#choropleth-tooltip").classed("hidden", false);
    }

    hideTooltip(event, d) {
        const district = d.properties.NAME_1;
        
        if(!this.clickedDistrict.includes(district)) {
            d3.select(event.target)
                .style("opacity", 1)
                .style("stroke", null)
                .style("stroke-width", null)
        }

        d3.select("#choropleth-tooltip").classed("hidden", true);
    }
    

    setupZoom() {
        const zoom = d3.zoom()
            .scaleExtent([1, 20])
            .on("zoom", (event) => this.zoomed(event));

        this.svg.call(zoom);
    }

    zoomed(event) {
        this.features.attr("transform", event.transform);
    }

    resize() {
        this.width = parseInt(d3.select("#choropleth-container").style("width"));
        this.height = this.width * this.mapRatio;
        this.height = Math.max(this.height, 500);
        this.projection = d3.geoMercator()
            .translate([this.width / 2, this.height / 2])
            .scale(this.width * this.mapRatio * this.mapRatioAdjuster)
            .center(this.hongKongCenter);

        this.svg.style("width", this.width + "px").style("height", this.height + "px");
        this.svg.selectAll("path").attr("d", this.path);
        this.setupZoom();
    }


}
