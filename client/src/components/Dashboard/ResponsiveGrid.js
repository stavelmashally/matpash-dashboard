import React, { useMemo, useState, useCallback } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import Chart from './Charts';
import HighchartsOptions from './HighchartsOptions';
import Highcharts from 'highcharts';
require('highcharts/modules/exporting')(Highcharts);

const defaultContextMenuButtons = Highcharts.getOptions().exporting.buttons
  .contextButton.menuItems;

function ResponsiveGrid(props) {
  const chartRef = useMemo(
    () => HighchartsOptions.map(_i => React.createRef()),
    []
  ); // Create array of refs for each chart
  const ResponsiveGridLayout = WidthProvider(Responsive);
  const [highChartsOptions, setHighChartsOptions] = useState(HighchartsOptions);
  const [layout, setLayout] = useState([]);

  const deleteChart = useCallback(id => {
    setHighChartsOptions(prevCharts => {
      return prevCharts.filter((chart, index) => {
        return index !== id;
      });
    });
  }, []);

  const onResizeStop = useCallback(
    (event, id) => {
      const chartId = id.i.slice(-1);
      chartRef[chartId].current.chart.reflow();
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      });
    },
    [chartRef]
  );

  return (
    <ResponsiveGridLayout
      onLayoutChange={props.onLayoutChange}
      onResizeStop={onResizeStop}
      className="layout"
      layout={layout}
      compactType="horizontal"
    >
      {highChartsOptions.map((MappedChart, index) => (
        <div
          data-grid={{ x: 0, y: 0, w: 3, h: 3 }}
          key={'chart-' + MappedChart.id}
          className="chartWrap"
        >
          <Chart
            ref={chartRef[MappedChart.id]}
            className="chart"
            id={'chart-' + MappedChart.id}
            options={{
              ...MappedChart,
              exporting: {
                buttons: {
                  contextButton: {
                    menuItems: [
                      {
                        text: 'Delete',
                        onclick: () => {
                          deleteChart(MappedChart.id);
                        },
                      },
                      ...defaultContextMenuButtons,
                    ],
                  },
                },
              },
            }}
          />
        </div>
      ))}
    </ResponsiveGridLayout>
  );
}

export default ResponsiveGrid;
