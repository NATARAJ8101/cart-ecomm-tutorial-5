import React, { Component, ReactDOM } from "react";
import ApexCharts from "apexcharts";
import ReactApexChart from "react-apexcharts";
import ItemSelector from "./ItemSelector";
//import TimelineChart from "./TimelineChart";
//https://apexcharts.com/react-chart-demos/pie-charts/simple-donut/

class PurchasingChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lineAmountSold: [],
            itemTotalSales: 0,
            active: "default",
            quantity: 0,
            series: [44, 55, 41, 17, 15],
            options: {
                labels: [],
                chart: {
                    type: 'donut',
                },
                responsive: [{
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 200
                        },
                        legend: {
                            position: 'bottom'
                        }
                    }
                }]
            },

            lineChartOptions: {
                chart: {
                    height: 350,
                    type: 'line',
                    zoom: {
                        enabled: false
                    }
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    curve: 'straight'
                },
                title: {
                    text: 'Product Trends by Month',
                    align: 'left'
                },
                grid: {
                    row: {
                        colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                        opacity: 0.5
                    },
                },
                xaxis: {
                    categories: [],
                    //categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
                }
            }
        };

        this.populateFields = this.populateFields.bind(this);
    }
    //{"saleId":"hank@testing.com:2022-04-20T13:32:57","itemName":"gloves","price":"6.00"}
    populateFields = () => {

        let tempQty = 0;

        let selectedNum = document.querySelector("[name='itemSelect']").value;
        let selected = this.props.items[Number(selectedNum)].itemName;
        tempQty = this.props.items[Number(selectedNum)].stockQty;
        let tempUserList = [];
        let tempOptions = [];
        //START LINE CHART JS
        let tempDates = [];
        let tempAmountSold = [];

        for (let i = 0; i < this.props.timeSelected.length; i++) {
            const user = this.props.timeSelected[i].saleId.substring(0, this.props.timeSelected[i].saleId.indexOf(":"));
            if (tempUserList.indexOf(user) === -1) {
                tempUserList.push(user);
                tempOptions.push(0);
            }
            /////START LINE CHART JS
            let tempDayOfSale = this.props.timeSelected[i].saleId.substring(this.props.timeSelected[i].saleId.indexOf(":") + 1);
            tempDayOfSale = tempDayOfSale.substring(5, 10);
            if (tempDates.indexOf(tempDayOfSale) === -1) {
                tempDates.push(tempDayOfSale);
                tempAmountSold.push(0);
            }
        }
        tempUserList = tempUserList.sort();
        for (let i = 0; i < this.props.timeSelected.length; i++) {
            const tempUser = this.props.timeSelected[i].saleId.substring(0, this.props.timeSelected[i].saleId.indexOf(":"));
            if (this.props.timeSelected[i].itemName === selected) {
                tempOptions[tempUserList.indexOf(tempUser)] = (tempOptions[tempUserList.indexOf(tempUser)] + 1)
            }
            /////START LINE CHART JS
            let tempDayOfSale = this.props.timeSelected[i].saleId.substring(this.props.timeSelected[i].saleId.indexOf(":") + 1);
            tempDayOfSale = tempDayOfSale.substring(5, 10);

            if (tempDates.indexOf(tempDayOfSale) !== -1 && this.props.timeSelected[i].itemName === selected) {
                tempAmountSold[tempDates.indexOf(tempDayOfSale)] = (Number(tempAmountSold[tempDates.indexOf(tempDayOfSale)]) + 1);
            }
        }

        let tempTotal = tempOptions.reduce(function (a, b) { return a + b; }, 0);

        this.setState({
            lineChartOptions: {
                xaxis: {
                    categories: tempDates,
                }
            },
            lineAmountSold: tempAmountSold,
            itemTotalSales: tempTotal,
            active: selected,
            quantity: tempQty,
            series: tempOptions,
            options: {
                labels: tempUserList,
            }
        });

    }


    render() {


        return (
            <div className="row">
                <div className="col-md-12">
                    <h2 className="my-3">Analytics</h2>
                    <ItemSelector populateFields={this.populateFields} items={this.props.items} />
                </div>
                {this.state.itemTotalSales !== 0 ?
                    <div className="col-md-12">
                        <h4>Total sold: {this.state.itemTotalSales} out of {this.state.quantity}</h4>
                    </div> : null}
                {this.state.itemTotalSales !== 0 && this.props.timeSelected.length > 0 ? <div className="col-md-6">
                    <ReactApexChart options={this.state.options} series={this.state.series} type="donut" />
                </div> : null}
                {this.state.itemTotalSales !== 0 && this.props.timeSelected.length > 0 ? <div className="col-md-6">
                    <ReactApexChart options={this.state.lineChartOptions} series={[{ "name": this.state.active, "data": this.state.lineAmountSold }]} type="line" height={350} />
                </div> : null}
            </div>
        );
    }
}
export default PurchasingChart;