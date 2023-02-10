import Highcharts from 'highcharts';

export function setBasicColumnChart (id,data, chartOption ,highOption) {

    new Highcharts.chart(id, {
        chart: {
            type: 'column'
        },
        title: {
            text: chartOption.title
        },
        xAxis: {
            type: 'category',
            labels: {
                rotation: -45,
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: chartOption.unit
            }
        },
        legend: {
            enabled: false
        },
        tooltip: {
            pointFormat: `<b>{point.y} 명</b>`
        },
        series: [{
            name: 'Population',
            data: data,
            dataLabels: {
                enabled: false,
                rotation: -90,
                color: '#FFFFFF',
                align: 'right',
                y: 10, // 10 pixels down from the top
            }
        }],
        credits: {
            enabled: false
        },
    });

    Highcharts.setOptions(highOption);
}