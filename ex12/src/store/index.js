import Vue from 'vue';
import Vuex from 'vuex';
import ProductModify from './modules/productModify'
Vue.use(Vuex);
const store = new Vuex.Store({
    modules:{
        ProductModify
    }
});
 
export default store;