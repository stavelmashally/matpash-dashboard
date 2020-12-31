import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import Chart from './Charts';
import Highcharts from 'highcharts';
import {Header} from 'semantic-ui-react';
import axios from 'axios';
import "./ResponsiveGrid.css";


const HighChartsResponsiveGrid = (props) => {
  console.log(props);
  const ResponsiveGridLayout = WidthProvider(Responsive);
  const [highChartsOptions, setHighChartsOptions] = useState([]);
  const highChartsOptionsRef = React.useRef('highChartsOptions');
  
  // let chartRef = []; // Create array of refs for each chart
  const chartRef = useMemo(
    () => highChartsOptions.map(_i => React.createRef()),
    [],
  ); // Create array   of refs for each chart

  const deleteChart = async id => {
    try {
      const response = await axios.delete(
        '/api/dashboard/remove-graph-from-dashboard/' +
          props.dashboardID +
          '/' +
          id,
      );
      const { data } = response.data;
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
    getDashboard();
  };
  // chartRef = useMemo(() => highChartsOptions.map((_i) => React.createRef()), []);
  const onResizeStop = useCallback(
    (event, index) => {
      const chartId = index.i.slice(-1);
      // console.log(chartRef);
      // chartRef[chartId].current.chart.reflow();
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      });
    },
    [chartRef],
  );

  const getDashboard = async () => {
    setHighChartsOptions([]);
    if (props.dashboardID != null) {
      console.log("dashboardID: ",props.dashboardID);
      const result = await axios.get(
        '/api/dashboard/get-by-id/' + props.dashboardID,
      );
      setHighChartsOptions(result.data.dashboard.graphList);
    }
    return null;
  };

  const flipGraph = async (event,index) => {
    if(document.getElementById(index).style.transform==='')
      document.getElementById(index).style.transform = "rotateY(-180deg)";
    else {
      document.getElementById(index).style.transform = "rotateY(180deg)";
      document.getElementById(index).style.transform = "";
    }

  }

  useEffect(() => {
    highChartsOptionsRef.current = highChartsOptions;

  },[highChartsOptions]);


  useEffect(() => {
    getDashboard();
  }, [props.dashboardID]);


  return (
    <div>
      <ResponsiveGridLayout
        onResizeStop={onResizeStop}
        className="layout"
        //compactType="false" - for free use (need to find the right attribute)
        onLayoutChange={props.onLayoutChange}
      >
        {highChartsOptions.map(MappedChart => (
          <div
            data-grid={{
              x: MappedChart.options.layout.xPos,
              y: MappedChart.options.layout.yPos,
              w: MappedChart.options.layout.width,
              h: MappedChart.options.layout.height,
            }}
            key={MappedChart.index}
            className="chartWrap"
          >
            <div className="card-flip" id ={MappedChart.index}>
                <div className="card front">
                <Chart
                  ref={chartRef[MappedChart.index]}
                  className="chart"
                  id={'chart-' + MappedChart.index}
                  options={{
                    // ...MappedChart,
                    id: MappedChart.index,
                    chart: {
                      type: MappedChart.options.chart.type,
                      zoomType: MappedChart.options.chart.zoomType,
                    },
                    legend: {
                      ...MappedChart.options.legend,
                      rtl: true,
                    },
                    title: {
                      text: MappedChart.options.title.text,
                    },
                    subtitle: {
                      text: MappedChart.options.subtitle.text,
                    },
                    tooltip: {
                      ...MappedChart.options.tooltip,
                    
                    }, 
                    plotOptions: {
                      column: {
                        pointPadding: 0.2,
                        borderWidth: 0,
                      },
                      pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                          distance:
                            MappedChart.options.plotOptions.pie.dataLabels.distance,
                          enabled:
                            MappedChart.options.plotOptions.pie.dataLabels.enabled,
                        },
                        showInLegend: true,
                        startAngle: MappedChart.options.plotOptions.pie.startAngle,
                        endAngle: MappedChart.options.plotOptions.pie.endAngle,
                        center: MappedChart.options.plotOptions.pie.center,
                        size: MappedChart.options.plotOptions.pie.size,
                      },
                    },
                    series: MappedChart.options.series.map(obj => ({
                      name: obj.name,
                      data: obj.data,
                      color: obj.colr,
                    })),
                    yAxis: MappedChart.options.yAxis,
                      // min: 4500,
                    xAxis: {
                      categories: MappedChart.options.xAxis.catagories,
                      labels: {
                        style: {
                          color: 'black',
                        },
                        type: MappedChart.options.xAxis.type,
                      },
                    },     
                    credits:  {
                      enabled: false,
                    },
                    lang: {
                      printChart: "<p style='text-align:right'>הדפסת גרף</p>",
                      downloadPNG:  "<p style='text-align:right'>PNG-הורדה כ</p>",
                      downloadPDF: "<p style='text-align:right'>PDF-הורדה כ </p>",
                      downloadJPEG: "<p style='text-align:right'>JPEG-הורד כ</p>",
                      downloadSVG: "<p style='text-align:right'>SVG-הורדה כ </p>",
                      viewFullscreen:  "<p style='text-align:right'>צפייה במסך מלא</p>"
                    },
                    exporting: {
                      buttons: {
                        contextButton: {
                          menuItems: [ (props.permissions!='צופה') ? 
                            {
                              text: "<p style='text-align:right'>מחיקת גרף </p>",
                              onclick: () => {
                                deleteChart(MappedChart.index);
                              } 
                            } : null,
                            {
                              text: "<p style='text-align:right'>הצג מידע נוסף </p>",
                              onclick: (event) => {
                                flipGraph(event,MappedChart.index);
                              }
                            },
                            ...Object.values(props.userGraphOptions),
                          ],
                        },
                      },
                    },
                  }}
                />
                </div>
                <div className="card back">
                <Header as="h3">
                  <p>{MappedChart.options.title.text}</p>
                </Header>
                  <p>
                    luram,luramluramluraramluraramluraramluramluram,luramluramluramluram,luramluram
                  </p>

                  <button className="ui left green labeled icon button btn-goback" onClick={(event) => flipGraph(event,MappedChart.index)}>
                    חזור
                    <i className="left arrow icon"></i>
                  </button>
                </div>
            </div>
          </div>
        ))}
      </ResponsiveGridLayout>
      {/* <Route path="/CreateChart" exact render={() => <CreateChart />} /> */}
    </div>
  );
}

export default HighChartsResponsiveGrid;