import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/home/Main.vue'
import orderList from './views/nav1/orderList.vue'
import addOrder from './views/nav1/addOrder.vue'
import addStock from './views/nav2/addStock.vue'
import jinHuoList from './views/nav2/jinHuoList.vue'
import sell from './views/nav3/sell.vue'
import echarts from './views/charts/echarts.vue'
import stock from './views/nav4/stock.vue'
import systemlogs from './views/nav5/systemlogs.vue'

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    { 
        path: '/', 
        component: Home,
        name: 'Home',
        iconCls: 'el-icon-menu',
        children: [
            { path: '/main', component: Main, name: '主页' , iconCls: 'el-icon-cherry'}
        ]
    },
    {
        path: '/',
        component: Home,
        name: '订单模块',
        iconCls: 'el-icon-tickets',//图标样式class
        children: [
            { path: '/addOrder', component: addOrder, name: '接单' , iconCls: 'el-icon-edit-outline'},
            { path: '/orderList', component: orderList, name: '订单列表', iconCls: 'el-icon-notebook-2' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '进货模块',
        iconCls: 'el-icon-download',
        children: [
            { path: '/addStock', component: addStock, name: '我要进货', iconCls: 'el-icon-edit-outline' },
            { path: '/jinHuoList', component: jinHuoList, name: '进货列表' , iconCls: 'el-icon-notebook-2'},
        ]
    },
    {
        path: '/',
        component: Home,
        name: '出货',
        iconCls: 'el-icon-upload2',
        leaf: true,//只有一个节点
        children: [
            { path: '/sell', component: sell, name: '出货' , iconCls: 'el-icon-document'}
        ]
    },
    {
        path: '/',
        component: Home,
        name: '库存管理',
        iconCls: 'el-icon-suitcase-1',
        leaf: true,//只有一个节点
        children: [
            { path: '/stock', component: stock, name: '库存' , iconCls: 'el-icon-document'}
        ]
    },
    {
        path: '/',
        component: Home,
        name: 'Charts',
        iconCls: 'el-icon-s-help',
        children: [
            { path: '/echarts', component: echarts, name: 'echarts', iconCls: 'el-icon-grape'}
        ]
    },
    {
        path: '/',
        component: Home,
        name: '系统',
        iconCls: 'el-icon-s-tools',
        children: [
            {path: '/systemlogs', component: systemlogs, name: '更新日志', iconCls: 'el-icon-document'}
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;