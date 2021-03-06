﻿import React, { useMemo, useState, useCallback, useEffect } from 'react';
import Chart from './Charts';
import { numberWithCommas } from './NumWithCommas';
import './ResponsiveGrid.css';
import { Form } from 'react-bootstrap';
import { Header } from 'semantic-ui-react';
import { connect } from 'react-redux';
import axios from 'axios';

const GraphChart = props => {
  let MappedChart = props.MappedChart;
  const [infoEditToggle, setInfoEditToggle] = useState(false);

  const editGraphInfo = async (event, graphIndex) => {
    if (!infoEditToggle) {
      setInfoEditToggle(true);
    } else {
      MappedChart.info = document
        .getElementById('textDescription')
        .value.replace(/'/g, "''")
        .replace((/"/g, `""`));
      try {
        const response = await axios.post('/api/dashboard/update-graph-info', {
          graph: MappedChart,
        });
        if (response.data.msg == 'ok') alert('גרף עודכן!');
        MappedChart.info = MappedChart.info
          .replace(/""/g, `"`)
          .replace(/''/g, "'");
      } catch (error) {
        console.log(error);
      }
      setInfoEditToggle(false);
    }
  };

  const flipGraph = async (event, index) => {
    let card = document.getElementById(index).childNodes[0];
    if (card.style.transform === '') card.style.transform = 'rotateY(-180deg)';
    else {
      card.style.transform = 'rotateY(180deg)';
      card.style.transform = '';
    }
  };

  return (
    <div className="card-flip" id={MappedChart.index}>
      <div className="card front">
        <Chart
          ref={props.chartRef[MappedChart.index]}
          className="chart"
          id={'chart-' + MappedChart.index}
          options={{
            ...MappedChart.options,
            chart: {
              events: {
                load() {
                  const chart = this;
                  chart.showLoading('...טוען גרף');
                  setTimeout(function () {
                    chart.hideLoading();
                  }, 5000);
                },
              },
              ...MappedChart.options.chart,
            },
            series: MappedChart.options.series,
            plotOptions: {
              ...MappedChart.options.plotOptions,
              series: {
                animation: {
                  duration: 5000,
                },
              },
            },
            id: MappedChart.index,
            credits: {
              enabled: false,
            },
            lang: {
              printChart: `הדפסת גרף`,
              downloadPNG: `PNG-הורדה כ`,
              downloadPDF: `PDF-הורדה כ`,
              downloadJPEG: `JPEG-הורד כ`,
              downloadSVG: `SVG-הורדה כ`,
              viewFullscreen: `צפייה במסך מלא`,
            },
            tooltip: {
              style: {
                textAlign: 'right',
                fontSize: '16px',
              },
              formatter:
                MappedChart.options.chart.type == 'pie'
                  ? function () {
                      if (this.point || this.points) {
                        console.log(this.point);
                        return `<span dir="rtl">${this.point.name}
                        <div style="padding:0"><b>${parseFloat(
                          this.point.y,
                        ).toFixed(2)}%</b></div>
                        <div style="padding:0">ערך מספרי: ${numberWithCommas(
                          parseFloat(this.point.actualValue),
                        )}</div>
                        </span>
                        `;
                      }
                    }
                  : // : null,
                    function () {
                      let x = this.x;
                      const tmpChart = this.points[0].series.chart;
                      console.log(tmpChart);
                      let valuesTooltip = tmpChart.series
                        .map(MappedSerie => {
                          for (let point of MappedSerie.points) {
                            if (point.category == this.x) {
                              return `<div dir="rtl">
                            <b>${point.series.name}: </b>
                                <div dir="ltr">${numberWithCommas(
                                  parseFloat(point.y).toFixed(2),
                                )}</div>
                                </div>`;
                            }
                          }
                        })
                        .join('');
                      console.log(valuesTooltip);
                      return `
                      <span dir="rtl">
                        <b>${this.x}</b>
                        <div style="padding:0"></div>
                        ${valuesTooltip}
                      </span>`;
                    },

              //   for (let point of this.points) {
              //     return `<span><b>${this.x}</b>
              // <div style="padding:0"><b>${parseFloat(
              //   this.y,
              // ).toFixed(2)} ${
              //       this.points[0].series.name
              //     }</b></div>
              // </span>
              // `;
              //   }
              shared: true,
              useHTML: true,
            },
            exporting: {
              buttons: {
                contextButton: {
                  menuItems: [
                    props.permissions != 'צופה'
                      ? {
                          text: "מחיקת גרף",
                          onclick: () => {
                            props.deleteChart(MappedChart.index);
                          },
                        }
                      : null,
                    {
                      text: "הצג מידע נוסף",
                      onclick: event => {
                        flipGraph(event, MappedChart.index);
                      },
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
        {infoEditToggle ? (
          <Form.Control
            id="textDescription"
            className="textDescription"
            as="textarea"
            rows={4}
            cols={20}
            style={{ width: '100%' }}
            //onBlur={handleInfoBox}
            defaultValue={MappedChart.info}
          />
        ) : (
          <p className="textDescription">{MappedChart.info}</p>
        )}
        {props.permissions != 'צופה' ? (
          <button
            className="ui left blue labeled icon button btn-edit"
            onClick={event => editGraphInfo(event, MappedChart.index)}
          >
            {infoEditToggle ? 'שמור' : 'ערוך'}
          </button>
        ) : null}
        <button
          className="ui left green labeled icon button btn-goback"
          onClick={event => flipGraph(event, MappedChart.index)}
        >
          חזור
          <i className="left arrow icon"></i>
        </button>
      </div>
    </div>
  );
};

const mapStateToProps = ({ auth: { user } }) => ({ user });
export default connect(mapStateToProps)(GraphChart);
