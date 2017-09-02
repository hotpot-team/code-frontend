import * as types from './type.js'

export default{
    showloader:({ commit }) => {
        commit( types.SHOWLOADING )
    },
    hideloader:({ commit }) => {
        commit( types.HIDELOADING )
    },
}