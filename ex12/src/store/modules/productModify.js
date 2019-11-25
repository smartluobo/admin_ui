const state={
    proInfo:{},  //初始化proInfo
};
const actions={
    updateProInfo({commit},data){ //触发mutations里面的updateProInfo
        commit('proInfoDataUpdate',data);
    }
};
const mutations={
    proInfoDataUpdate(state,data){ //更新proInfo
        state.proInfo = data;
     }
 };
export default {
     state,
     mutations,
     actions
}