import { $, jQuery } from 'jquery';
// export for others scripts to use
window.$ = $;
window.jQuery = jQuery;

class ChartBuilder {
    constructor(url, data) {
        this.url = url
        this.data = data
        this.chartType = chartType
    }

    setChartType(chartType) {
        this.chartType = chartType
    }

    getDataForGraph() {
        $.ajax({
            type: "POST",
            url: "http://localhost:3000/getGraph",
            data: data,
            success: success,
            dataType: dataType
        }, (data, status) => {
            console.log(data)
            return data
        })
    }

    createCanvas() {

    }

}