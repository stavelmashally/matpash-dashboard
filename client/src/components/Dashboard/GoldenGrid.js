import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import axios from 'axios';
import './ResponsiveGrid.css';
import { Header, Segment, Statistic, Divider, Icon } from 'semantic-ui-react';
import { numberWithCommas } from './NumWithCommas';

const GoldenGrid = props => {
  const [goldens, setGoldens] = useState([]);
  const [goldensResponse, setGoldenResponse] = useState(false);
  const goldensRef = React.useRef('goldens');

  const ResponsiveGridLayout = WidthProvider(Responsive);

  const deleteGolden = async id => {
    try {
      const response = await axios.delete('/api/dashboard/remove-golden/' + id);
      const { data } = response.data;
    } catch (error) {
      console.log(error);
    }
    getGoldens();
  };
  // chartRef = useMemo(() => highChartsOptions.map((_i) => React.createRef()), []);
  const onResizeStop = useCallback((event, index) => {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    });
  }, []);

  const getGoldens = async () => {
    const response = await axios.get('/api/dashboard/get-goldens/');
    if (response.data.goldensList !== undefined) {
      setGoldens(response.data.goldensList);
    }
  };

  const calcSummarized = entireGolden => {
    let tmp = entireGolden.goldens;
    var result = [
      tmp.reduce((acc, n) => {
        for (var prop in n) {
          if (acc.hasOwnProperty(prop)) acc[prop] += n[prop];
          else acc[prop] = n[prop];
        }
        return acc;
      }, {}),
    ];
    return numberWithCommas(parseFloat(result[0].periodValue).toFixed(2));
  };

  const calcSummarizedChange = entireGolden => {
    let tmp = entireGolden.goldens;
    var result = [
      tmp.reduce((acc, n) => {
        for (var prop in n) {
          if (acc.hasOwnProperty(prop)) acc[prop] += n[prop];
          else acc[prop] = n[prop];
        }
        return acc;
      }, {}),
    ];
    entireGolden.sum = result[0].periodValue - result[0].periodCmpValue;

    return calcGoldenData(result[0]);
  };

  const calcGoldenData = MappedGolden => {
    console.log(MappedGolden);
    return MappedGolden.periodValue - MappedGolden.periodCmpValue < 0
      ? numberWithCommas(
          -1 *
            parseFloat(
              MappedGolden.periodValue - MappedGolden.periodCmpValue,
            ).toFixed(2),
        )
      : numberWithCommas(
          parseFloat(
            MappedGolden.periodValue - MappedGolden.periodCmpValue,
          ).toFixed(2),
        );
  };

  useEffect(() => {
    getGoldens();
  }, []);

  return (
    <div>
      <ResponsiveGridLayout
        onResizeStop={onResizeStop}
        className="layout"
        compactType="horizontal" // - for free use (need to find the right attribute)
        onLayoutChange={props.onLayoutChange}
      >
        {
          //Map..
          goldens.map(MappedMonitor => (
            <div
              data-grid={{
                x: MappedMonitor.layout.xPos,
                y: MappedMonitor.layout.yPos,
                w: MappedMonitor.goldens.length * 1.5,
                h: MappedMonitor.layout.height,
              }}
              key={MappedMonitor.layout.index}
              className="chartWrap"
            >
              <Segment inverted>
                <Header as="h3" className="monitor-title">
                  <p className="golden">{MappedMonitor.layout.title}</p>
                </Header>
                <Statistic.Group inverted>
                  <Statistic className="monitor-base" size="mini">
                    <Statistic.Label>סה"כ לתקופה</Statistic.Label>
                    <Statistic.Value>
                      {calcSummarized(MappedMonitor)}
                    </Statistic.Value>
                    <Statistic.Label>
                      שינוי ביחס לתקופה קודמת
                      <br />({calcSummarizedChange(MappedMonitor)}
                      <Icon
                        name={
                          MappedMonitor.sum > 0
                            ? 'arrow up green'
                            : MappedMonitor.sum < 0
                            ? 'arrow down red'
                            : 'hand point left outline blue'
                        }
                      />
                      )
                    </Statistic.Label>
                  </Statistic>
                </Statistic.Group>
                <Divider className="monitor-divider" inverted />
                <Statistic.Group inverted>
                  {MappedMonitor.goldens.map(MappedGolden => (
                    <Statistic className="monitor-base" size="mini">
                      <Statistic.Label>{MappedGolden.subTitle}</Statistic.Label>
                      <Statistic.Label>
                        {parseFloat(MappedGolden.periodValue).toFixed(2)}
                      </Statistic.Label>
                      <Statistic.Label>
                        ({calcGoldenData(MappedGolden)}
                        )
                        <Icon
                          style={{ marginLeft: '2px' }}
                          name={
                            MappedGolden.periodValue -
                              MappedGolden.periodCmpValue >
                            0
                              ? 'arrow up green'
                              : MappedGolden.periodValue -
                                  MappedGolden.periodCmpValue <
                                0
                              ? 'arrow down red'
                              : 'hand point left outline blue'
                          }
                        />
                      </Statistic.Label>
                    </Statistic>
                  ))}
                </Statistic.Group>
              </Segment>
            </div>
          ))
        }
      </ResponsiveGridLayout>
    </div>
  );
};

export default GoldenGrid;
