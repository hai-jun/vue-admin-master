import axios from 'axios'
import axiosHttp from '../common/axiosHttp'

//export const stock = params => {return axiosHttp.axiosPost('/order/xStock/stock',params)}
export const stock = params => {return axiosHttp.axiosPost("/order/xStock/stock", params)}
export const login = params => {return axiosHttp.axiosPost("/usertoken/login.do", params)}
export const getOrderListPage = params => {return axiosHttp.axiosPost("/order/xOrder/getOrderListPage", params)}

//查询订单明细
export const selectOrderDetails = params => {return axiosHttp.axiosPost("/order/xOrderDetails/getDetailsByOrderId", params)}

//在订单明细未完成的情况下关闭订单
export const closeOrder = params => {return axiosHttp.axiosPost("/order/xOrder/closeOrder", params)}

//注册
export const register = params => {return axiosHttp.axiosPost("/order/xUser/register", params)}

//修改信息
export const submit = params => {return axiosHttp.axiosPost("/order/xUser/changeUser", params)}

//修改密码
export const changePwd = params => {return axiosHttp.axiosPost("/order/xUser/changePwd", params)}

//删除订单
export const removeOrder = params => {return axiosHttp.axiosPost("/order/xOrder/removeOrder", params)}

//删除订单明细
export const delOrderDetails = params => {return axiosHttp.axiosPost("/order/xOrderDetails/delOrderDetails", params)}

//查询下拉框的内容
export const selectStock = ()=> {return axiosHttp.axiosPost("/order/xStock/selectStock")}

//保存订单和订单明细
export const saveOrder = params => {return axiosHttp.axiosPost("/order/xOrder/addOrder", params)}

//保存进货信息和进货明细
export const addJinhuo = params => {return axiosHttp.axiosPost("/order/xJinhuo/addJinhuo", params)}

//根据条件查询进货清单
export const getJHList = params => {return axiosHttp.axiosPost("/order/xJinhuo/getJHList", params)}

//根据进货单号查询明细
export const selectDetails = params => {return axiosHttp.axiosPost("/order/xJinhuoDetails/selectDetails", params)}

//删除明细
export const delJHDetails = params => {return axiosHttp.axiosPost("/order/xJinhuoDetails/delJHDetails", params)}

//删除进货单
export const delJH = params => {return axiosHttp.axiosPost("/order/xJinhuo/JHDel", params)}

//查询一条订单的出货记录
export const selectSellLists = params => {return axiosHttp.axiosPost("/order/xSell/selectSellLists", params)}

//查询订单信息
export const selectOneOrder = params => {return axiosHttp.axiosPost("/order/xOrder/selectOneOrder", params)}

//出货时，选择订单明细去出货，这里是展示订单明细为下拉列表
export const getOrderDetail = params => {return axiosHttp.axiosPost("/order/xOrderDetails/getOrderDetailForSelect", params)}

//提交出货信息
export const addSellList = params => {return axiosHttp.axiosPost("/order/xSell/addSellList", params)}

//查看明细
export const selectSellDetails = params => {return axiosHttp.axiosPost("/order/xSellDetails/selectSellDetails", params)}

//分页查询库存列表
export const getStock = params => {return axiosHttp.axiosPost("/order/xStock/getStock", params)}

//删除一条库存信息
export const delStock = params => {return axiosHttp.axiosPost("/order/xStock/delStock", params)}

//新增一条库存信息
export const addStock = params => {return axiosHttp.axiosPost("/order/xStock/addStock", params)}

//获取所有的货品名称即类型
export const getGoodsTypeList = params => {return axiosHttp.axiosPost("/order/xStock/getGoodsTypeList")}

//获取出货比例
export const getGoodsTotalList = params => {return axiosHttp.axiosPost("/order/xSellDetails/getGoodsTotalList", params)}

//获取收入列表
export const getShouruList = params => {return axiosHttp.axiosPost("/order/xSell/getShouruList", params)}

//获取支出列表
export const getZhichuList = params => {return axiosHttp.axiosPost("/order/xJinhuo/getZhichuList", params)}

//上传图片后保存图片地址
export const savePicUrl = params => {return axiosHttp.axiosPost("/order/xPictures/savePicUrl", params)}

//获取所有图片地址
export const loadAllPrc = params => {return axiosHttp.axiosPost("/order/xPictures/loadAllPrc")}

//查询所有日志
export const selectLogs = params => {return axiosHttp.axiosPost("/order/xSysLogs/selectLogs")}

//获取已完成订单数量
export const getFinishedOrderCount = params => {return axiosHttp.axiosPost("/order/xOrder/getFinishedOrderCount", params)}

//获取本月新增订单数量
export const getAddedOrderCount = params => {return axiosHttp.axiosPost("/order/xOrder/getAddedOrderCount", params)}
