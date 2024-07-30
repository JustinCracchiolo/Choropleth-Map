let educationUrl = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json"
let countyUrl = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json"


let countyData
let educationData

let canvas = d3.select('#canvas')
let tooltip = d3.select('#tooltip')

let drawMap = () => {
    canvas.selectAll('path')
          .data(countyData)
          .enter()
          .append('path')
          .attr('d', d3.geoPath())
          .attr('class', 'county')
          .attr('fill', (countyItem) => {
                let id = countyItem['id']
                let county = educationData.find((item)=> {
                    return item['fips'] === id
                })
                let percentage = county['bachelorsOrHigher']
                if (percentage <= 15) {
                    return 'red'
                }
                else if (percentage <= 30) {
                    return 'orange'
                }
                else if (percentage <= 45) {
                    return 'lime'
                }
                else {
                    return 'green'
                }
          })
          .attr('data-fips', (countyItem) => {
                return countyItem['id']
          })
          .attr('data-education', (countyItem) => {
            let id = countyItem['id']
            let county = educationData.find((item)=> {
                return item['fips'] === id
            })
            let percentage = county['bachelorsOrHigher']
            return percentage
          })
          .on('mouseover', (countyItem) => {
                tooltip.transition()
                    .style('visibility', 'visible')
                
                let id = countyItem['id']
                let county = educationData.find((item)=> {
                    return item['fips'] === id
                })
                let percentage = county['bachelorsOrHigher']
                let name = county['area_name']
                tooltip.text(name + " " + percentage)

                tooltip.attr('data-education', percentage)
          })
          .on('mouseout', (countyItem)=> {
                tooltip.transition()
                    .style('visibility', 'hidden')
          })
}

d3.json(countyUrl).then(
    (data, error) => {
        if (error) {
            console.log(error)
        }
        else {
            countyData = topojson.feature(data, data.objects.counties).features //d3.json automatically converts to js object
            console.log(countyData)
            d3.json(educationUrl).then(
                (data, error) => {
                    if(error) {
                        console.log(error)
                    }
                    else {
                        educationData = data
                        console.log(educationData)
                        drawMap()
                    }
                }
            )
        }
    }
)




