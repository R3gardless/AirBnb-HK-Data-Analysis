class Histogram {
    
    margin = {
        top: 10, right: 10, bottom: 50, left: 50
    }

    constructor(selector, data) {
        this.selector = selector;
        this.data = data;

        this.showTooltip = this.showTooltip.bind(this);
        this.hideTooltip = this.hideTooltip.bind(this);
    }

    initializeData() {
        this.roomTypeData = d3.rollups(
            this.data,
            v => ({
                count: v.length,
                minPrice: Math.min(...v.map(d => +d.price)),
                maxPrice: Math.max(...v.map(d => +d.price)),
                averagePrice: Math.round(d3.mean(v, d => +d.price)),
                medianPrice: Math.round(d3.median(v, d => +d.price)),
                minReview: Math.min(...v.map(d => +d.number_of_reviews)),
                maxReview: Math.max(...v.map(d => +d.number_of_reviews)),
                averageReview: Math.round(d3.mean(v, d => +d.number_of_reviews)),
                medianReview: Math.round(d3.median(v, d => +d.number_of_reviews)),
                minAccommodate: Math.min(...v.map(d => +d.accommodates)),
                maxAccommodate: Math.max(...v.map(d => +d.accommodates)),
                averageAccommodate: Math.round(d3.mean(v, d => +d.accommodates)),
                medianAccommodate: Math.round(d3.median(v, d => +d.accommodates)),
            }),
            d => d.room_type
        )
    }

    initialize() {
        this.svg = d3.select(this.selector);
        this.container = this.svg.append("g");
        this.xAxis = this.svg.append("g");
        this.yAxis = this.svg.append("g");
        this.legend = this.svg.append("g");

        this.xScale = d3.scaleBand().padding(0.1);
        this.yScale = d3.scaleLinear();
        this.initializeData();
        this.resize();

        d3.select(window).on("resize", () => this.resize());

        this.update();
    }

    update(clickedDistrict=[], encoding="count", encodingOption="min") {
        let data = [];
        this.encoding = encoding;
        this.encodingOption = encodingOption;
        if (clickedDistrict.length === 0) {
            data = this.roomTypeData;
        } else {
            // Iterate Clicked Districts and gather data
            let tmp = []
            clickedDistrict.forEach(district => {
                this.data.filter(d => d.district === district).forEach(d => {
                    tmp.push(d);
                });
            });
            data = d3.rollups(
                tmp,
                v => ({
                    count: v.length,
                    minPrice: Math.min(...v.map(d => +d.price)),
                    maxPrice: Math.max(...v.map(d => +d.price)),
                    averagePrice: Math.round(d3.mean(v, d => +d.price)),
                    medianPrice: Math.round(d3.median(v, d => +d.price)),
                    minReview: Math.min(...v.map(d => +d.number_of_reviews)),
                    maxReview: Math.max(...v.map(d => +d.number_of_reviews)),
                    averageReview: Math.round(d3.mean(v, d => +d.number_of_reviews)),
                    medianReview: Math.round(d3.median(v, d => +d.number_of_reviews)),
                    minAccommodate: Math.min(...v.map(d => +d.accommodates)),
                    maxAccommodate: Math.max(...v.map(d => +d.accommodates)),
                    averageAccommodate: Math.round(d3.mean(v, d => +d.accommodates)),
                    medianAccommodate: Math.round(d3.median(v, d => +d.accommodates)),
                }),
                d => d.room_type
            )
        }

        const encodingKey = encoding === "count" ? "count" : `${encodingOption}${encoding.charAt(0).toUpperCase() + encoding.slice(1)}`;

        // Flatten data
        data = data.map(([room_type, values]) => ({ room_type, ...values }));
        // Update scales
        this.xScale.domain(data.sort((a, b) => d3.ascending(a.room_type, b.room_type)).map(d => d.room_type))
            .range([0, this.width])
            .padding(0.3);
        this.yScale.domain([0, d3.max(data, d => d[encodingKey])]).range([this.height, 0]);

        // Define a color scale
        const colorScale = d3.scaleOrdinal()
            .domain(data.map(d => d.room_type))
            .range(d3.schemeCategory10);  // Or use your own array of colors


        this.container.selectAll("rect")
            .data(data)
            .join("rect")
            .attr("x", d => this.xScale(d.room_type))
            .attr("y", d => this.yScale(d[encodingKey]))
            .attr("width", this.xScale.bandwidth())
            .attr("height", d => this.height - this.yScale(d[encodingKey]))
            .attr("fill", d => colorScale(d.room_type))
            .on("mousemove", this.showTooltip)
            .on("mouseout", this.hideTooltip);

        
        this.xAxis
            .attr("transform", `translate(${this.margin.left}, ${this.margin.top + this.height})`)
            .transition()
            .call(d3.axisBottom(this.xScale))
            .style("font-size", ".9rem");
        
        this.yAxis
            .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`)
            .transition()
            .call(d3.axisLeft(this.yScale).ticks(5))
            .style("font-size", ".9rem");
    }


    showTooltip(event, d) {
        const roomType = d.room_type;

        d3.select(event.target)
            .style("opacity", 0.5)
            .style("stroke", "black")
            .style("stroke-width", "1.5px")

        d3.select("#histogram-tooltip")
            .style("top", (event.pageY + 20) + "px")
            .style("left", (event.pageX + 20) + "px")
            .select("#histogram-room-type")
            .text(roomType)
        
        const tooltipInfo = d3.select("#histogram-tooltip").select("#histogram-info-container")
        tooltipInfo.selectAll("*").remove();

        if(this.encoding === "count") {
            tooltipInfo.append("div")
                .attr("class", "tooltip-field")
                .html("<span class='field-name'># of " + roomType + " : </span><span class='field-value'>" + d.count + "</span>")
        } else if(this.encoding === "price") {
            switch (this.encodingOption) {
                case "min":
                    tooltipInfo.append("div")
                        .attr("class", "tooltip-field")
                        .html("<span class='field-name'>Min Price : </span><span class='field-value'>" + d.minPrice + "</span>")
                    break;
                case "max":
                    tooltipInfo.append("div")
                        .attr("class", "tooltip-field")
                        .html("<span class='field-name'>Max Price : </span><span class='field-value'>" + d.maxPrice + "</span>")
                    break;
                case "median":
                    tooltipInfo.append("div")  
                        .attr("class", "tooltip-field")
                        .html("<span class='field-name'>Median Price : </span><span class='field-value'>" + d.medianPrice + "</span>")
                    break;
                default:
                    tooltipInfo.append("div")
                        .attr("class", "tooltip-field")
                        .html("<span class='field-name'>Average Price : </span><span class='field-value'>" + d.averagePrice + "</span>")
                    break;

            }
        } else if(this.encoding === "accommodate") {
            switch (this.encodingOption) {
                case "min":
                    tooltipInfo.append("div")
                        .attr("class", "tooltip-field")
                        .html("<span class='field-name'>Min Accommodate : </span><span class='field-value'>" + d.minAccommodate + "</span>")
                    break;
                case "max":
                    tooltipInfo.append("div")
                        .attr("class", "tooltip-field")
                        .html("<span class='field-name'>Max Accommodate : </span><span class='field-value'>" + d.maxAccommodate + "</span>")
                    break;
                case "median":
                    tooltipInfo.append("div")  
                        .attr("class", "tooltip-field")
                        .html("<span class='field-name'>Median Accommodate : </span><span class='field-value'>" + d.medianAccommodate + "</span>")
                    break;
                default:
                    tooltipInfo.append("div")
                        .attr("class", "tooltip-field")
                        .html("<span class='field-name'>Average Accommodate : </span><span class='field-value'>" + d.averageAccommodate + "</span>")
                    break;
            }
        } else {
            switch (this.encodingOption) {
                case "min":
                    tooltipInfo.append("div")
                        .attr("class", "tooltip-field")
                        .html("<span class='field-name'>Min Review # : </span><span class='field-value'>" + d.minReview + "</span>")
                    break;
                case "max":
                    tooltipInfo.append("div")
                        .attr("class", "tooltip-field")
                        .html("<span class='field-name'>Max Review # : </span><span class='field-value'>" + d.maxReview + "</span>")
                    break;
                case "median":
                    tooltipInfo.append("div")  
                        .attr("class", "tooltip-field")
                        .html("<span class='field-name'>Median Review # : </span><span class='field-value'>" + d.medianReview + "</span>")
                    break;
                default:
                    tooltipInfo.append("div")
                        .attr("class", "tooltip-field")
                        .html("<span class='field-name'>Average Review # : </span><span class='field-value'>" + d.averageReview + "</span>")
                    break;
            }
        }


        d3.select("#histogram-tooltip").classed("hidden", false);
    }

    hideTooltip(event) {
        
        d3.select(event.target)
            .style("opacity", 1)
            .style("stroke", null)
            .style("stroke-width", null)

        d3.select("#histogram-tooltip").classed("hidden", true);
    }


    resize() {
        let updateFlag = false;
        const currentWidth = parseInt(d3.select(".container").style("width")) / 2 - 50;
        if(currentWidth != this.width) updateFlag = true;
        this.width = parseInt(d3.select(".container").style("width")) / 2 - 50 - this.margin.left - this.margin.right;
    
        this.width = Math.max(this.width, 420);
        this.height = this.width;
        this.svg
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom);

        this.container.attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);

        if(updateFlag && this.width > 420) this.update();
    }
}