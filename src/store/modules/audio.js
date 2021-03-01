export default {
	namespaced: true,
	state: {
		audioUrl: ''
	},
	actions: {
		setAudioUrl ({ commit }, { url }) {
			commit({ type: 'setAudioUrl', url })
		}
	},
	mutations: {
		setAudioUrl (state, payload) {
			state.audioUrl = payload.url
		}
	}
}
