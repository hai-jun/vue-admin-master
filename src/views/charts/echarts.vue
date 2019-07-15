<template>
    <section class="chart-container">
        <el-row>
            <el-col :span="12">
                <el-form :inline="true">
                    <el-form-item>
                        <el-date-picker v-model="date"  @change="logTimeChange" type="month" value-format="yyyy-MM" placeholder="选择月"></el-date-picker>
                    </el-form-item>
                </el-form>
                <div id="chartColumn" style="width:100%; height:400px;"></div>
            </el-col>
            <el-col :span="12">
                <el-form>
                    <el-form-item>
                        <el-date-picker v-model="date1"  @change="logTimeChange1" type="year" value-format="yyyy" placeholder="选择年"></el-date-picker>
                    </el-form-item>
                </el-form>
                <div id="chartBar" style="width:100%; height:400px;"></div>
            </el-col>
            <el-col :span="12">
                <el-form>
                    <el-form-item>
                        <el-date-picker v-model="date2"  @change="logTimeChange2" type="year" value-format="yyyy" placeholder="选择年"></el-date-picker>
                    </el-form-item>
                </el-form>
                <div id="chartOrder" style="width:100%; height:400px;"></div>
            </el-col>
        </el-row>
    </section>
</template>

<script>
    import echarts from 'echarts'
    import {
        getGoodsTypeList,       //查询所有的商品名称也就是类型
        getGoodsTotalList,      //获取出货物品的名称和数目
        getShouruList,          //获取收入列表
        getZhichuList,          //获取支出列表
        getFinishedOrderCount,  //获取已完成订单数量
        getAddedOrderCount,     //获取本月新增订单数量
    } from '../../api/axiosapi'
    export default {
        data() {
            return {
                chartColumn: null,
                chartBar: null,
                date: new Date(),
                date1: new Date(),
                goodsTypeList: ['aaa','bbb'],          //储存的是铁线类型
                goodsTotalList: [{
                    "name":"aaa","value":100
                }],         //储存的是铁线类型和每种类型铁线的质量
                shouruList: [],         //收入
                zhichuList: [],         //支出

                //折线图
                date2: new Date(),
                chartOrder: null,
                finishedCount: [],
                addedCount: [],
            }
        },
        created() {
            
        },
        methods: {
            //统计月接单量和完成订单量日期控件改变时
            logTimeChange2(val){
                this.date2 = val;
                this.initOrder();
            },
            //比较使用量的圆饼图的日期改变时
            logTimeChange(val){
                this.date = val;
                this.selectGoodsTotal();
            },
            //比较收入和支出的日期空间改变时
            logTimeChange1(val){
                this.date1 = val;
                this.selectShouru();
                this.selectZhichu();
            },
            //查询所有铁线类型
            getTXType() {
                getGoodsTypeList().then(res => {
                    let {code,msg,data} = res
                    if(code == 200){
                        var list = JSON.parse(JSON.stringify(data));
                        this.goodsTypeList = list;

                        //
                        this.selectGoodsTotal()
                    }else{
                        this.$message.error(msg)
                    }
                })
            },
            //初始化圆饼图的数据
            selectGoodsTotal(){
                var params = {"date": this.date}
                getGoodsTotalList(params).then(res => {
                    let {code,msg,data} = res
                    if(code==200){
                        var list = JSON.parse(JSON.stringify(data))
                        this.goodsTotalList = list

                        //初始化圆饼图，这一步一定要在数据查询到之后执行
                        this.drawColumnChart()
                    }else{
                        this.$message.error(msg)
                    }
                })
            },

            //初始化比较收入支出柱状图的收入数据
            selectShouru(){
                var params = {"year": this.date1}
                getShouruList(params).then(res => {
                    let {code,msg,data} = res
                    if(code==200){
                        this.shouruList = JSON.parse(JSON.stringify(data))
                        this.drawBarChart();
                    }else{
                        this.$message.error(msg)
                    }
                })
            },
            //初始化比较收入支出柱状图的支出数据
            selectZhichu(){
                var params = {"year": this.date1}
                getZhichuList(params).then(res => {
                    let {code,msg,data} = res
                    if(code==200){
                        this.zhichuList = JSON.parse(JSON.stringify(data))
                        this.drawBarChart();
                    }else{
                        this.$message.error(msg)
                    }
                })
            },

            //初始化月订单接收量和订单完成量
            initOrder() {
                var params = {'year': this.date2}
                getFinishedOrderCount(params).then(res => {
                    let {code,msg,data} = res;
                    if(code==200){
                        this.finishedCount = [];
                        this.finishedCount = JSON.parse(JSON.stringify(data))
                        this.drawLine();
                    }else{
                        this.$message.error(msg);
                    }
                })
                getAddedOrderCount(params).then(res => {
                    let {code,msg,data} = res
                    if(code==200){
                        var a = JSON.parse(JSON.stringify(data))
                        this.addedCount = []
                        this.addedCount = a
                        this.drawLine();
                    }else{
                        this.$$message.error(msg);
                    }
                })
            },
            drawLine() {
                this.chartOrder = echarts.init(document.getElementById('chartOrder'));
                this.chartOrder.setOption({
                    title: {
                        text: '接单与完成统计'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data:['接单量','完成量']
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            name:'完成量',
                            type:'line',
                            data: this.finishedCount
                        },
                        {
                            name:'接单量',
                            type:'line',
                            data: this.addedCount
                        }
                    ]
                })
            },
            drawColumnChart() {
                this.chartColumn = echarts.init(document.getElementById('chartColumn'));
                this.chartColumn.setOption({
                    title : {
                        text: '月铁线使用量对比',
                        subtext: '以出货的质量作为统计标准',
                        x:'center'
                    },
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: this.goodsTotalList
                    },
                    series : [
                        {
                            name: '详情 (单位/kg)',
                            type: 'pie',
                            radius : '70%',
                            center: ['50%', '60%'],
                            data: this.goodsTotalList,
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                });
            },
            drawBarChart() {
                this.chartBar = echarts.init(document.getElementById('chartBar'));
                this.chartBar.setOption({
                    title : {
                        text: '月度收入和支出对比（单位/元)',
                        subtext: '以进货消费和出货收入做为统计标准',
                        x:'center'
                    },
                    color: ['#003366', '#e5323e'],
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    legend: {
                        data: ['收入', '支出'],
                        bottom: 'bottom',
                    },
                    toolbox: {
                        show: true,
                        orient: 'vertical',
                        left: 'right',
                        top: 'center',
                        feature: {
                            mark: {show: true},
                            dataView: {show: true, readOnly: false},
                            magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                            restore: {show: true},
                            saveAsImage: {show: true}
                        }
                    },
                    calculable: true,
                    xAxis: [
                        {
                            type: 'category',
                            axisTick: {show: false},
                            data: ['1月', '2月', '3月', '4月', '5月','6月', '7月', '8月', '9月', '10月', '11月' ,'12月']
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value'
                        }
                    ],
                    series: [
                        {
                            name: '收入',
                            type: 'bar',
                            barGap: 0,
                            data: this.shouruList
                        },
                        {
                            name: '支出',
                            type: 'bar',
                            data: this.zhichuList
                        }
                    ]
                });
            },
        },

        mounted: function () {
            //查询所有铁线类型
            this.getTXType();
            
            
            //统计收入和支出s
            this.selectShouru();
            this.selectZhichu();

            //统计订单接单与完成量
            this.initOrder();
        },
    }
</script>

<style scoped>
    .chart-container {
        width: 100%;
        float: left;
    }
    /*.chart div {
        height: 400px;
        float: left;
    }*/

    .el-col {
        padding: 30px 20px;
    }
</style>
