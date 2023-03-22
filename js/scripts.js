const width = 900;
const height = 500;
const padding = 40;
let req = new XMLHttpRequest();
let value = [];
const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json';
let svg;

const createTitle = () => {
    return d3.select('main')
             .append('div')
             .attr('id', 'title')
             .html('<div>Doping in Professional Bicycle Racing</div><p>35 Fastest times up Alpe d&#39;Huez</p>')
};


const createTooltip = () => {
    return d3.select('main')
             .append('div')
             .attr('id', 'tooltip')
}

const createSvg = () => {
    let svg = d3.select('main')
                .append('svg')
                .attr('width', width)
                .attr('height', height)

        return svg;        
}



const fetchData = (req) => {
    req.open('GET', url, true) // async

    return req;
}

const createScales = (value) => {
    
    const xScale = d3.scaleLinear().domain([d3.min(value, (d) => d['Year'] -1), d3.max(value, (d) => d['Year'] + 1)]).range([padding, width - padding]);

    const yScale = d3.scaleTime().domain([d3.min(value, (d) => {
         return new Date(1970, 00, 00, 00, 00, d['Seconds'])}), d3.max(value, (d) => new Date(1970, 00, 00, 00, 00, d['Seconds']))]).range([padding, height - padding]);
    

    return {xScale, yScale};
}
const createAxis = (scales) => {

              svg.append('g')
                 .call(d3.axisBottom(scales.xScale).tickFormat(d3.format('d')))
                 .attr('id', 'x-axis')
                 .attr('transform', 'translate(0, ' + (height - padding) + ')')

             svg.append('g')
                .call(d3.axisLeft(scales.yScale).tickFormat(d3.timeFormat('%M:%S')))
                .attr('id', "y-axis")
                .attr('transform', 'translate(' + padding + ',0)')    

};

const createBars = (value, scales) => {
   return svg.selectAll('circle')
       .data(value)
       .enter()
       .append('circle')
       .attr('class', 'dot')
       .attr('cx', (d) => scales.xScale(d['Year']))
       .attr('cy', (d) => scales.yScale(new Date(1970, 00, 00, 00, 00, d['Seconds'])))
       .attr('r', 6)
       .attr('data-xvalue', (d) => d['Year'])
       .attr('data-yvalue', (d) => new Date(1970, 00, 00, 00, 00, d['Seconds']))
       .attr('stroke', 'black')
       .attr('stroke-width', '1')
       .attr('fill', (d) => d['Doping'] === "" ? "yellow": "blue")
       .on('mouseover', (e, d) => {
        d3.select('#tooltip')
          .style('opacity', 0.85)
          .style('left', e.pageX + 6 + 'px')
          .style('top', e.pageY + 'px')
          .html(`<p>Date: ${d['Name']}: ${d['Nationality']}</p><p>Year: ${d['Year']}, Time: ${d['Time']}</p><p>${d['Doping']}</p>`)
          .attr('data-year', d['Year'])
    })
    .on('mouseout', () => {
        return d3.select("#tooltip")
                 .style('opacity', 0)
                 .style('left', 0)
                 .style('top', 0)
    })

}

req.onload = () => {
    value = JSON.parse(req.responseText);
    const scales = createScales(value);
    createAxis(scales);
    createBars(value, scales);
}




const driver = () => {
    createTitle();
    createTooltip();
    svg = createSvg();
    req = fetchData(req);
    req.send()
}
driver();